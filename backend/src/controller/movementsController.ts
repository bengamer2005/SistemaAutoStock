import { Request, Response } from "express"
import { QueryTypes } from "sequelize"
import DB from "../config/DBconfig"
import ProductsModel from "../model/productsModel"
import ProductsMovementsModel from "../model/productsMovementsModel"

// types
type MovementCreate = {
    products_id: number
    quantity: number
    created_by: number
    created_at: Date
}

// helpers
// valida stock disponible
export const validateStock = async (
    products_id: number,
    quantity: number
): Promise<boolean> => {
    const product = await ProductsModel.findByPk(products_id)

    if(!product) return false

    return product.stock >= quantity
}

// GET
// obtiene todos los movimientos
export const getMovements = async (req: Request, res: Response) => {
    try {
        const movements = await DB.query("SELECT * FROM vw_products_movements ORDER BY created_at DESC", {
            type: QueryTypes.SELECT
        })

        res.status(200).json(movements)
    } catch (error) {
        console.error("Error al obtener movimientos:", error)
        res.status(500).json({ error: "Error al obtener movimientos" })
    }
}

// obtiene movimientos por producto
export const getMovementsByProduct = async (req: Request, res: Response) => {
    const id = Number(req.params.id)

    try {
        const movements = await DB.query(`
            SELECT * FROM vw_products_movements
            WHERE products_id = :id
            ORDER BY created_at DESC
        `, {
            replacements: { id },
            type: QueryTypes.SELECT
        })

        res.status(200).json(movements)
    } catch (error) {
        console.error("Error al obtener movimientos del producto:", error)
        res.status(500).json({ error: "Error al obtener movimientos del producto" })
    }
}

// POST
// entrada de inventario
export const createEntryMovement = async (req: Request, res: Response) => {
    const body: MovementCreate = req.body
    const transaction = await DB.transaction()

    try {
        const product = await ProductsModel.findByPk(body.products_id)

        if(!product) {
            await transaction.rollback()
            return res.status(404).json({ message: "Producto no encontrado" })
        }

        // crear movimiento
        const movement = await ProductsMovementsModel.create({
            ...body,
            movement_type: "ENTRY"
        }, {
            transaction
        })

        // actualizar stock
        await product.update({
            stock: product.stock + body.quantity
        }, {
            transaction
        })

        await transaction.commit()

        res.status(201).json({
            message: "Entrada registrada exitosamente",
            data: movement
        })

    } catch (error) {
        await transaction.rollback()

        console.error("Error al registrar entrada:", error)
        res.status(500).json({ error: "Error al registrar entrada" })
    }
}

// POST
// salida de inventario
export const createExitMovement = async (req: Request, res: Response) => {
    const body: MovementCreate = req.body
    const transaction = await DB.transaction()

    try {
        const product = await ProductsModel.findByPk(body.products_id)

        if(!product) {
            await transaction.rollback()
            return res.status(404).json({ message: "Producto no encontrado" })
        }

        // validar stock
        const hasStock = await validateStock(
            body.products_id,
            body.quantity
        )

        if(!hasStock) {
            await transaction.rollback()
            return res.status(400).json({ message: "Stock insuficiente" })
        }

        // crear movimiento
        const movement = await ProductsMovementsModel.create({
            ...body,
            movement_type: "EXIT"
        }, {
            transaction
        })

        // descontar stock
        await product.update({
            stock: product.stock - body.quantity
        }, {
            transaction
        })

        await transaction.commit()

        res.status(201).json({
            message: "Salida registrada exitosamente",
            data: movement
        })
    } catch (error) {
        await transaction.rollback()

        console.error("Error al registrar salida:", error)
        res.status(500).json({ error: "Error al registrar salida" })
    }
}