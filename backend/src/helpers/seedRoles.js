import mongoose from 'mongoose'
import dotenv from 'dotenv'
import AuthorizedRole from '../models/AuthorizedRole.js'

dotenv.config()

const rolesOficiales = [
    { email: 'alex.suarez01@epn.edu.ec', role: 'docente' },
    { email: 'amymishell.diaz@epn.edu.ec', role: 'comision' }
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

        process.exit(0)
    } catch (error) {
        console.error('Error al insertar roles:', error)
        process.exit(1)
    }
}

seedDB()