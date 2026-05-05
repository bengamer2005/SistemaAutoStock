import { DataTypes, Optional, Model } from "sequelize"
import DB from "../config/DBconfig"

// atributos que tiene la tabla Users
export interface UsersAttributes {
    users_id: number,
    name: string,
    last_name: string,
    email: string,
    password: string,
    roles_id: number,
    active: boolean,
    created_at: Date,
    updated_by: number
    updated_at: Date
}

// atributo que es opcional al momento de crear un nuevo Users
export interface UsersCreationAttributes extends Optional<UsersAttributes, "users_id" | "updated_at" | "updated_by" > {}

// modelo tipado de Users
class UsersModel extends Model<UsersAttributes, UsersCreationAttributes> implements UsersAttributes {
    public users_id!: number
    public name!: string
    public last_name!: string
    public email!: string
    public password!: string
    public roles_id!: number
    public active!: boolean
    public created_at!: Date
    public updated_by!: number
    public updated_at!: Date
}

// inicializar el modelo con sus atributos y opciones
UsersModel.init({
    users_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    password: DataTypes.STRING,
    roles_id: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN,
    created_at: DataTypes.DATE,
    updated_by: DataTypes.NUMBER,
    updated_at: DataTypes.DATE,
}, {
    sequelize: DB,
    tableName: "users",
    timestamps: false
})

export default UsersModel