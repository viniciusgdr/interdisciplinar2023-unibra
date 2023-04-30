import { type NextFunction, type Request, type Response } from 'express'
import { type User } from '../interfaces/user'

export function checkAuthenticated (req: Request, res: Response, next: NextFunction): void {
  if (req.isAuthenticated()) {
    next()
    return
  }
  res.redirect('/login')
}
export function checkAdmin (req: Request, res: Response, next: NextFunction): void {
  const user = req.user as User
  if (user.as_admin === 1) {
    next()
    return
  }
  res.redirect('/')
}
