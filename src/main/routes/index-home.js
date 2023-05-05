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
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../utils/db");
exports.default = (router) => {
    router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const films = yield (0, db_1.getFilms)();
        res.render('index.ejs', { user: req.user, session: req.session, films });
    }));
    router.get('/filme/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const session = yield (0, db_1.getFilmWithSessions)(Number(req.params.id));
        if (!('film' in session)) {
            res.status(404);
            res.render('404.ejs');
            return;
        }
        res.render('film.ejs', { user: req.user, session: req.session, film: session.film, sessions: session.sessions });
    }));
    router.get('/logout', (req, res) => {
        req.logOut({
            keepSessionInfo: false
        }, () => {
            res.redirect('/');
        });
    });
};
