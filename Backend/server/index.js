const express = require('express');
const app = express();
const port = 8000;
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
// insert img ------------
const multer = require('multer');
const path = require('path');
app.use(express.static(path.join(__dirname, '../../Frontend')));
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads') // folder ที่เราต้องการเก็บไฟล์
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname) //ให้ใช้ชื่อไฟล์ original เป็นชื่อหลังอัพโหลด
  },
})
const upload = multer({ storage })
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../Frontend/src/pages/admin/Dashboard/dashboard.html'))
})
// หลัง submit
app.post('/upload', upload.single('photo'), (req, res) => {
  res.send(req.file)
})
require('dotenv').config();
const {MYSQL_HOST,MYSQL_USER,MYSQL_PWD,MYSQL_DB} = process.env
// insert end img ------------------------

let conn = null;
const initMySQL = async()=>{
  conn = await mysql.createConnection({
      host:MYSQL_HOST,
      user:MYSQL_USER,
      password:MYSQL_PWD,
      database:MYSQL_DB,
    });
}
app.get('/testdb-new',async (req,res)=>{
  try{
    const result = await conn.query('select * from product_plant');
    res.json(result[0]);
  }
  catch (error){
    console.error(error.message);
    res.status(500).json({error:"Error query fetching "})
  }
  })
app.listen(port, async() => {
  await initMySQL();
  console.log(`Example app listening on port ${port}`)
})
