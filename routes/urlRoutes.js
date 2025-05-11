import { Router } from "express";
import {
  redirectToLongUrl,
  shortenUrl,
} from "../controllers/urlControllers.js";
const router = Router();

router.post("/shorten", shortenUrl);
router.get("/:shortUrlKey", redirectToLongUrl);

export default router;
