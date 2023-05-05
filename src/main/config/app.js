"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const express_1 = __importDefault(require("express"));
const middlewares_1 = __importDefault(require("./middlewares"));
const routes_1 = __importDefault(require("./routes"));
const db = (0, database_1.createDBConnection)();
(0, database_1.initDB)(db);
const app = (0, express_1.default)();
(0, middlewares_1.default)(app);
(0, routes_1.default)(app);
app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
exports.default = {
    db
};
