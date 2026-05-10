import { Request, Response } from "express"
import DB from "../config/DBconfig"
import ProvidersModel from "../model/providersModel"

// types
type ProviderCreate = {
    name: string
    description: string
    active: boolean
    created_by: number
    created_at: Date
}

type ProviderUpdate = {
    name: string
    description: string
    updated_by: number
    updated_at: Date
}

// obtiene todos los proveedores
export const getProviders = async (req: Request, res: Response) => {
    try {
        const providers = await ProvidersModel.findAll({
            order: [["providers_id", "DESC"]]
        })

        res.status(200).json(providers)
    } catch (error) {
        console.error("Error al obtener proveedores:", error)
        res.status(500).json({ error: "Error al obtener proveedores" })
    }
}

// crea proveedor
export const createProvider = async (req: Request, res: Response) => {
    const body: ProviderCreate = req.body
    const transaction = await DB.transaction()

    try {
        // validar nombre duplicado
        const providerExists = await ProvidersModel.findOne({
            where: { name: body.name }
        })

        if(providerExists) {
            await transaction.rollback()
            return res.status(400).json({ message: "Ya existe un proveedor con ese nombre" })
        }

        const newProvider = await ProvidersModel.create(body, {
            transaction
        })

        await transaction.commit()

        res.status(201).json({
            message: "Proveedor creado exitosamente",
            data: newProvider
        })
    } catch (error) {
        await transaction.rollback()

        console.error("Error al crear proveedor:", error)
        res.status(500).json({ error: "Error al crear proveedor" })
    }
}

// actualiza proveedor
export const updateProvider = async (req: Request, res: Response) => {
    const body: ProviderUpdate = req.body
    const id = Number(req.params.id)
    const transaction = await DB.transaction()

    try {
        const provider = await ProvidersModel.findByPk(id)

        if(!provider) {
            await transaction.rollback()
            return res.status(404).json({ message: "Proveedor no encontrado" })
        }

        // validar nombre repetido
        const duplicatedProvider = await ProvidersModel.findOne({
            where: { name: body.name }
        })

        if(duplicatedProvider && duplicatedProvider.providers_id !== id) {
            await transaction.rollback()
            return res.status(400).json({ message: "Ya existe un proveedor con ese nombre" })
        }

        await ProvidersModel.update(body, {
            where: { providers_id: id },
            transaction
        })

        await transaction.commit()

        res.status(200).json({ message: "Proveedor actualizado exitosamente" })
    } catch (error) {
        await transaction.rollback()

        console.error("Error al actualizar proveedor:", error)
        res.status(500).json({ error: "Error al actualizar proveedor" })
    }
}

// activar o desactivar proveedor
export const deactivateProvider = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const transaction = await DB.transaction()

    try {
        const provider = await ProvidersModel.findByPk(id)

        if(!provider) {
            await transaction.rollback()
            return res.status(404).json({ message: "Proveedor no encontrado" })
        }

        await provider.update({
            active: !provider.active
        }, {
            transaction
        })

        await transaction.commit()

        res.status(200).json({
            message: `Proveedor ${provider.active ? "activado" : "desactivado"} exitosamente`,
            active: provider.active
        })
    } catch (error) {
        await transaction.rollback()

        console.error("Error al cambiar estado del proveedor:", error)
        res.status(500).json({ error: "Error al cambiar estado del proveedor" })
    }
}