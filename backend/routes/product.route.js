import express from 'express';
import { getProducts,getFeaturedProducts,createProduct,deleteProduct,getRecomendetProducts,getProductsByCategory,toggleFeaturedProduct  } from '../controllers/product.controller.js';
import { adminRoute, protectRoute} from '../middlewares/auth.middleware.js';


const router = express.Router();

router.get('/',protectRoute,adminRoute,getProducts);
router.get('/featured',getFeaturedProducts);
router.get('/recomendation',getRecomendetProducts);
router.get('/category/:category',getProductsByCategory);
router.post('/',protectRoute,adminRoute,createProduct);
router.patch('/:id',protectRoute,adminRoute,toggleFeaturedProduct);
router.delete('/:id',protectRoute,adminRoute,deleteProduct);

export default router;