import { Router } from "express";
import {
  getUrlStats,
  redirectToLongUrl,
  shortenUrl,
} from "../controllers/urlControllers.js";
const router = Router();

router.post("/shorten", shortenUrl);
router.get("/:shortUrlKey", redirectToLongUrl);
router.get("/stats/:shortUrlKey", getUrlStats);

export default router;
