import { Request, Response } from "express"
import { QueryTypes } from "sequelize"
import DB from "../config/DBconfig"
import ProductsModel from "../model/productsModel"
import ProductsMovementsModel from "../model/productsMovementsModel"
import type { AuthRequest } from "../middleware/authMiddleware"

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
// obtiene todos los movimientos (operadores solo ven los suyos)
export const getMovements = async (req: AuthRequest, res: Response) => {
    try {
        const userRole = req.user?.role
        const userId = req.user?.id

        const movements = userRole === 2
            ? await DB.query("SELECT * FROM vw_products_movements WHERE created_by = :userId ORDER BY created_at DESC", { replacements: { userId }, type: QueryTypes.SELECT })
            : await DB.query("SELECT * FROM vw_products_movements ORDER BY created_at DESC", { type: QueryTypes.SELECT })

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

    try {
        if (!body.quantity || Number(body.quantity) <= 0) {
            return res.status(400).json({ message: "La cantidad debe ser mayor a cero" })
        }

        const product = await ProductsModel.findByPk(body.products_id)

        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" })
        }

        await ProductsMovementsModel.create({
            products_id: body.products_id,
            quantity: body.quantity,
            movement_type: "entrada",
            created_by: body.created_by,
            created_at: body.created_at,
        })

        await ProductsModel.update(
            { stock: Number(product.stock) + Number(body.quantity) },
            { where: { products_id: body.products_id } }
        )

        res.status(201).json({ message: "Entrada registrada exitosamente" })

    } catch (error) {
        console.error("Error al registrar entrada:", error)
        const msg = error instanceof Error ? error.message : "Error al registrar entrada"
        res.status(500).json({ error: msg })
    }
}

// POST
// salida de inventario
export const createExitMovement = async (req: Request, res: Response) => {
    const body: MovementCreate = req.body

    try {
        if (!body.quantity || Number(body.quantity) <= 0) {
            return res.status(400).json({ message: "La cantidad debe ser mayor a cero" })
        }

        const product = await ProductsModel.findByPk(body.products_id)

        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" })
        }

        const hasStock = Number(product.stock) >= Number(body.quantity)

        if (!hasStock) {
            return res.status(400).json({
                message: `La cantidad solicitada (${body.quantity}) supera el stock disponible (${product.stock})`
            })
        }

        await ProductsMovementsModel.create({
            products_id: body.products_id,
            quantity: body.quantity,
            movement_type: "salida",
            created_by: body.created_by,
            created_at: body.created_at,
        })

        await ProductsModel.update(
            { stock: Number(product.stock) - Number(body.quantity) },
            { where: { products_id: body.products_id } }
        )

        res.status(201).json({ message: "Salida registrada exitosamente" })

    } catch (error) {
        console.error("Error al registrar salida:", error)
        const msg = error instanceof Error ? error.message : "Error al registrar salida"
        res.status(500).json({ error: msg })
    }
}