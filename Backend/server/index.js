const express = require('express');
const app = express();
const port = 8000;
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
// insert img ------------
const multer = require('multer');
const path = require('path');
app.use(bodyParser.json());
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
  res.sendFile(path.join(__dirname, '../../Frontend/src/pages/admin/Dashboard/dashboard.html'));
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
app.get('/api/fetchAll',async (req,res)=>{
  try{
    const result = await conn.query('select * from product_plant');
    res.json(result[0]);
  }
  catch (error){
    console.error(error.message);
    res.status(500).json({error:"Error query fetching "});
  }
  })
app.post('/api/insert',async(req,res)=>{
  try{
    let user = req.body
    const [result,fields] = await conn.query('INSERT INTO product_plant SET ?',user);
    res.json(result);
  }
  catch(error){
    console.error(error.message);
  }
})
async function getProductById (id){
  try{
    // ดึง id
    const [result] = await conn.execute('select * from product_plant where plant_id = ?', [id]);
    return result[0];
  }
  catch(error){
    console.log(`error fetch ${error}`);
  }
}
async function deleteProductById(id) {
  try {
    const [result] = await conn.execute('DELETE FROM product_plant WHERE plant_id = ?', [id]);
    return result;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}

app.get('/api/product_id/:id',async (req,res)=>{
  try{
    // let id = req.params.id;
    // const [result,fields] = await conn.query('select * from product_plant where plant_id = ?',id);
    // res.json(result);
    const resultProduct = await getProductById(req.params.id);
    if(!resultProduct){
      res.status(404).send({message : `Can't find id in database`});
    }
    res.json(resultProduct);
  }
  catch(error){
    console.log(error)
  }
})
app.delete('/api/delete/:id',async (req,res)=>{
  try{
    const producrDeleted = await deleteProductById(req.params.id);
    if (producrDeleted.affectedRows === 0) {
      return res.status(404).json({ 
        message: `Can't find product` 
      });
    }
    res.json({ 
      message: 'Delete successfully',
      deletedId: req.params.id 
    });
  }
  catch(error){
    res.status(500).send(`somthing broke!${error}`);
  }
})
app.listen(port, async() => {
  await initMySQL();
  console.log(`Example app listening on port ${port}`);
})
