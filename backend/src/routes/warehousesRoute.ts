import { Router } from "express"
import {
    getWarehouses,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse
} from "../controller/warehousesController"

const router = Router()

router.get("/", getWarehouses)
router.post("/", createWarehouse)
router.put("/:id", updateWarehouse)
router.delete("/:id", deleteWarehouse)

export default router