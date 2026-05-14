import { Router } from "express"
import {
    getWarehouses,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse
} from "../controller/warehousesController"
import { verifyToken, isOperator, checkActiveUser, validateRequired } from "../middleware/authMiddleware"

const router = Router()

router.get("/",       verifyToken, checkActiveUser, getWarehouses)
router.post("/",      verifyToken, checkActiveUser, isOperator, validateRequired(["name", "location"]), createWarehouse)
router.put("/:id",    verifyToken, checkActiveUser, isOperator, validateRequired(["name", "location"]), updateWarehouse)
router.delete("/:id", verifyToken, checkActiveUser, isOperator, deleteWarehouse)

export default router
