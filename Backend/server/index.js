import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import router from './routes/router.js';
import { initMySQL } from './databaseConnect.js';


dotenv.config();

const app = express();
const port = 8000;

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
// ---------- Start Server ----------

await initMySQL();
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
