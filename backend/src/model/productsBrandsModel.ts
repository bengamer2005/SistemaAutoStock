import { DataTypes, Optional, Model } from "sequelize"
import DB from "../config/DBconfig"

// atributos que tiene la tabla Users
export interface ProductsAttributes {
    products_brands_id: number,
    brand_name: string,
    created_by: number,
    created_at: Date,
    updated_by: number,
    updated_at: Date
}

// atributo que es opcional al momento de crear un nuevo Users
export interface ProductsCreationAttributes extends Optional<ProductsAttributes, "products_brands_id" | "updated_at" | "updated_by" > {}

// modelo tipado de Users
class ProductsModel extends Model<ProductsAttributes, ProductsCreationAttributes> implements ProductsAttributes {
    public products_brands_id!: number
    public brand_name!: string
    public created_by!: number
    public created_at!: Date
    public updated_by!: number
    public updated_at!: Date
}

// inicializar el modelo con sus atributos y opciones
ProductsModel.init({
    products_brands_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    brand_name: DataTypes.STRING,
    created_by: DataTypes.NUMBER,
    created_at: DataTypes.DATE,
    updated_by: DataTypes.NUMBER,
    updated_at: DataTypes.DATE,
}, {
    sequelize: DB,
    tableName: "products_brands",
    timestamps: false
})

export default ProductsModel