import { DataTypes, Optional, Model } from "sequelize"
import DB from "../config/DBconfig"

// atributos que tiene la tabla Users
export interface CategoriesAttributes {
    categories_id: number,
    name: string,
    description: string,
    parent_id: number
}

// atributo que es opcional al momento de crear un nuevo Users
export interface CategoriesCreationAttributes extends Optional<CategoriesAttributes, "categories_id" > {}

// modelo tipado de Users
class CategoriesModel extends Model<CategoriesAttributes, CategoriesCreationAttributes> implements CategoriesAttributes {
    public categories_id!: number
    public name!: string
    public description!: string
    public parent_id!: number
}

// inicializar el modelo con sus atributos y opciones
CategoriesModel.init({
    categories_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    parent_id: DataTypes.NUMBER,
}, {
    sequelize: DB,
    tableName: "categories",
    timestamps: false
})

export default CategoriesModel