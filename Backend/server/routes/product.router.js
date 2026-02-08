import productController from '../controllers/product.controller.js';
import multer from 'multer';
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './uploads'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

const productRouter = (router) => {
  router.get('/api/fetchAll',productController.apiFetchall);

  router.get('/api/product_id/:id', productController.findproductId);
  
  router.post('/upload',upload.single('photo'),productController.insertProduct);

  router.put('/api/update/:id', upload.single('photo'),productController.editProduct);
  
  router.delete('/api/delete/:id', productController.deleteProduct);

  
  
 

}
export default productRouter;