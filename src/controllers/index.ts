import { Request, Response, Router } from "express";

const router = Router();

router.get("/api", (req: Request, res: Response) => {
  return res.status(200).send({ ok: true });
});

export default router;
