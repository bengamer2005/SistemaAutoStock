import { DataTypes, Optional, Model } from "sequelize"
import DB from "../config/DBconfig"

// atributos que tiene la tabla ProductsBrands
export interface ProductsBrandsAttributes {
    products_brands_id: number,
    brand_name: string,
    created_by: number,
    created_at: Date,
    updated_by: number,
    updated_at: Date
}

// atributo que es opcional al momento de crear un nuevo ProductsBrands
export interface ProductsBrandsCreationAttributes extends Optional<ProductsBrandsAttributes, "products_brands_id" | "updated_at" | "updated_by" > {}

// modelo tipado de ProductsBrands
class ProductsBrandsModel extends Model<ProductsBrandsAttributes, ProductsBrandsCreationAttributes> implements ProductsBrandsAttributes {
    public products_brands_id!: number
    public brand_name!: string
    public created_by!: number
    public created_at!: Date
    public updated_by!: number
    public updated_at!: Date
}

// inicializar el modelo con sus atributos y opciones
ProductsBrandsModel.init({
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

export default ProductsBrandsModel