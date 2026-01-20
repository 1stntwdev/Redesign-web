const express = require('express');
const app = express();
const port = 8000;
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const { MYSQL_HOST, MYSQL_USER, MYSQL_PWD, MYSQL_DB } = process.env;

// --- Config & Middleware ---
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../../Frontend')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './uploads'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// --- Database Connection ---
let conn = null;
const initMySQL = async () => {
    conn = await mysql.createConnection({
        host: MYSQL_HOST, user: MYSQL_USER, password: MYSQL_PWD, database: MYSQL_DB,
    });
};

// --- Database Logic (Helper Functions) ---
const db = {
    fetchAll: async () => {
        const [rows] = await conn.query('SELECT * FROM product_plant');
        return rows;
    },
    getById: async (id) => {
        const [rows] = await conn.execute('SELECT * FROM product_plant WHERE plant_id = ?', [id]);
        return rows[0];
    },
    insert: async (data) => {

        const query = `
        INSERT INTO product_plant (name, description, price, high, wide, img, light_type_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
        data.name,
        data.description,
        data.price,
        data.high,
        data.wide,
        data.img,
        data.light_type_id
        ]
        // const [result] = await conn.query('INSERT INTO product_plant SET ?', data);
        // return result;
        const [result] = await conn.query(query, values);
        return {id: result.insertId, ...data };
    },
    update: async (id, data) => {
        const [result] = await conn.query('UPDATE product_plant SET ? WHERE plant_id = ?', [data, id]);
        return result;
    },
    delete: async (id) => {
        const [result] = await conn.execute('DELETE FROM product_plant WHERE plant_id = ?', [id]);
        return result;
    }
};

// --- Routes ---

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Frontend/src/pages/admin/Dashboard/dashboard.html'));
});

app.post('/upload', upload.single('photo'),async (req, res,next) => {
    // res.send(req.file);
    try {
         console.log('req.body:', req.body);
        console.log('req.file:', req.file);
        // ตรวจสอบว่ามีไฟล์หรือไม่
        if (!req.file) {
            return res.status(400).json({ error: 'Please upload a photo' });
        }
 if (!req.body.name) {
            return res.status(400).json({ error: 'Product name is required' });
        }
        // เตรียมข้อมูลตามโครงสร้าง database ของคุณ
        const productData = {
            name: req.body.name,
            description: req.body.description,
            price: parseFloat(req.body.price),
            high: parseFloat(req.body.high),
            wide: parseFloat(req.body.wide) ,
            img: req.file.filename,  // เก็บแค่ชื่อไฟล์
            light_type_id: req.body.category
        };

        // บันทึกลง database
        const result = await db.insert(productData);
        
        res.status(201).json({
            message: 'Product added successfully',
            product: result
        });

    } catch (error) {
        next(error);
    }
});

app.get('/api/fetchAll', async (req, res, next) => {
    try {
        const result = await db.fetchAll();
        res.json(result);
    } catch (error) { next(error); }
});

app.get('/api/product_id/:id', async (req, res, next) => {
    try {
        const product = await db.getById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Can't find id in database" });
        }
        res.json(product);
    } catch (error) { next(error); }
});

app.post('/api/insert', async (req, res, next) => {
    try {
        const result = await db.insert(req.body);
        res.status(201).json(result);
    } catch (error) { next(error); }
});

app.put('/api/update/:id', async (req, res, next) => {
    try {
        const result = await db.update(req.params.id, req.body);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Can't find product to update" });
        }
        res.json({ message: "Update successfully", result });
    } catch (error) { next(error); }
});

app.delete('/api/delete/:id', async (req, res, next) => {
    try {
        const result = await db.delete(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Can't find product to delete" });
        }
        res.json({ message: 'Delete successfully' });
    } catch (error) { next(error); }
});

// --- 1. Global Error Handler (ส่วนที่ใช้ next ส่งมา) ---
app.use((err, req, res, next) => {
    console.error("LOG ERROR:", err.message);
    res.status(500).json({
        error: "Internal Server Error",
        detail: err.message
    });
});

app.listen(port, async () => {
    await initMySQL();
    console.log(`Server listening on port ${port}`);
});