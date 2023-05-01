import { type Router } from 'express'
import { getFilmWithSessions, getFilms } from '../../utils/db'
import { checkAuthenticated, setLoginRedirect } from '../../utils/passport'

export default (router: Router): void => {
  router.get('/', async (req, res) => {
    const films = await getFilms()
    res.render('index.ejs', { user: req.user, session: req.session, films })
  })
  router.get('/filme/:id', async (req, res) => {
    const session = await getFilmWithSessions(Number(req.params.id))
    if (!('film' in session)) {
      res.status(404)
      res.render('404.ejs')
      return
    }
    res.render('film.ejs', { user: req.user, session: req.session, film: session.film, sessions: session.sessions })
  })
  router.get('/checkout', setLoginRedirect, checkAuthenticated, async (req, res) => {
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
  router.get('/logout', (req, res) => {
    req.logOut({
      keepSessionInfo: false
    }, () => {
      res.redirect('/')
    })
  })
}
