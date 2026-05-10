import { Router } from "express"
import {
    getMovements,
    getMovementsByProduct,
    createEntryMovement,
    createExitMovement
} from "../controller/movementsController"
import { verifyToken, isOperator, checkActiveUser, validateRequired } from "../middleware/authMiddleware"

const router = Router()

router.get("/",            verifyToken, checkActiveUser, getMovements)
router.get("/product/:id", verifyToken, checkActiveUser, getMovementsByProduct)
router.post("/entry",      verifyToken, checkActiveUser, isOperator, validateRequired(["products_id", "quantity"]), createEntryMovement)
router.post("/exit",       verifyToken, checkActiveUser, isOperator, validateRequired(["products_id", "quantity"]), createExitMovement)

export default router
