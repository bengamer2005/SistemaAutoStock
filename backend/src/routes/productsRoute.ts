import { Router } from "express"
import {
    getProducts,
    getAllInvInfo,
    createProduct,
    updateProduct,
    deactivateProduct
} from "../controller/productsController"
import { verifyToken, isOperator, checkActiveUser, validateRequired } from "../middleware/authMiddleware"

const router = Router()

router.get("/",             verifyToken, checkActiveUser, getProducts)
router.get("/catalogs",     verifyToken, checkActiveUser, getAllInvInfo)
router.post("/",            verifyToken, checkActiveUser, isOperator, validateRequired(["name", "categories_id", "products_brands_id", "providers_id", "warehouses_id", "stock", "min_stock", "unit_price"]), createProduct)
router.put("/:id",          verifyToken, checkActiveUser, isOperator, validateRequired(["name", "categories_id", "products_brands_id", "providers_id", "warehouses_id", "stock", "min_stock", "unit_price"]), updateProduct)
router.patch("/:id/status", verifyToken, checkActiveUser, isOperator, deactivateProduct)

export default router
