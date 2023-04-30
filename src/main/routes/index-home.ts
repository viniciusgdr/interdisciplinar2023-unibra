import { type Router } from 'express'
import { getFilmWithSessions, getFilms } from '../../utils/db'

export default (router: Router): void => {
  router.get('/', async (req, res) => {
    const films = await getFilms()
    res.render('index.ejs', { user: req.user, session: req.session, films })
  })
  router.get('/film/:id', async (req, res) => {
    const session = await getFilmWithSessions(Number(req.params.id))
    res.render('film.ejs', { user: req.user, session: req.session, film: session.film, sessions: session.sessions })
  })
  router.get('/logout', (req, res) => {
    req.logOut({
      keepSessionInfo: false
    }, () => {
      res.redirect('/')
    })
  })
}
