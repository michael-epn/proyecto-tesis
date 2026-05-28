import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import estudianteRoutes from './routers/estudiante_routes.js'
import docenteRoutes from './routers/docente_routes.js'
import direccionRoutes from './routers/direccion_routes.js'
import cors from 'cors'

const app = express()
dotenv.config()

app.set('port', process.env.PORT || 3000)

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send("Sistema Inteligente de Recomendacion de Tesis")
})

app.use('/api/estudiante', estudianteRoutes)
app.use('/api/docente', docenteRoutes)
app.use('/api/direccion', direccionRoutes)

const corsOptions = {
    origin: process.env.URL_FRONTEND,
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

app.use((req, res) => res.status(404).send("Endpoint no encontrado - 404"))

export default app