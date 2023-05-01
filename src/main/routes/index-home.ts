import { type Router } from 'express'
import { getFilmWithSessions, getFilms } from '../../utils/db'
import { checkAuthenticated } from '../../utils/passport'

export default (router: Router): void => {
  router.get('/', async (req, res) => {
    const films = await getFilms()
    res.render('index.ejs', { user: req.user, session: req.session, films })
  })
  router.get('/filme/:id', async (req, res) => {
    const session = await getFilmWithSessions(Number(req.params.id))
    if (session.status === 404) {
      res.status(404)
      res.render('404.ejs', { user: req.user, session: req.session })
      return
    }
    res.render('film.ejs', { user: req.user, session: req.session, film: session.film, sessions: session.sessions })
  })
  router.get('/checkout', checkAuthenticated, (req, res) => {
    res.render('checkout.ejs', { user: req.user, session: req.session })
  })
  router.get('/logout', (req, res) => {
    req.logOut({
      keepSessionInfo: false
    }, () => {
      res.redirect('/')
    })
  })
}
