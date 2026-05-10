import { Router } from "express"
import {
    getMovements,
    getMovementsByProduct,
    createEntryMovement,
    createExitMovement
} from "../controller/movementsController"

const router = Router()

router.get("/", getMovements)
router.get("/product/:id", getMovementsByProduct)
router.post("/entry", createEntryMovement)
router.post("/exit", createExitMovement)

export default router