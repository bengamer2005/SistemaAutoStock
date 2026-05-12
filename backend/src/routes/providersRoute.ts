import { Router } from "express"
import {
    getProviders,
    createProvider,
    updateProvider,
    deactivateProvider
} from "../controller/providersController"
import { verifyToken, isOperator, checkActiveUser, validateRequired } from "../middleware/authMiddleware"

const router = Router()

router.get("/",             verifyToken, checkActiveUser, getProviders)
router.post("/",            verifyToken, checkActiveUser, isOperator, validateRequired(["name", "description"]), createProvider)
router.put("/:id",          verifyToken, checkActiveUser, isOperator, validateRequired(["name", "description"]), updateProvider)
router.patch("/:id/status", verifyToken, checkActiveUser, isOperator, deactivateProvider)

export default router
