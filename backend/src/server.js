import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import estudianteRoutes from './routers/estudiante_routes.js'
import docenteRoutes from './routers/docente_routes.js'
import comisionRoutes from './routers/comision_routes.js'
import cloudinary from 'cloudinary'
import fileUpload from "express-fileupload"

dotenv.config()
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const app = express()
app.set('port', process.env.PORT || 3000)
app.use(cors({
    origin: process.env.URL_FRONTEND,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : './uploads'
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send('Sistema Inteligente de Recomendación de Tesis')
})

app.use('/api/estudiante', estudianteRoutes)
app.use('/api/docente', docenteRoutes)
app.use('/api/comision', comisionRoutes)

app.use((req, res) => {
    res.status(404).json({
        msg: 'Endpoint no encontrado'
    })
})

export default app