import { Sequelize } from "sequelize"

const connectionStr = process.env.DATABASE_URL || "localhost"

const DB = new Sequelize(connectionStr, {
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
})

export default DB