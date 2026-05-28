import app from './server.js'
import connection from './database.js'

// Conexión a MongoDB
connection()

// Levantar servidor
app.listen(app.get('port'), () => {
    console.log(`Servidor de tesis ejecutándose en http://localhost:${app.get('port')}`)
})