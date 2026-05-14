import { Router } from "express"
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from "../controller/categoriesController"
import { verifyToken, isOperator, checkActiveUser, validateRequired } from "../middleware/authMiddleware"

const router = Router()

router.get("/",       verifyToken, checkActiveUser, getCategories)
router.post("/",      verifyToken, checkActiveUser, isOperator, validateRequired(["name"]), createCategory)
router.put("/:id",    verifyToken, checkActiveUser, isOperator, validateRequired(["name"]), updateCategory)
router.delete("/:id", verifyToken, checkActiveUser, isOperator, deleteCategory)

export default router
