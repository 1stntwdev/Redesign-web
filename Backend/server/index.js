const express = require('express');
const app = express();
const port = 8000;
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const secret = 'lovedev';
const { MYSQL_HOST, MYSQL_USER, MYSQL_PWD, MYSQL_DB } = process.env;
const cors = require('cors');

app.use(cors()); 
// --- Config & Middleware ---
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../../Frontend')));
app.use('/assets', express.static(path.join(__dirname, '../../assets')));
app.use('/uploads', express.static(path.join(__dirname, '../server/uploads')));

app.post('/register', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    try {
        // เช็ค username มีใน database รึยังค่อย insert
        const isUsernameExist = await checkUsername(username);
        if(isUsernameExist){
            return res.json({
                success:false,
                message:"This username already taken",
            })
        }
        const hashPassword = bcrypt.hashSync(password, 5);
        const [result] = await conn.query(`INSERT INTO user (username,password,email) VALUES (?, ? ,?)`, [username, hashPassword, email]);
        
        res.status(201).json({
            success: true,
            "message": "Register success"
        });
    } catch (error) {
        console.log(`error`,error);
        res.status(500).json({ error: 'Register fail' });
    }
});
async function checkUsername(username){
// query username
    const [result] = await conn.query(`SELECT username FROM user WHERE username = ?`,[username]);
// check condition have or not
    if(result.length > 0){
    console.log(`This username already use please change your username`);
    return true;
}
else{
    console.log(`Username "${username}" is available`);
    return false;
}
}
async function checkMatching(username, password) {
    const [response] = await conn.query(`SELECT * FROM user WHERE username = ?`, [username]);
    const match = await bcrypt.compare(password, response[0].password);

    try {
        if  (match) {
            console.log(`Login Success`);
            return response[0];
        } else {
            console.log(`Login faile: Wrong password`)
           return false
        }
    } catch (error) {
        console.erro(error)
        throw error;
    }

}
app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const user = await checkMatching(username, password);
        // console.log('User result:', user); 
        const token =  jwt.sign({username,role:'user'},secret,{expiresIn:'1h'});
        if (user!== null && user!== false) {
            return res.json({
                success: true,
                message: "login sucess",
                token: token,
            });
        } 
        return res.status(401).json({ //  401 : unauthorized
                success: false, 
                message: "login failed"
            });
        }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "login failed"
        })
        console.error(error)
    }
});


const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './uploads'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });


// --- Database Connection ---
let conn = null;
const initMySQL = async () => {
    try {
        conn = await mysql.createConnection({
            host: MYSQL_HOST,
            user: MYSQL_USER,
            password: MYSQL_PWD,
            database: MYSQL_DB,
        });
    } catch (error) {
        if (error.code === 'ECONNREFUSED') console.log(` >>> Can't connect to database Please try turn on data base server. <<< `);
        else {
            console.error('something wrong:', error.message);
        }
    }
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
        return { id: result.insertId, ...data };
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

// PUT /api/update/:id - สำหรับแก้ไขสินค้า
app.put('/api/update/:id', upload.single('photo'), async (req, res, next) => {
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

        console.log('Product data to update:', productData);

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
});

app.post('/upload', upload.single('photo'), async (req, res, next) => {
    // res.send(req.file);
    try {
        console.log('req.body:', req.body);
        console.log('req.file:', req.file);

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
// --- Routes ---
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../../Frontend/src/pages/admin/Dashboard/dashboard.html'));
}); // -- refresh แล้วกลับหน้าเดิม
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Frontend/src/pages/admin/Dashboard/dashboard.html'));
});
app.get('/manageProduct', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Frontend/src/pages/admin/ManageProduct/manage.html'));
})
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
    if (!conn) {
        console.error("Warning: Server started without database connection.");
    }
    console.log(`Server listening on port http://localhost:${port}`);
});