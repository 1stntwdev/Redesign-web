import { getConn } from '../databaseConnect.js';

const checkUsername = async (req, res, next) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'username is required',
      });
    }

    const conn = getConn();
    const [rows] = await conn.query(
      'SELECT username FROM user WHERE username = ?',
      [username]
    );

    if (rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'This username already taken',
      });
    }

    next(); // ✅ ผ่านการกรอง ไป controller ต่อ
} catch(error){
    next(error); // ✅ ผ่านการกรอง ไป controller ต่อ
    
  }
};
export default checkUsername;
