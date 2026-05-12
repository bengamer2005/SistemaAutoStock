import { Router } from "express"
import { loginUser, registerUser } from "../controller/authController"
import { validateRequired } from "../middleware/authMiddleware"

const router = Router()

router.post("/login", validateRequired(["email", "password"]), loginUser)
router.post("/register", validateRequired(["name", "last_name", "email", "password", "roles_id"]), registerUser)

export default router