import { Router, type Express } from 'express'
import FastGlob from 'fast-glob'
export default (app: Express): void => {
  const router = Router()
  const routerHome = Router()
  app.use('/', router)
  app.use('/', routerHome)
  FastGlob.sync([
    '**/src/main/routes/**-routes.ts',
    '**/src/main/routes/**/**.ts'
  ]).map(async file => {
    (await import(`../../../${file}`)).default(router)
  })
  FastGlob.sync('**/src/main/routes/**-home.ts').map(async file => {
    (await import(`../../../${file}`)).default(routerHome)
  })
}
