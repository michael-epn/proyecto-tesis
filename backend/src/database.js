import mongoose from 'mongoose'

mongoose.set('strictQuery', true)

const connection = async () => {
    try {
        // Se llama a la URI de producción definida en el .env
        const { connection } = await mongoose.connect(process.env.MONGODB_URI_PRODUCTION)
        console.log(`Base de datos conectada en ${connection.host} - ${connection.port}`)
    } catch (error) {
        console.log(error)
    }
}

export default connection