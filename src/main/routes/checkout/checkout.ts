import { type Router } from 'express'
import { getFilmWithSessions } from '../../../utils/db'
import { checkAuthenticated } from '../../../utils/passport'
import app from '../../config/app'
import { type User } from '../../../interfaces/user'

export default (router: Router): void => {
  router.get('/checkout', checkAuthenticated, async (req, res) => {
    if (!req.query.filmId || !req.query.sessionId) {
      res.status(500)
      res.json({ error: 'Missing query params' })
      return
    }
    const film = await getFilmWithSessions(Number(req.query.filmId))
    if (!('film' in film)) {
      res.status(404)
      res.render('404.ejs')
      return
    }
    const session = film.sessions.find((session) => session.id === Number(req.query.sessionId))
    if (!session) {
      res.status(404)
      res.render('404.ejs')
      return
    }
    res.render('checkout.ejs', { user: req.user, film: film.film, session, sessionId: req.query.sessionId })
  })
  router.post('/checkout', checkAuthenticated, async (req, res) => {
    if (
      !req.body.filmId ||
      typeof req.body.filmId !== 'string' ||
      !req.body.sessionId ||
      typeof req.body.sessionId !== 'string' ||
      !req.body.seats ||
      !req.body.dependents
    ) {
      res.status(500)
      res.json({ error: 'Missing body params' })
      return
    }
    req.body.dependents = JSON.parse(req.body.dependents)
    if (!Array.isArray(req.body.dependents)) {
      res.status(500)
      res.json({ error: 'Dependents must be an array' })
      return
    }
    for (const dependent of req.body.dependents) {
      if (
        !dependent.name ||
        typeof dependent.name !== 'string' ||
        !dependent.relationship ||
        typeof dependent.relationship !== 'string'
      ) {
        res.status(500)
        res.json({ error: 'Dependents must have name and relationship' })
        return
      }
    }
    const film = await getFilmWithSessions(Number(req.body.filmId))
    if (!('film' in film)) {
      res.status(404)
      res.render('404.ejs')
      return
    }
    app.db.run(`INSERT INTO ticket (
      sessionId, 
      userId, 
      seats
    ) VALUES (?, ?, ?)`, [
      req.body.sessionId,
      (req.user as User).id,
      req.body.seats
    ], (err) => { console.log(err) })
    for (const dependent of req.body.dependents) {
      app.db.run(`
      INSERT INTO dependent (
        name,
        userId,
        sessionId,
        relationship
      ) VALUES (?, ?, ?, ?)`, [
        dependent.name,
        (req.user as User).id,
        req.body.sessionId,
        dependent.relationship
      ], (err) => { console.log(err) })
    }
    res.render('finish.ejs', {
      user: req.user,
      session: req.session,
      film: film.film
    })
  })
}
