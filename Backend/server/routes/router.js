import express from 'express';
import productRouter from './product.router.js';
import authRouter from './auth.router.js';
const router = express.Router()
productRouter(router);
authRouter(router);

export default router;