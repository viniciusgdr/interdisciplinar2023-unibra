"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const app_1 = __importDefault(require("../config/app"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const validator_1 = __importDefault(require("validator"));
const passport_2 = require("../../utils/passport");
function getUserByCredentials(email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield new Promise((resolve) => {
            app_1.default.db.get('SELECT * FROM user WHERE email = ?', [email], (err, row) => {
                if (err != null) {
                    resolve({
                        status: 500,
                        user: null
                    });
                }
                resolve({
                    status: 200,
                    user: row || null
                });
            });
        });
    });
}
const saltRounds = 10;
function createUser(email, password, cpf, cep, gender, birthDate, name) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
        const hashedCpf = yield bcrypt_1.default.hash(cpf, saltRounds);
        const hashedCep = yield bcrypt_1.default.hash(cep, saltRounds);
        return yield new Promise((resolve) => {
            app_1.default.db.run(`INSERT INTO user (
        name, 
        email, 
        encrypted_password, 
        encrypted_cpf, 
        encrypted_cep, 
        birth_date, 
        gender)
        VALUES (?, ?, ?, ?, ?, ?, ?);
      `, [
                name,
                email,
                hashedPassword,
                hashedCpf,
                hashedCep,
                birthDate,
                gender
            ], (err) => {
                resolve({
                    status: err ? 500 : 200,
                    message: err
                });
            });
        });
    });
}
exports.default = (router) => {
    router.get('/login', (req, res) => {
        if (req.isAuthenticated()) {
            res.redirect('/');
            return;
        }
        res.render('login.ejs');
    });
    router.post('/login', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        passport_1.default.authenticate('local', (err, user) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                res.status(500).send({ message: 'Internal server error.' });
                return;
            }
            if (!user) {
                res.status(401).send({ message: 'Invalid credentials.' });
                return;
            }
            const loginRedirect = (0, passport_2.getLoginRedirect)(req);
            req.logIn(user, (err) => {
                if (err) {
                    res.status(500).send({ message: 'Internal server error.' });
                    return;
                }
                res.redirect(loginRedirect);
            });
        }))(req, res, next);
    }));
    router.get('/signup', (req, res) => {
        if (req.isAuthenticated()) {
            res.redirect('/');
            return;
        }
        res.render('signup.ejs');
    });
    router.post('/signup', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.body.username ||
            !req.body.password ||
            !req.body.cpf ||
            !req.body.cep ||
            !req.body.gender ||
            !req.body.birth_date ||
            !req.body.name) {
            res.status(400).send({ message: 'Missing parameters.' });
            return;
        }
        const issues = [];
        const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        const cepRegex = /^\d{5}-\d{3}$/;
        if (!cpfRegex.test(req.body.cpf) && req.body.cpf.length !== 11)
            issues.push('Invalid CPF.');
        if (!cepRegex.test(req.body.cep) && req.body.cep.length !== 8)
            issues.push('Invalid CEP.');
        if (!validator_1.default.isEmail(req.body.username))
            issues.push('Invalid email.');
        if ([
            'male',
            'female'
        ].includes(req.body.birth_date))
            issues.push('Birth date must be a valid date.');
        if (req.body.password < 8)
            issues.push('Password must be at least 8 characters long.');
        if (issues.length > 0) {
            res.status(400).send({ message: issues });
            return;
        }
        const { status, user } = yield getUserByCredentials(req.body.username);
        if (status !== 200) {
            res.status(500).send({ message: 'Internal server error' });
            return;
        }
        if (user !== null) {
            res.status(400).send({ message: 'User already exists.' });
            return;
        }
        yield createUser(req.body.username, req.body.password, req.body.cpf, req.body.cep, req.body.gender, req.body.birth_date, req.body.name);
        passport_1.default.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login'
        })(req, res, next);
    }));
};
