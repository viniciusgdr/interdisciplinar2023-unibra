/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { type NextFunction, type Request, type Response } from 'express'
import { type User } from '../interfaces/user'

export function setLoginRedirect (req: Request, res: Response, next: NextFunction): void {
  if (req.isAuthenticated()) {
    next()
    return
  }
  // @ts-ignore
  req.session.redirectUrl = req.originalUrl || req.url
  next()
}
export function getLoginRedirect (req: Request): string {
  // @ts-ignore
  const redirect = req.session.redirectUrl
  if (redirect) {
    // @ts-ignore
    delete req.session.redirectUrl
    return redirect
  }
  return '/'
}

export function checkAuthenticated (req: Request, res: Response, next: NextFunction): void {
  if (req.isAuthenticated()) {
    next()
    return
  }
  res.redirect('/login?redirect=' + req.originalUrl)
}
export function checkAdmin (req: Request, res: Response, next: NextFunction): void {
  const user = req.user as User
  if (user.as_admin === 1) {
    next()
    return
  }
  res.redirect('/')
}
