import express from 'express';
const app = express();
const port = 8000;
import bodyParser from 'body-parser';
import mysql from'mysql2/promise';
import multer from'multer';
import path from'path';
import bcrypt from'bcrypt';
import dotenv from 'dotenv';
dotenv.config();
import jwt from'jsonwebtoken';
const secret = 'lovedev';
const { MYSQL_HOST, MYSQL_USER, MYSQL_PWD, MYSQL_DB } = process.env;
import cors from'cors';
import { sourceMapsEnabled } from 'process';
// ai gen for __dirname
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import router from './routes/router.js';
app.use(router)
app.use(cors()); 
// --- Config & Middleware ---
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../../Frontend')));
app.use('/css',express.static(path.join(__dirname,'../../Frontend/src/assets/css')));
app.use('/assets', express.static(path.join(__dirname, '../../assets')));
app.use('/uploads', express.static(path.join(__dirname, '../server/uploads')));

app.post('/register', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    try {
        // เช็ค username มีใน database รึยังค่อย insert
        const isUsernameExist = await checkUsername(username);
        if(!isUsernameExist){
            return res.status(202).json({
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
        return false;
    }
    else{
        console.log(`Username "${username}" is available`);
        return true;
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
        INSERT INTO product_plant (name, description, price, high, wide, img, light_type_id,amount)
            VALUES (?, ?, ?, ?, ?, ?, ?,?)
        `;
        console.log(query)
        const values = [
            data.name,
            data.description,
            data.price,
            data.high,
            data.wide,
            data.img,
            data.light_type_id,
            data.amount
        ]
       
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
export default db;



app.get('/api/productPagination',async(req,res,next)=>{
    try {
        
        let {page = currentPage,product = 6} = req.query;
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