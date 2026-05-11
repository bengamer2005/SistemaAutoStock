import { Router } from "express"
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from "../controller/categoriesController"
import { verifyToken, isAdmin, checkActiveUser, validateRequired } from "../middleware/authMiddleware"

const router = Router()

router.get("/",       verifyToken, checkActiveUser, getCategories)
router.post("/",      verifyToken, checkActiveUser, isAdmin, validateRequired(["name"]), createCategory)
router.put("/:id",    verifyToken, checkActiveUser, isAdmin, validateRequired(["name"]), updateCategory)
router.delete("/:id", verifyToken, checkActiveUser, isAdmin, deleteCategory)

export default router
