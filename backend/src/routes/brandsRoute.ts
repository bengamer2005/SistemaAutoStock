import { Router } from "express"
import {
    getBrands,
    createBrand,
    updateBrand,
    deleteBrand
} from "../controller/brandsController"

const router = Router()

router.get("/", getBrands)
router.post("/", createBrand)
router.put("/:id", updateBrand)
router.delete("/:id", deleteBrand)

export default router