const express = require('express');
const app = express();
const port = 8000;

const multer = require('multer')
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
