import { DataTypes, Optional, Model } from "sequelize"
import DB from "../config/DBconfig"

// atributos que tiene la tabla Warehouses
export interface WarehousesAttributes {
    warehouses_id: number,
    name: string,
    location: string
}

// atributo que es opcional al momento de crear un nuevo Warehouses
export interface WarehousesCreationAttributes extends Optional<WarehousesAttributes, "warehouses_id" > {}

// modelo tipado de Warehouses
class WarehousesModel extends Model<WarehousesAttributes, WarehousesCreationAttributes> implements WarehousesAttributes {
    public warehouses_id!: number
    public name!: string
    public location!: string
}

// inicializar el modelo con sus atributos y opciones
WarehousesModel.init({
    warehouses_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: DataTypes.STRING,
    location: DataTypes.STRING
}, {
    sequelize: DB,
    tableName: "warehouses",
    timestamps: false
})

export default WarehousesModel