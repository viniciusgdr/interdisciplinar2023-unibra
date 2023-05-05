import { Router, type Express } from 'express'
import FastGlob from 'fast-glob'
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()
export default (app: Express): void => {
  const router = Router()
  const routerHome = Router()
  app.use('/', router)
  app.use('/', routerHome)
  FastGlob.sync([
    process.env.PROD ? '**/dist/main/routes/**-routes.ts' : '**/src/main/routes/**-routes.ts',
    process.env.PROD ? '**/dist/main/routes/**/**.ts' : '**/src/main/routes/**/**.ts'
  ]).map(async file => {
    (await import(`../../../${file}`)).default(router)
  })
  FastGlob.sync([
    process.env.PROD ? '**/dist/main/routes/**-home.ts' : '**/src/main/routes/**-home.ts'
  ]).map(async file => {
    (await import(`../../../${file}`)).default(routerHome)
  })
}
