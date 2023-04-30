import { type Router } from 'express'
import app from '../../config/app'
import { getFilmWithSessions } from '../../../utils/db'
import { checkAuthenticated, checkAdmin } from '../../../utils/passport'

export default (router: Router): void => {
  router.get('/dashboard', checkAuthenticated, checkAdmin, (req, res) => {
    res.render('dashboard.ejs', { user: req.user })
  })
  router.post('/api/create-session', checkAuthenticated, checkAdmin, (req, res) => {
    const { filmId, date, availableSeats } = req.body
    if (!filmId || !date || !availableSeats) {
      res.json({
        status: 400,
        message: 'Missing parameters'
      })
      return
    }
    if (typeof filmId !== 'string' ||
      typeof date !== 'string' ||
      typeof availableSeats !== 'string') {
      res.json({
        status: 400,
        message: 'Invalid parameters'
      })
      return
    }
    app.db.run(`INSERT INTO session (
        filmId,
        date,
        available_seats)
        VALUES (?, ?, ?);
      `, [
      Number(filmId),
      date,
      Number(availableSeats)
    ], async function (err) {
      if (err) {
        res.json({
          status: 500,
          message: err
        })
        return
      }
      res.json({
        status: 200,
        message: 'Session created successfully',
        session: await getFilmWithSessions(this.lastID)
      })
    })
  })
  router.post('/api/create-film', checkAuthenticated, checkAdmin, (req, res) => {
    const { name, description, classification, pictureUrl } = req.body
    if (!name || !description || !classification || !pictureUrl) {
      res.json({
        status: 400,
        message: 'Missing parameters'
      })
      return
    }
    // check type
    if (typeof name !== 'string' ||
      typeof description !== 'string' ||
      typeof classification !== 'string' ||
      typeof pictureUrl !== 'string') {
      res.json({
        status: 400,
        message: 'Invalid parameters'
      })
      return
    }
    app.db.run(`INSERT INTO film (
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
    ], async function (err) {
      const row = await getFilmWithSessions(this.lastID)
      if (err) {
        res.json({
          status: 500,
          message: err
        })
        return
      }
      res.json({
        status: 200,
        message: 'Film created successfully',
        film: row
      })
    })
  })
}
