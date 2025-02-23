import express from 'express';
import { getProducts,getFeaturedProducts } from '../controllers/product.controller.js';
import { adminRoute, protectRoute,createProduct,deleteProduct } from '../middlewares/auth.middleware.js';


const router = express.Router();

router.get('/',protectRoute,adminRoute,getProducts)
router.get('/featured',getFeaturedProducts)
router.post('/',protectRoute,adminRoute,createProduct)
router.delete('/:id',protectRoute,adminRoute,deleteProduct)
export default router;