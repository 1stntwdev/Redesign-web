import productController from '../controllers/product.controller.js';
import multer from 'multer';
import { getConn } from '../databaseConnect.js';

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
  
  router.delete('/api/delete/:id', productController.deleteproductId);
  
  router.get('/api/productPagination',async(req,res,next)=>{
    try {
        let conn = getConn();
        let {page = 1,product = 6} = req.query;
        const productShow = parseInt(product);
        const pageNext = (page - 1) * productShow;
        const [[{total}]] = await conn.query('SELECT COUNT(*) as total FROM product_plant');
        const [rows] = await conn.query('SELECT * FROM product_plant limit ? OFFSET ?',[productShow,pageNext]);
        res.json({
            data:rows,
            total:total,
            currentPage : parseInt(page),
            totalPages : Math.ceil(total/productShow)

        });
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Server error'});
        }
    })
    router.post('/api/upload',upload.single('photo'),productController.insertProduct); 
    router.post('/api/getProducts',productController.productInCart);
}
export default productRouter;