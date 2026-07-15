import mongoose from 'mongoose'
import dotenv from 'dotenv'
import AuthorizedRole from '../models/AuthorizedRole.js'

dotenv.config() // Para leer tu .env

const rolesOficiales = [
    { email: 'maykolaico@gmail.com', role: 'docente' }
]

const seedDB = async () => {
    try {
        // 1. Nos conectamos a la BD
        await mongoose.connect(process.env.MONGODB_URI_PRODUCTION)
        console.log('Conectado a MongoDB...')

        // 2. Limpiamos la colección para no duplicar datos (Opcional)
        await AuthorizedRole.deleteMany()
        console.log('Colección anterior limpiada...')

        // 3. Insertamos masivamente usando Mongoose
        await AuthorizedRole.insertMany(rolesOficiales)
        console.log('Roles autorizados insertados correctamente!')

        process.exit(0) // Cerramos el script con éxito
    } catch (error) {
        console.error('Error al insertar roles:', error)
        process.exit(1) // Cerramos con error
    }
}

seedDB()