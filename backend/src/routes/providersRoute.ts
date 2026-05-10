import { Router } from "express"
import {
    getProviders,
    createProvider,
    updateProvider,
    deactivateProvider
} from "../controller/providersController"

const router = Router()

router.get("/", getProviders)
router.post("/", createProvider)
router.put("/:id", updateProvider)
router.patch("/:id/status", deactivateProvider)

export default router