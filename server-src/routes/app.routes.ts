import { Router, Request, Response } from "express";

const router = Router();

router.get('/test', ( req: Request, res: Response ) => {

  res.json({
      ok: true,
      mensaje: 'Todo esta bien!'
  });

});

export default router;
