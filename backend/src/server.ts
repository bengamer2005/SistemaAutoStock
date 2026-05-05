import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()
import DB from "./config/DBconfig"
import UsersRoutes from "./routes/usersRoute"

const env = {
    PORT: Number(process.env.PORT ?? 3006),
    IP: process.env.IP ?? "localhost",
    FRONTEND: process.env.FRONTEND ?? "http://localhost:5173"
}

const app = express()

// middlewares
app.use(express.json())

app.use(cors({
    origin: process.env.FRONTEND
}))

// conectamos la DB
const connectDB = async () => {
    try {
        await DB.authenticate()
        console.log("Conexion a la base de datos establecida correctamente")
    } catch (error) {
        console.error("No se pudo conectar a la base de datos:", error)
    }
}
connectDB()

// exponemos los endpoints
app.use("/sistemaautostock/api", UsersRoutes)

// levantar servidor
app.listen(env.PORT, env.IP, () => {
    console.log(`Servidor corriendo en http://${env.IP}:${env.PORT}`)
})