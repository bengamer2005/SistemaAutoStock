import { Router } from "express"
import {
    getBrands,
    createBrand,
    updateBrand,
    deleteBrand
} from "../controller/brandsController"
import { verifyToken, isAdmin, checkActiveUser, validateRequired } from "../middleware/authMiddleware"

const router = Router()

router.get("/",       verifyToken, checkActiveUser, getBrands)
router.post("/",      verifyToken, checkActiveUser, isAdmin, validateRequired(["brand_name"]), createBrand)
router.put("/:id",    verifyToken, checkActiveUser, isAdmin, validateRequired(["brand_name"]), updateBrand)
router.delete("/:id", verifyToken, checkActiveUser, isAdmin, deleteBrand)

export default router
