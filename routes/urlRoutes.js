import { Router } from "express";
const router = Router();

router.get("/test", (req, res) => {
  res.status(200).json({
    message: "Test route is working",
  });
});

router.post("/test", (req, res) => {
  const { name } = req.body;
  res.status(200).json({
    message: `Hello ${name}`,
  });
});

export default router;
