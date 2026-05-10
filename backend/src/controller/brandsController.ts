import { Request, Response } from "express"

import DB from "../config/DBconfig"
import ProductsBrandsModel from "../model/productsBrandsModel"

// types
type BrandCreate = {
    brand_name: string
    created_by: number
    created_at: Date
}

type BrandUpdate = {
    brand_name: string
    updated_by: number
    updated_at: Date
}

// obtiene todas las marcas
export const getBrands = async (req: Request, res: Response) => {
    try {
        const brands = await ProductsBrandsModel.findAll({
            order: [["products_brands_id", "DESC"]]
        })

        res.status(200).json(brands)
    } catch (error) {
        console.error("Error al obtener marcas:", error)
        res.status(500).json({ error: "Error al obtener marcas" })
    }
}

// crea marca
export const createBrand = async (req: Request, res: Response) => {
    const body: BrandCreate = req.body
    const transaction = await DB.transaction()

    try {
        // validar nombre duplicado
        const brandExists = await ProductsBrandsModel.findOne({
            where: { brand_name: body.brand_name }
        })

        if(brandExists) {
            await transaction.rollback()
            return res.status(400).json({ message: "Ya existe una marca con ese nombre" })
        }

        const newBrand = await ProductsBrandsModel.create(body, {
            transaction
        })

        await transaction.commit()

        res.status(201).json({
            message: "Marca creada exitosamente",
            data: newBrand
        })
    } catch (error) {
        await transaction.rollback()

        console.error("Error al crear marca:", error)
        res.status(500).json({ error: "Error al crear marca" })
    }
}

// actualiza marca
export const updateBrand = async (req: Request, res: Response) => {
    const body: BrandUpdate = req.body
    const id = Number(req.params.id)
    const transaction = await DB.transaction()

    try {
        const brand = await ProductsBrandsModel.findByPk(id)

        if(!brand) {
            await transaction.rollback()
            return res.status(404).json({  message: "Marca no encontrada" })
        }

        // validar nombre repetido
        const duplicatedBrand = await ProductsBrandsModel.findOne({
            where: { brand_name: body.brand_name }
        })

        if(duplicatedBrand && duplicatedBrand.products_brands_id !== id) {
            await transaction.rollback()
            return res.status(400).json({ message: "Ya existe una marca con ese nombre" })
        }

        await ProductsBrandsModel.update(body, {
            where: { products_brands_id: id },
            transaction
        })

        await transaction.commit()

        res.status(200).json({ message: "Marca actualizada exitosamente" })
    } catch (error) {
        await transaction.rollback()

        console.error("Error al actualizar marca:", error)
        res.status(500).json({ error: "Error al actualizar marca" })
    }
}

// elimina marca
export const deleteBrand = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const transaction = await DB.transaction()

    try {
        const brand = await ProductsBrandsModel.findByPk(id)

        if(!brand) {
            await transaction.rollback()
            return res.status(404).json({  message: "Marca no encontrada" })
        }

        await brand.destroy({ transaction })
        await transaction.commit()

        res.status(200).json({ message: "Marca eliminada exitosamente" })

    } catch (error) {
        await transaction.rollback()

        console.error("Error al eliminar marca:", error)
        res.status(500).json({ error: "Error al eliminar marca" })
    }
}