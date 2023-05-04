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
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const app_1 = __importDefault(require("./app"));
const passport_local_1 = require("passport-local");
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.default = (app) => {
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', '*');
        next();
    });
    app.use((0, express_session_1.default)({
        secret: 'secret',
        resave: false,
        saveUninitialized: true
    }));
    app.set('view engine', 'ejs');
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    passport_1.default.use(new passport_local_1.Strategy((username, password, done) => {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        app_1.default.db.get('SELECT * FROM user WHERE email = ?', [username], (err, row) => __awaiter(void 0, void 0, void 0, function* () {
            if (err != null) {
                done(err);
            }
            if (!row) {
                done(null, false, { message: 'Incorrect username.' });
                return;
            }
            const isPasswordCorrect = yield bcrypt_1.default.compare(password, row.encrypted_password);
            if (!isPasswordCorrect) {
                done(null, false, { message: 'Incorrect password.' });
                return;
            }
            done(null, row);
        }));
    }));
    passport_1.default.serializeUser((user, done) => {
        done(null, user);
    });
    passport_1.default.deserializeUser((userObj, done) => {
        done(null, userObj);
    });
    app.use((0, cookie_parser_1.default)());
    app.use(express_1.default.static(path_1.default.join(__dirname, '..', '..', '..', 'public')));
};
