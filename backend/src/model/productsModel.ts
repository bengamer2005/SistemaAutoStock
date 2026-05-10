import { DataTypes, Optional, Model } from "sequelize"
import DB from "../config/DBconfig"

// atributos que tiene la tabla Users
export interface ProductsAttributes {
    products_id: number,
    name: string,
    description: string,
    providers_id: number,
    categories_id: number,
    products_brands_id: number,
    warehouses_id: number,
    stock: number,
    min_stock: number,
    unit_price: number,
    active: boolean,
    created_by: number,
    created_at: Date,
    updated_by: number,
    updated_at: Date
}

// atributo que es opcional al momento de crear un nuevo Users
export interface ProductsCreationAttributes extends Optional<ProductsAttributes, "products_id" | "categories_id" | "updated_at" | "updated_by" > {}

// modelo tipado de Users
class ProductsModel extends Model<ProductsAttributes, ProductsCreationAttributes> implements ProductsAttributes {
    public products_id!: number
    public name!: string
    public description!: string
    public providers_id!: number
    public categories_id!: number
    public products_brands_id!: number
    public warehouses_id!: number
    public stock!: number
    public min_stock!: number
    public unit_price!: number
    public active!: boolean
    public created_by!: number
    public created_at!: Date
    public updated_by!: number
    public updated_at!: Date
}

// inicializar el modelo con sus atributos y opciones
ProductsModel.init({
    products_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    providers_id: DataTypes.NUMBER,
    categories_id: DataTypes.NUMBER,
    products_brands_id: DataTypes.NUMBER,
    warehouses_id: DataTypes.NUMBER,
    stock: DataTypes.NUMBER,
    min_stock: DataTypes.NUMBER,
    unit_price: DataTypes.DECIMAL(10, 2),
    active: DataTypes.BOOLEAN,
    created_by: DataTypes.NUMBER,
    created_at: DataTypes.DATE,
    updated_by: DataTypes.NUMBER,
    updated_at: DataTypes.DATE,
}, {
    sequelize: DB,
    tableName: "products",
    timestamps: false
})

export default ProductsModel