import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()
import DB from "./config/DBconfig"

const env = {
    PORT: Number(process.env.PORT ?? 3007),
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

import authRoutes from "./routes/authRoute"
import usersRoutes from "./routes/usersRoute"
import productsroutes from "./routes/productsRoute"
import movementsRoute from "./routes/movementsRoute"
import categoriesRoute from "./routes/categoriesRoute"
import providersRoute from "./routes/providersRoute"
import brandsRoute from "./routes/brandsRoute"
import warehousesRoute from "./routes/warehousesRoute"

// exponemos los endpoints
app.use("/autostock/api/auth", authRoutes)
app.use("/autostock/api/users", usersRoutes)
app.use("/autostock/api/products", productsroutes)
app.use("/autostock/api/movements", movementsRoute)
app.use("/autostock/api/categories", categoriesRoute)
app.use("/autostock/api/providers", providersRoute)
app.use("/autostock/api/brands", brandsRoute)
app.use("/autostock/api/warehouses", warehousesRoute)

// levantar servidor
app.listen(env.PORT, env.IP, () => {
    console.log(`Servidor corriendo en http://${env.IP}:${env.PORT}`)
})