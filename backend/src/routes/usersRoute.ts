import { Router } from "express"
import { getUsers, createUsers, updateUsers, deactivateUser } from "../controller/usersController"

const router = Router()

router.get("/", getUsers)
router.post("/", createUsers)
router.put("/", updateUsers)
router.put("/:id/status", deactivateUser)

export default router