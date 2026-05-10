import { Router } from "express"
import {
    getProducts,
    getAllInvInfo,
    createProduct,
    updateProduct,
    deactivateProduct
} from "../controller/productsController"

const router = Router()

router.get("/", getProducts)
router.get("/catalogs", getAllInvInfo)
router.post("/", createProduct)
router.put("/:id", updateProduct)
router.patch("/:id/status", deactivateProduct)

export default router