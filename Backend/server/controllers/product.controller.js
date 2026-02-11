import productModel from "../models/product.model.js";
const productController = {
  apiFetchall: async (req, res, next) => {
    try {
      const result = await productModel.fetchAll();
      res.json(result);
    } catch (error){ 
      next(error); 
    }
  },

  findproductId: async (req, res, next) => {
    try {
      console.log(req);
      const id = req.params.id;

      const product = await productModel.getById(id);
      if (!product) {
        return res.status(404).json({ message: "Can't find id in database" });
      }
      res.json(product);
    } catch (error) { next(error); }
  },
productPagination: async (req, res, next) => {
    try {
      const { page = 1, product = 6 } = req.query;
      const result = await productModel.pagination(
        parseInt(page),
        parseInt(product)
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
  deleteproductId : async(req,res,next)=>{
try {
  const result = await productModel.delete(req.params.id);
  if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json({ message: 'Delete successfully' });
    } catch (err) {
      next(err);
    }
  },

  insertProduct: async (req, res, next) => {
    try {
       console.log('=== INSERT PRODUCT ===');
      console.log(`body`,req.body);
      console.log(`file`,req.file);
      if (!req.file) {
        return res.status(400).json({ error: 'Please upload a photo' });
      }
      if (!req.body.name) {
        return res.status(400).json({ error: 'Product name is required' });
      }
      const productData = {
        name: req.body.name,
        description: req.body.description,
        price: parseFloat(req.body.price),
        high: parseFloat(req.body.high),
        wide: parseFloat(req.body.wide),
        img: req.file.filename,
        light_type_id: req.body.category,
        amount: parseFloat(req.body.amount)
      };

      // บันทึกลง database
      const result = await productModel.insert(productData);

      res.status(201).json({
        message: 'Product added successfully',
        product: result,
        succsss: true
      });

    } catch (error) {
      next(error);
    }
  },
  editProduct: async (req, res, next) => {
    try {
      const id = req.params.id;

      console.log('=== Update Product ===');
      console.log('ID:', id);
      console.log('Body:', req.body);
      console.log('File:', req.file);

      // Validate
      if (!req.body.name) {
        return res.status(400).json({ error: 'Product name is required' });
      }

      // เตรียมข้อมูลที่จะ update
      const productData = {
        name: req.body.name,
        description: req.body.description || '',
        price: parseFloat(req.body.price) || 0,
        high: parseFloat(req.body.high) || 0,
        wide: parseFloat(req.body.wide) || 0,
        light_type_id: req.body.category
      };

      // ✅ จัดการรูปภาพ
      if (req.file) {
        // มีรูปใหม่ → ใช้รูปใหม่
        productData.img = req.file.filename;

        // ลบรูปเก่า (optional แต่แนะนำ)
        if (req.body.current_img && req.body.current_img !== 'null') {
          const fs = require('fs');
          const oldPath = `./uploads/${req.body.current_img}`;
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
            console.log('Deleted old image:', req.body.current_img);
          }
        }
      } else {
        // ไม่มีรูปใหม่ → ใช้รูปเดิม
        productData.img = req.body.current_img;
      }
      // console.log('Product data to update:', productData);

      // Update database
      const result = await db.update(id, productData);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({
        message: 'Product updated successfully',
        product: { id, ...productData }
      });
    } catch (error) {
      console.error('Update error:', error);
      next(error);
    }
  },
  deleteProduct : async (req, res, next) => {
      try {
          const result = await db.delete(req.params.id);
          if (result.affectedRows === 0) {
              return res.status(404).json({ message: "Can't find product to delete" });
          }
          res.json({ message: 'Delete successfully' });
      } catch (error) { next(error); }
  }
}

export default productController;