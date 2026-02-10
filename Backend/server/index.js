import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';

import router from './routes/router.js';
import { initMySQL, getConn } from './databaseConnect.js';
// import { checkUsername } from './middlewares/check.auth.js';

dotenv.config();

const app = express();
const port = 8000;
const secret = 'lovedev';

// __dirname fix (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- Middleware ----------
app.use(cors());
app.use(bodyParser.json());
app.use(router);

// ---------- Static ----------
app.use(express.static(path.join(__dirname, '../../Frontend')));
app.use('/css', express.static(path.join(__dirname, '../../Frontend/src/assets/css')));
app.use('/assets', express.static(path.join(__dirname, '../../assets')));
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

// ---------- Auth ----------
// app.post('/register', async (req, res) => {
//     const { username, password, email } = req.body;

//     try {
//         const isAvailable = await checkUsername(username);
//         if (!isAvailable) {
//             return res.status(409).json({
//                 success: false,
//                 message: 'This username already taken',
//             });
//         }

//         const hashPassword = bcrypt.hashSync(password, 5);
//         await getConn().query(
//             'INSERT INTO user (username,password,email) VALUES (?, ?, ?)',
//             [username, hashPassword, email]
//         );

//         res.status(201).json({ success: true });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false });
//     }
// });

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('LOGIN BODY:', req.body);
    try {
        const conn = getConn();
        const [rows] = await conn.query(
            'SELECT * FROM user WHERE username = ?',
            [username]
        );
        console.log('USER FOUND:', rows.length);
        if (!rows.length) {
            return res.status(401).json({ success: false });
        }

        const match = await bcrypt.compare(password, rows[0].password);
        if (!match) {
            return res.status(401).json({ success: false });
        }console.log('PASSWORD MATCH:', match);

        const token = jwt.sign({ username, role: 'user' }, secret, {
            expiresIn: '1h',
        });

        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// ---------- Pages ----------
app.get('/', (req, res) => {
    res.sendFile(
        path.join(__dirname, '../../Frontend/src/pages/admin/Dashboard/dashboard.html')
    );
});

// ---------- Global Error ----------
app.use((err, req, res, next) => {
    console.error('ERROR:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
});
// db


// ---------- Start Server ----------
await initMySQL();

// productRouter(app);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
