import { DataTypes, Optional, Model } from "sequelize"
import DB from "../config/DBconfig"

// atributos que tiene la tabla Providers
export interface ProvidersAttributes {
    providers_id: number,
    name: string,
    description: string,
    active: boolean,
    created_by: number,
    created_at: Date,
    updated_by: number,
    updated_at: Date
}

// atributo que es opcional al momento de crear un nuevo Providers
export interface ProvidersCreationAttributes extends Optional<ProvidersAttributes, "providers_id" | "updated_at" | "updated_by" > {}

// modelo tipado de Providers
class ProvidersModel extends Model<ProvidersAttributes, ProvidersCreationAttributes> implements ProvidersAttributes {
    public providers_id!: number
    public name!: string
    public description!: string
    public active!: boolean
    public created_by!: number
    public created_at!: Date
    public updated_by!: number
    public updated_at!: Date
}

// inicializar el modelo con sus atributos y opciones
ProvidersModel.init({
    providers_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    created_by: DataTypes.NUMBER,
    created_at: DataTypes.DATE,
    updated_by: DataTypes.NUMBER,
    updated_at: DataTypes.DATE,
}, {
    sequelize: DB,
    tableName: "providers",
    timestamps: false
})

export default ProvidersModel