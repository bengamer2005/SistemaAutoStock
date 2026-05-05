import { Router } from "express"
import { loginUser, registerUser } from "../controller/usersController"

const router = Router()

router.post("/users/login", loginUser)
router.post("/users/register", registerUser)

export default router