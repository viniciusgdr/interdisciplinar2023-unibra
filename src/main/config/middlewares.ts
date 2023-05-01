import express, { type Express } from 'express'
import cookieParser from 'cookie-parser'
import path from 'path'
import passport from 'passport'
import session from 'express-session'
import App from './app'
import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcrypt'
import { type User } from '../../interfaces/user'
export default (app: Express): void => {
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', '*')
    next()
  })
  app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
  }))
  app.set('view engine', 'ejs')
  app.use(passport.initialize())
  app.use(passport.session())
  passport.use(new LocalStrategy((username, password, done) => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    App.db.get('SELECT * FROM user WHERE email = ?', [username], async (err, row: User) => {
      if (err != null) {
        done(err)
      }
      if (!row) {
        done(null, false, { message: 'Incorrect username.' }); return
      }
      const isPasswordCorrect = await bcrypt.compare(password, row.encrypted_password)
      if (!isPasswordCorrect) {
        done(null, false, { message: 'Incorrect password.' }); return
      }
      done(null, row)
    })
  }))
  passport.serializeUser((user, done) => {
    done(null, user)
  })
  passport.deserializeUser((userObj: User, done) => {
    done(null, userObj)
  })
  app.use(cookieParser())
  app.use(express.static(path.join(__dirname, '..', '..', '..', 'public')))
}
