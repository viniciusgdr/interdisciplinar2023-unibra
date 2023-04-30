import { createDBConnection, initDB } from './database'
import express from 'express'
import setupMiddlewares from './middlewares'
import setupRoutes from './routes'

const db = createDBConnection()
initDB(db)
const app = express()
setupMiddlewares(app)
setupRoutes(app)

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000')
})
export default {
  db
}
