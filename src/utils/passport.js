"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAdmin = exports.checkAuthenticated = exports.getLoginRedirect = exports.setLoginRedirect = void 0;
function setLoginRedirect(req, res, next) {
    if (req.isAuthenticated()) {
        next();
        return;
    }
    // @ts-ignore
    req.session.redirectUrl = req.originalUrl || req.url;
}
exports.setLoginRedirect = setLoginRedirect;
function getLoginRedirect(req) {
    // @ts-ignore
    const redirect = req.session.redirectUrl;
    if (redirect) {
        // @ts-ignore
        delete req.session.redirectUrl;
        return redirect;
    }
    return '/';
}
exports.getLoginRedirect = getLoginRedirect;
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next();
        return;
    }
    setLoginRedirect(req, res, next);
    res.redirect('/login?redirect=' + req.originalUrl);
}
exports.checkAuthenticated = checkAuthenticated;
function checkAdmin(req, res, next) {
    const user = req.user;
    if ((user === null || user === void 0 ? void 0 : user.as_admin) === 1) {
        next();
        return;
    }
    res.redirect('/');
}
exports.checkAdmin = checkAdmin;
