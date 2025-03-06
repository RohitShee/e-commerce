import express from 'express';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { getPaymentDetails } from '../controllers/payment.controller.js';
const router = express.Router();

router.get('/',protectRoute,getPaymentDetails);

export default router;