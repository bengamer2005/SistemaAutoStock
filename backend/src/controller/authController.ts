import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import UsersModel from "../model/usersModel"

// registro de un usuario
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, last_name, email, password, roles_id } = req.body

        // si no cuenta con todos los campos lanzamos error
        if(!name || !last_name || !email || !password || !roles_id) {
            return res.status(409).json({message: "Faltan campos por llenar"})
        }

        // si ya existe un usuario con mismo correo lanzamos error
        const findEmail = await UsersModel.findOne({
            where: { email }
        })
        
        if(findEmail) {
            return res.status(401).json({message: "Email ya registrado, favor de iniciar sesion"})
        }

        // hashear contraseña
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // se hace el post del usuario
        const userInfo = await UsersModel.create({ 
            name, 
            last_name, 
            email, 
            password: hashedPassword, 
            active: true, 
            roles_id,
            created_at: new Date()
        })

        res.status(200).json({message: "Usuario registrado exitosamente", user: userInfo})

    } catch (error) {
        console.error("Error al registrar usuario:", error)
        res.status(500).json({message: "Internal server error"})
    }
}

// login de un usuario
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        // si no completa todos los campos lanzamos error
        if(!email || !password) {
            return res.status(400).json({message: "Faltan campos por llenar"})
        }

        // buscamos si existe el user
        const user = await UsersModel.findOne({
            where: { email }
        })

        if(!user) {
            return res.status(401).json({
                message: "Credenciales invalidas"
            })
        }

        // verificamos la contraseña
        const comparePassword = await bcrypt.compare(password, user.password)

        if(!comparePassword) {
            return res.status(401).json({message: "Credenciales invalidas"})
        }

        if(!process.env.JWT_SECRET){
            throw new Error("JWT_SECRET not defined")
        }

        // generamos el token
        const token = jwt.sign({
            id: user.users_id, 
            email: user.email,
            role: user.roles_id
        }, process.env.JWT_SECRET, {
            expiresIn: "10h"
        })

        const { password: _, ...userData } = user.dataValues

        res.status(200).json({message: "Login exitoso: ", token, user: userData})
    } catch (error) {
        console.error("Error al hacer login:", error)
        res.status(500).json({message: "Internal server error"})
    }
}