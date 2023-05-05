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
const db_1 = require("../../../utils/db");
const passport_1 = require("../../../utils/passport");
const app_1 = __importDefault(require("../../config/app"));
exports.default = (router) => {
    router.get('/checkout', passport_1.checkAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.query.filmId || !req.query.sessionId) {
            res.status(500);
            res.json({ error: 'Missing query params' });
            return;
        }
        const film = yield (0, db_1.getFilmWithSessions)(Number(req.query.filmId));
        if (!('film' in film)) {
            res.status(404);
            res.render('404.ejs');
            return;
        }
        const session = film.sessions.find((session) => session.id === Number(req.query.sessionId));
        if (!session) {
            res.status(404);
            res.render('404.ejs');
            return;
        }
        res.render('checkout.ejs', { user: req.user, film: film.film, session, sessionId: req.query.sessionId });
    }));
    router.post('/checkout', passport_1.checkAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.body.filmId ||
            typeof req.body.filmId !== 'string' ||
            !req.body.sessionId ||
            typeof req.body.sessionId !== 'string' ||
            !req.body.seats ||
            !req.body.dependents) {
            res.status(500);
            res.json({ error: 'Missing body params' });
            return;
        }
        req.body.dependents = JSON.parse(req.body.dependents);
        if (!Array.isArray(req.body.dependents)) {
            res.status(500);
            res.json({ error: 'Dependents must be an array' });
            return;
        }
        for (const dependent of req.body.dependents) {
            if (!dependent.name ||
                typeof dependent.name !== 'string' ||
                !dependent.relationship ||
                typeof dependent.relationship !== 'string') {
                res.status(500);
                res.json({ error: 'Dependents must have name and relationship' });
                return;
            }
        }
        const film = yield (0, db_1.getFilmWithSessions)(Number(req.body.filmId));
        if (!('film' in film)) {
            res.status(404);
            res.render('404.ejs');
            return;
        }
        app_1.default.db.run(`INSERT INTO ticket (
      sessionId, 
      userId, 
      seats
    ) VALUES (?, ?, ?)`, [
            req.body.sessionId,
            req.user.id,
            req.body.seats
        ], (err) => { console.log(err); });
        for (const dependent of req.body.dependents) {
            app_1.default.db.run(`
      INSERT INTO dependent (
        name,
        userId,
        sessionId,
        relationship
      ) VALUES (?, ?, ?, ?)`, [
                dependent.name,
                req.user.id,
                req.body.sessionId,
                dependent.relationship
            ], (err) => { console.log(err); });
        }
        res.render('finish.ejs', {
            user: req.user,
            session: req.session,
            film: film.film
        });
    }));
};
