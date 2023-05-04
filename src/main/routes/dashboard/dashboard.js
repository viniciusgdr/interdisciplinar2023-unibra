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
const app_1 = __importDefault(require("../../config/app"));
const db_1 = require("../../../utils/db");
const passport_1 = require("../../../utils/passport");
exports.default = (router) => {
    router.get('/dashboard', passport_1.checkAuthenticated, passport_1.checkAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const films = yield (0, db_1.getFilmsWithSessions)();
        res.render('dashboard.ejs', { user: req.user, films });
    }));
    router.post('/api/create-session', passport_1.checkAuthenticated, passport_1.checkAdmin, (req, res) => {
        const { filmId, date, availableSeats, hour } = req.body;
        if (!filmId || !date || !availableSeats || !hour) {
            res.json({
                status: 400,
                message: 'Missing parameters'
            });
            return;
        }
        if (typeof filmId !== 'string' ||
            typeof date !== 'string' ||
            typeof availableSeats !== 'string' ||
            typeof hour !== 'string') {
            res.json({
                status: 400,
                message: 'Invalid parameters'
            });
            return;
        }
        const filmIdNumber = Number(filmId);
        app_1.default.db.run(`INSERT INTO session (
        filmId,
        date,
        hour,
        available_seats)
        VALUES (?, ?, ?, ?);
      `, [
            filmIdNumber,
            date,
            hour,
            Number(availableSeats)
        ], function (err) {
            return __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    res.json({
                        status: 500,
                        message: err
                    });
                    return;
                }
                res.json({
                    status: 200,
                    message: 'Session created successfully',
                    session: yield (0, db_1.getFilmWithSessions)(filmIdNumber)
                });
            });
        });
    });
    router.post('/api/create-film', passport_1.checkAuthenticated, passport_1.checkAdmin, (req, res) => {
        const { name, description, classification, pictureUrl } = req.body;
        if (!name || !description || !classification || !pictureUrl) {
            res.json({
                status: 400,
                message: 'Missing parameters'
            });
            return;
        }
        if (typeof name !== 'string' ||
            typeof description !== 'string' ||
            typeof classification !== 'string' ||
            typeof pictureUrl !== 'string') {
            res.json({
                status: 400,
                message: 'Invalid parameters'
            });
            return;
        }
        app_1.default.db.run(`INSERT INTO film (
        name, 
        description, 
        classification, 
        picture_url)
        VALUES (?, ?, ?, ?);
      `, [
            name,
            description,
            classification,
            pictureUrl
        ], function (err) {
            return __awaiter(this, void 0, void 0, function* () {
                const row = yield (0, db_1.getFilmWithSessions)(this.lastID);
                if (err) {
                    res.json({
                        status: 500,
                        message: err
                    });
                    return;
                }
                res.json({
                    status: 200,
                    message: 'Film created successfully',
                    film: row
                });
            });
        });
    });
};
