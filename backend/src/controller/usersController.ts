import { Request, Response } from "express"
import { QueryTypes } from "sequelize"
import DB from "../config/DBconfig"
import UsersModel from "../model/usersModel"

// types
type UsersCreate = {
    name: string
    last_name: string
    email: string
    password: string
    roles_id: number
    active: boolean
    created_at: Date
}

type UsersUpdate = {
    name: string
    last_name: string
    password: string
    roles_id: number
    updated_by: number
    updated_at: Date
}

// obtiene todos los usuarios
export const getUsers = async (req: Request, res: Response) => {
    try {
        const allUsers = await DB.query("SELECT * FROM xv_users",{
            type: QueryTypes.SELECT
        })

        res.status(200).json(allUsers)
    } catch (error) {
        console.error("Error al obtener usuarios:", error)
        res.status(500).json({
            error: "Error al obtener usuarios"
        })
    }
}

// crea un usuario nuevo
export const createUsers = async (req: Request, res: Response) => {
    const body: UsersCreate = req.body
    const transaction = await DB.transaction()

    try {
        const newUser = await UsersModel.create(body, {
            transaction
        })

        await transaction.commit()

        res.status(201).json({
            message: "Usuario creado exitosamente",
            data: newUser
        })
    } catch (error) {
        await transaction.rollback()

        console.error("Error al crear el usuario:", error)
        res.status(500).json({ error: "Error al crear el usuario" })
    }
}

// actualiza un usuario
export const updateUsers = async (req: Request, res: Response) => {
    const body: UsersUpdate = req.body
    const id = Number(req.params.id)
    const transaction = await DB.transaction()

    try {
        const userExists = await UsersModel.findByPk(id)

        if(!userExists) {
            await transaction.rollback()
            return res.status(404).json({ message: "Usuario no encontrado" })
        }

        await UsersModel.update(body, {
            where: { users_id: id },
            transaction
        })

        await transaction.commit()

        res.status(200).json({ message: "Usuario actualizado exitosamente" })

    } catch (error) {
        await transaction.rollback()

        console.error("Error al actualizar el usuario:", error)
        res.status(500).json({ error: "Error al actualizar el usuario" })
    }
}

// activar o inactivar usuario
export const deactivateUser = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const transaction = await DB.transaction()

    try {
        const user = await UsersModel.findByPk(id)

        if(!user) {
            await transaction.rollback()
            return res.status(404).json({ message: "Usuario no encontrado" })
        }

        // cambia el estado actual
        await user.update({
            active: !user.active
        }, {
            transaction
        })

        await transaction.commit()

        res.status(200).json({
            message: `Usuario ${user.active ? "activado" : "desactivado"} exitosamente`,
            active: user.active
        })

    } catch (error) {
        await transaction.rollback()

        console.error("Error al actualizar el estatus del usuario:", error)
        res.status(500).json({ error: "Error al actualizar el estatus del usuario" })
    }
}