import { type Router } from 'express'
import { getFilmWithSessions } from '../../../utils/db'
import { checkAuthenticated } from '../../../utils/passport'

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
    res.render('finish.ejs', { user: req.user, session: req.session, film: req.body.film, sessionId: req.body.sessionId, seats: req.body.seats })
  })
}
