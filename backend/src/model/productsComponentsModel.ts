import { DataTypes, Optional, Model } from "sequelize"
import DB from "../config/DBconfig"

// atributos que tiene la tabla ProductsComponents
export interface ProductsComponentsAttributes {
    products_components_id: number,
    products_id: number,
    component_name: string,
    component_quantity: number,
    created_by: number,
    created_at: Date,
    updated_by: number,
    updated_at: Date
}

// atributo que es opcional al momento de crear un nuevo ProductsComponents
export interface ProductsComponentsCreationAttributes extends Optional<ProductsComponentsAttributes, "products_components_id" | "updated_at" | "updated_by" > {}

// modelo tipado de ProductsComponents
class ProductsComponentsModel extends Model<ProductsComponentsAttributes, ProductsComponentsCreationAttributes> implements ProductsComponentsAttributes {
    public products_components_id!: number
    public products_id!: number
    public component_name!: string
    public component_quantity!: number
    public created_by!: number
    public created_at!: Date
    public updated_by!: number
    public updated_at!: Date
}

// inicializar el modelo con sus atributos y opciones
ProductsComponentsModel.init({
    products_components_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    products_id: DataTypes.NUMBER,
    component_name: DataTypes.STRING,
    component_quantity: DataTypes.NUMBER,
    created_by: DataTypes.NUMBER,
    created_at: DataTypes.DATE,
    updated_by: DataTypes.NUMBER,
    updated_at: DataTypes.DATE,
}, {
    sequelize: DB,
    tableName: "products_components",
    timestamps: false
})

export default ProductsComponentsModel