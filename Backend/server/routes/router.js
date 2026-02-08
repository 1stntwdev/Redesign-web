import express from 'express';
import productRouter from './product.router.js';

const router = express.Router()
productRouter(router);

export default router;