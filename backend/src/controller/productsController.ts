import { Request, Response } from "express"
import { QueryTypes } from "sequelize"

import DB from "../config/DBconfig"
import ProductsModel from "../model/productsModel"

// TYPES
type ProductsCreate = {
    name: string
    description: string
    providers_id: number
    categories_id: number
    products_brands_id: number
    warehouses_id: number
    stock: number
    min_stock: number
    unit_price: number
    active: boolean
    created_by: number
    created_at: Date
}

type ProductsUpdate = {
    name: string
    description: string
    providers_id: number
    categories_id: number
    products_brands_id: number
    warehouses_id: number
    stock: number
    min_stock: number
    unit_price: number
    updated_by: number
    updated_at: Date
}

// GET
// obtiene todos los productos
export const getProducts = async (req: Request, res: Response) => {
    try {
        const allProducts = await DB.query("SELECT * FROM vw_inventory_overview", {
            type: QueryTypes.SELECT
        })

        res.status(200).json(allProducts)
    } catch (error) {
        console.error("Error al obtener productos:", error)
        res.status(500).json({ error: "Error al obtener productos" })
    }
}

// obtiene catalogos para frontend
export const getAllInvInfo = async (req: Request, res: Response) => {
    try {
        const catalogs = await DB.query("SELECT * FROM vw_inventory_catalogs", {
            type: QueryTypes.SELECT
        })

        res.status(200).json(catalogs)
    } catch (error) {
        console.error("Error al obtener catálogos:", error)
        res.status(500).json({ error: "Error al obtener catálogos" })
    }
}

// POST
// crea un nuevo producto
export const createProduct = async (req: Request, res: Response) => {
    const body: ProductsCreate = req.body
    const transaction = await DB.transaction()

    try {
        const newProduct = await ProductsModel.create(body, {
            transaction
        })

        await transaction.commit()

        res.status(201).json({
            message: "Producto creado exitosamente",
            data: newProduct
        })
    } catch (error) {
        await transaction.rollback()

        console.error("Error al crear producto:", error)
        res.status(500).json({ error: "Error al crear producto" })
    }
}

// PUT
// actualiza producto
export const updateProduct = async (req: Request, res: Response) => {
    const body: ProductsUpdate = req.body
    const id = Number(req.params.id)
    const transaction = await DB.transaction()

    try {
        const productExists = await ProductsModel.findByPk(id)

        if(!productExists) {
            await transaction.rollback()

            return res.status(404).json({ message: "Producto no encontrado" })
        }

        await ProductsModel.update(body, {
            where: { products_id: id },
            transaction
        })

        await transaction.commit()

        res.status(200).json({ message: "Producto actualizado exitosamente" })
    } catch (error) {
        await transaction.rollback()

        console.error("Error al actualizar producto:", error)
        res.status(500).json({ error: "Error al actualizar producto" })
    }
}

// PATCH
// activar o desactivar producto
export const deactivateProduct = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const transaction = await DB.transaction()

    try {
        const product = await ProductsModel.findByPk(id)

        if(!product) {
            await transaction.rollback()
            return res.status(404).json({ message: "Producto no encontrado" })
        }

        await product.update({
            active: !product.active
        }, {
            transaction
        })

        await transaction.commit()

        res.status(200).json({
            message: `Producto ${product.active ? "activado" : "desactivado"} exitosamente`,
            active: product.active
        })

    } catch (error) {
        await transaction.rollback()

        console.error("Error al cambiar estado del producto:", error)
        res.status(500).json({ error: "Error al cambiar estado del producto" })
    }
}