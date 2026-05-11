import { Router } from "express"
import {
    getWarehouses,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse
} from "../controller/warehousesController"
import { verifyToken, isAdmin, checkActiveUser, validateRequired } from "../middleware/authMiddleware"

const router = Router()

router.get("/",       verifyToken, checkActiveUser, getWarehouses)
router.post("/",      verifyToken, checkActiveUser, isAdmin, validateRequired(["name", "location"]), createWarehouse)
router.put("/:id",    verifyToken, checkActiveUser, isAdmin, validateRequired(["name", "location"]), updateWarehouse)
router.delete("/:id", verifyToken, checkActiveUser, isAdmin, deleteWarehouse)

export default router
