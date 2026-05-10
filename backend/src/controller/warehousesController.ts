import { Request, Response } from "express"
import DB from "../config/DBconfig"
import WarehousesModel from "../model/warehousesModel"

// types
type WarehouseCreate = {
    name: string
    location: string
}

type WarehouseUpdate = {
    name: string
    location: string
}

// obtiene todos los almacenes
export const getWarehouses = async (req: Request, res: Response) => {
    try {
        const warehouses = await WarehousesModel.findAll({
            order: [["warehouses_id", "DESC"]]
        })

        res.status(200).json(warehouses)
    } catch (error) {
        console.error("Error al obtener almacenes:", error)
        res.status(500).json({ error: "Error al obtener almacenes" })
    }
}

// crea almacen
export const createWarehouse = async (req: Request, res: Response) => {
    const body: WarehouseCreate = req.body
    const transaction = await DB.transaction()

    try {
        // validar nombre duplicado
        const warehouseExists = await WarehousesModel.findOne({
            where: { name: body.name }
        })

        if(warehouseExists) {
            await transaction.rollback()
            return res.status(400).json({ message: "Ya existe un almacén con ese nombre" })
        }

        const newWarehouse = await WarehousesModel.create(body, {
            transaction
        })

        await transaction.commit()

        res.status(201).json({
            message: "Almacén creado exitosamente",
            data: newWarehouse
        })
    } catch (error) {
        await transaction.rollback()

        console.error("Error al crear almacén:", error)
        res.status(500).json({ error: "Error al crear almacén" })
    }
}

// actualiza almacen
export const updateWarehouse = async (req: Request, res: Response) => {
    const body: WarehouseUpdate = req.body
    const id = Number(req.params.id)
    const transaction = await DB.transaction()

    try {
        const warehouse = await WarehousesModel.findByPk(id)

        if(!warehouse) {
            await transaction.rollback()
            return res.status(404).json({ message: "Almacén no encontrado" })
        }

        // validar nombre repetido
        const duplicatedWarehouse = await WarehousesModel.findOne({
            where: { name: body.name }
        })

        if(duplicatedWarehouse && duplicatedWarehouse.warehouses_id !== id) {
            await transaction.rollback()
            return res.status(400).json({ message: "Ya existe un almacén con ese nombre" })
        }

        await WarehousesModel.update(body, {
            where: { warehouses_id: id },
            transaction
        })

        await transaction.commit()

        res.status(200).json({ message: "Almacén actualizado exitosamente" })
    } catch (error) {
        await transaction.rollback()

        console.error("Error al actualizar almacén:", error)
        res.status(500).json({ error: "Error al actualizar almacén" })
    }
}

// elimina almacen
export const deleteWarehouse = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const transaction = await DB.transaction()

    try {
        const warehouse = await WarehousesModel.findByPk(id)

        if(!warehouse) {
            await transaction.rollback()
            return res.status(404).json({ message: "Almacén no encontrado" })
        }

        await warehouse.destroy({ transaction })
        await transaction.commit()

        res.status(200).json({ message: "Almacén eliminado exitosamente" })

    } catch (error) {
        await transaction.rollback()

        console.error("Error al eliminar almacén:", error)
        res.status(500).json({ error: "Error al eliminar almacén" })
    }
}