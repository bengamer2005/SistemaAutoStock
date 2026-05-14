import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import rateLimit from "express-rate-limit"
import UsersModel from "../model/usersModel"

export interface AuthRequest extends Request {
    user?: {
        id: number
        email: string
        role: number
    }
}

// Verifica que el token JWT sea válido
export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1] // Bearer <token>

    if (!token) {
        res.status(401).json({ message: "Acceso denegado. Token no proporcionado" })
        return
    }

    if (!process.env.JWT_SECRET) {
        res.status(500).json({ message: "JWT_SECRET no configurado" })
        return
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as AuthRequest["user"]
        req.user = decoded
        next()
    } catch (error) {
        res.status(403).json({ message: "Token inválido o expirado" })
    }
}

// Verifica que el usuario tenga rol de Administrador (roles_id = 1)
export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user?.role !== 1) {
        res.status(403).json({ message: "Acceso restringido. Se requiere rol Administrador" })
        return
    }
    next()
}

// Verifica que el usuario tenga rol de Operador (roles_id = 2). Solo el Operador puede registrar movimientos.
export const isOperator = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || req.user.role !== 2) {
        res.status(403).json({ message: "Acceso restringido. Se requiere rol Operador" })
        return
    }
    next()
}

// Verifica que la cuenta del usuario siga activa en la base de datos
export const checkActiveUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: "Usuario no autenticado" })
            return
        }

        const user = await UsersModel.findByPk(req.user.id)

        if (!user || !user.active) {
            res.status(403).json({ message: "Tu cuenta ha sido desactivada. Contacta al administrador" })
            return
        }

        next()
    } catch (error) {
        console.error("Error al verificar usuario activo:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

// Valida que los campos requeridos estén presentes en el body
export const validateRequired = (fields: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const missing = fields.filter(field => {
            const value = req.body[field]
            return value === undefined || value === null || value === ""
        })

        if (missing.length > 0) {
            res.status(400).json({
                message: `Faltan campos requeridos: ${missing.join(", ")}`
            })
            return
        }

        next()
    }
}

// Limita intentos de login para proteger contra ataques de fuerza bruta
export const loginLimiter = rateLimit({
    windowMs: 1* 60 * 1000, 
    max: 3,                   
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Demasiados intentos de inicio de sesión. Intenta de nuevo en 15 minutos"
    }
})
