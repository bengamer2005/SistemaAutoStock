import { Router } from "express"
import { getUsers, createUsers, updateUsers, deactivateUser } from "../controller/usersController"
import { verifyToken, isAdmin, checkActiveUser, validateRequired } from "../middleware/authMiddleware"

const router = Router()

router.get("/",           verifyToken, checkActiveUser, isAdmin, getUsers)
router.post("/",          verifyToken, checkActiveUser, isAdmin, validateRequired(["name", "last_name", "email", "password", "roles_id"]), createUsers)
router.put("/",           verifyToken, checkActiveUser, isAdmin, validateRequired(["users_id", "name", "last_name", "email", "roles_id"]), updateUsers)
router.put("/:id/status", verifyToken, checkActiveUser, isAdmin, deactivateUser)

export default router
