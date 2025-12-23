import type { Request, Response } from "express";
import * as paymentService from "../../pos_services/paymentService";

export async function createPayment(req: Request, res: Response) {
  try {
    const amount = req.body;

    const result = await paymentService.generateQR(amount);

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function checkPayment(req: Request, res: Response) {
  try {
    const {md5} = req.body;   //send frontend send md5 in form of json not string, we have to destructuring in by making md5 an object too

    const result = await paymentService.checkPayment(md5);

    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
