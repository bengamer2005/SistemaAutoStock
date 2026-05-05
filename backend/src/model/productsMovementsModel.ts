import { DataTypes, Optional, Model } from "sequelize"
import DB from "../config/DBconfig"

// atributos que tiene la tabla ProductsMovements
export interface ProductsMovementsAttributes {
    products_movements_id: number,
    products_id: number,
    quantity: number,
    movement_type: string,
    created_by: number,
    created_at: Date
}

// atributo que es opcional al momento de crear un nuevo ProductsMovements
export interface ProductsMovementsCreationAttributes extends Optional<ProductsMovementsAttributes, "products_movements_id" > {}

// modelo tipado de ProductsMovements
class ProductsMovementsModel extends Model<ProductsMovementsAttributes, ProductsMovementsCreationAttributes> implements ProductsMovementsAttributes {
    public products_movements_id!: number
    public products_id!: number
    public quantity!: number
    public movement_type!: string
    public created_by!: number
    public created_at!: Date
}

// inicializar el modelo con sus atributos y opciones
ProductsMovementsModel.init({
    products_movements_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    products_id: DataTypes.NUMBER,
    quantity: DataTypes.NUMBER,
    movement_type: DataTypes.STRING,
    created_by: DataTypes.NUMBER,
    created_at: DataTypes.DATE,
}, {
    sequelize: DB,
    tableName: "products_movements",
    timestamps: false
})

export default ProductsMovementsModel