import app from '../main/config/app'

export interface Film {
  id: number
  name: string
  description: string
  classification: string
  picture_url: string
  created_at: string
}
export interface Session {
  id: number
  filmId: number
  date: string
  available_seats: number
}
export async function getFilmWithSessions (id: number): Promise<{
  status: number
  film: Film
  sessions: Session[]
}> {
  return await new Promise((resolve) => {
    app.db.get('SELECT * FROM film WHERE id = ?', [id], (_err, row: Film) => {
      app.db.all('SELECT * FROM session WHERE filmId = ?', [id], (_err2: any, rows: Session[]) => {
        resolve({
          status: 200,
          film: row,
          sessions: rows
        })
      })
    })
  })
}
export async function getFilms (): Promise<Film[]> {
  return await new Promise((resolve) => {
    app.db.all('SELECT * FROM film', (err, rows: Film[]) => {
      if (err) {
        console.error(err)
      }
      resolve(rows)
    })
  })
}
