import { type Router } from 'express'
import passport from 'passport'
import app from '../config/app'
import bcrypt from 'bcrypt'
import validator from 'validator'
import { type User } from '../../interfaces/user'
async function getUserByCredentials (email: string): Promise<{ status: number, user: User | null }> {
  return await new Promise((resolve) => {
    app.db.get('SELECT * FROM user WHERE email = ?', [email], (err, row: User) => {
      if (err != null) {
        resolve({
          status: 500,
          user: null
        })
      }
      resolve({
        status: 200,
        user: row || null
      })
    })
  })
}
const saltRounds = 10
async function createUser (email: string, password: string, cpf: string, cep: string, gender: string, birthDate: string, name: string): Promise<{
  status: number
  message: Error | null
}> {
  const hashedPassword = await bcrypt.hash(password, saltRounds)
  const hashedCpf = await bcrypt.hash(cpf, saltRounds)
  const hashedCep = await bcrypt.hash(cep, saltRounds)
  return await new Promise((resolve) => {
    app.db.run(`INSERT INTO user (
        name, 
        email, 
        encrypted_password, 
        encrypted_cpf, 
        encrypted_cep, 
        birth_date, 
        gender)
        VALUES (?, ?, ?, ?, ?, ?, ?);
      `, [
      name,
      email,
      hashedPassword,
      hashedCpf,
      hashedCep,
      birthDate,
      gender
    ], (err) => {
      resolve({
        status: err ? 500 : 200,
        message: err
      })
    })
  })
}
export default (router: Router): void => {
  router.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
      res.redirect('/')
      return
    }
    res.render('login.ejs')
  })
  router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }))
  router.get('/signup', (req, res) => {
    if (req.isAuthenticated()) {
      res.redirect('/')
      return
    }
    res.render('signup.ejs')
  })
  router.post('/signup', async (req, res, next) => {
    if (
      !req.body.username ||
      !req.body.password ||
      !req.body.cpf ||
      !req.body.cep ||
      !req.body.gender ||
      !req.body.birth_date ||
      !req.body.name
    ) {
      res.status(400).send({ message: 'Missing parameters.' })
      return
    }
    const issues = []
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
    const cepRegex = /^\d{5}-\d{3}$/
    if (!cpfRegex.test(req.body.cpf) && req.body.cpf.length !== 11) issues.push('Invalid CPF.')
    if (!cepRegex.test(req.body.cep) && req.body.cep.length !== 8) issues.push('Invalid CEP.')
    if (!validator.isEmail(req.body.username)) issues.push('Invalid email.')
    if ([
      'male',
      'female'
    ].includes(req.body.birth_date)) issues.push('Birth date must be a valid date.')
    if (req.body.password < 8) issues.push('Password must be at least 8 characters long.')
    if (issues.length > 0) {
      res.status(400).send({ message: issues })
      return
    }
    const { status, user } = await getUserByCredentials(req.body.username)
    if (status !== 200) {
      res.status(500).send({ message: 'Internal server error' })
      return
    }
    if (user !== null) {
      res.status(400).send({ message: 'User already exists.' })
      return
    }
    await createUser(
      req.body.username,
      req.body.password,
      req.body.cpf,
      req.body.cep,
      req.body.gender,
      req.body.birth_date,
      req.body.name
    )
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login'
    })(req, res, next)
  })
}
