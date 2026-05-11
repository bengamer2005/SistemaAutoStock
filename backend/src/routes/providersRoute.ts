import { Router } from "express"
import {
    getProviders,
    createProvider,
    updateProvider,
    deactivateProvider
} from "../controller/providersController"
import { verifyToken, isAdmin, checkActiveUser, validateRequired } from "../middleware/authMiddleware"

const router = Router()

router.get("/",             verifyToken, checkActiveUser, getProviders)
router.post("/",            verifyToken, checkActiveUser, isAdmin, validateRequired(["name", "description"]), createProvider)
router.put("/:id",          verifyToken, checkActiveUser, isAdmin, validateRequired(["name", "description"]), updateProvider)
router.patch("/:id/status", verifyToken, checkActiveUser, isAdmin, deactivateProvider)

export default router
