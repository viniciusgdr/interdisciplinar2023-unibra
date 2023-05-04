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
exports.getFilmsWithSessions = exports.getFilms = exports.getFilmWithSessions = void 0;
const app_1 = __importDefault(require("../main/config/app"));
function getFilmWithSessions(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield new Promise((resolve) => {
            app_1.default.db.get('SELECT * FROM film WHERE id = ?', [id], (_err, row) => {
                if (_err !== null && _err !== void 0 ? _err : !row) {
                    resolve({
                        status: 404
                    });
                }
                app_1.default.db.all('SELECT * FROM session WHERE filmId = ?', [id], (_err2, rows) => {
                    if (_err !== null && _err !== void 0 ? _err : _err2) {
                        console.error(_err);
                        console.error(_err2);
                    }
                    resolve({
                        status: 200,
                        film: row,
                        sessions: rows
                    });
                });
            });
        });
    });
}
exports.getFilmWithSessions = getFilmWithSessions;
function getFilms() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield new Promise((resolve) => {
            app_1.default.db.all('SELECT * FROM film', (err, rows) => {
                if (err) {
                    console.error(err);
                }
                resolve(rows);
            });
        });
    });
}
exports.getFilms = getFilms;
function getFilmsWithSessions() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield new Promise((resolve) => {
            const films = [];
            app_1.default.db.all('SELECT * FROM film', (_err, rows) => {
                for (const row of rows) {
                    app_1.default.db.all('SELECT * FROM session WHERE filmId = ?', [row.id], (_err2, rows2) => {
                        if (_err !== null && _err !== void 0 ? _err : _err2) {
                            console.error(_err);
                            console.error(_err2);
                        }
                        films.push({
                            film: row,
                            sessions: rows2
                        });
                        if (films.length === rows.length) {
                            resolve(films);
                        }
                    });
                }
                if (rows.length === 0) {
                    resolve(films);
                }
            });
        });
    });
}
exports.getFilmsWithSessions = getFilmsWithSessions;
