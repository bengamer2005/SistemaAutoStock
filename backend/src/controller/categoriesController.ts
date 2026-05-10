import { Request, Response } from "express"
import DB from "../config/DBconfig"
import CategoriesModel from "../model/categoriesModel"

// types
type CategoryCreate = {
    name: string
    description: string
    parent_id?: number
}

type CategoryUpdate = {
    name: string
    description: string
    parent_id?: number
}

// obtiene todas las categorias
export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await CategoriesModel.findAll({
            order: [["categories_id", "DESC"]]
        })

        res.status(200).json(categories)
    } catch (error) {
        console.error("Error al obtener categorías:", error)
        res.status(500).json({ error: "Error al obtener categorías" })
    }
}

// crea una categoria
export const createCategory = async (req: Request, res: Response) => {
    const body: CategoryCreate = req.body
    const transaction = await DB.transaction()

    try {
        // validar parent_id si existe
        if(body.parent_id) {
            const parentCategory = await CategoriesModel.findByPk(body.parent_id)

            if(!parentCategory) {
                await transaction.rollback()
                return res.status(404).json({ message: "La categoría padre no existe" })
            }
        }

        const newCategory = await CategoriesModel.create(body, {
            transaction
        })

        await transaction.commit()

        res.status(201).json({
            message: "Categoría creada exitosamente",
            data: newCategory
        })
    } catch (error) {
        await transaction.rollback()

        console.error("Error al crear categoría:", error)
        res.status(500).json({ error: "Error al crear categoría" })
    }
}

// actualiza categoria
export const updateCategory = async (req: Request, res: Response) => {
    const body: CategoryUpdate = req.body
    const id = Number(req.params.id)
    const transaction = await DB.transaction()

    try {
        const category = await CategoriesModel.findByPk(id)

        if(!category) {
            await transaction.rollback()
            return res.status(404).json({ message: "Categoría no encontrada" })
        }

        // validar parent_id
        if(body.parent_id) {

            // evitar que una categoria sea su propio padre
            if(body.parent_id === id) {
                await transaction.rollback()
                return res.status(400).json({ message: "Una categoría no puede ser su propia categoría padre" })
            }

            const parentCategory = await CategoriesModel.findByPk(body.parent_id)

            if(!parentCategory) {
                await transaction.rollback()
                return res.status(404).json({ message: "La categoría padre no existe" })
            }
        }

        await CategoriesModel.update(body, {
            where: { categories_id: id },
            transaction
        })

        await transaction.commit()

        res.status(200).json({ message: "Categoría actualizada exitosamente" })
    } catch (error) {
        await transaction.rollback()

        console.error("Error al actualizar categoría:", error)
        res.status(500).json({ error: "Error al actualizar categoría" })
    }
}

// elimina categoria
export const deleteCategory = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const transaction = await DB.transaction()

    try {
        const category = await CategoriesModel.findByPk(id)

        if(!category) {
            await transaction.rollback()
            return res.status(404).json({ message: "Categoría no encontrada" })
        }

        // validar subcategorias
        const hasChildren = await CategoriesModel.findOne({
            where: { parent_id: id }
        })

        if(hasChildren) {
            await transaction.rollback()
            return res.status(400).json({ message: "No se puede eliminar la categoría porque tiene subcategorías" })
        }

        await category.destroy({ transaction })
        await transaction.commit()

        res.status(200).json({ message: "Categoría eliminada exitosamente" })
    } catch (error) {
        await transaction.rollback()

        console.error("Error al eliminar categoría:", error)
        res.status(500).json({ error: "Error al eliminar categoría" })
    }
}