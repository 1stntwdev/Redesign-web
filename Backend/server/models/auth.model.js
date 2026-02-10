import { getConn } from '../databaseConnect.js';
const authModel = {
  insertUsers : async (username, hashPassword, email)=>{
    const conn = getConn();
    const [result] = await conn.query(
      'INSERT INTO user (username, password, email) VALUES (?,?,?)',
        [username, hashPassword, email]
      );
      return result;
  },
  checkUsername : async (username)=>{
    const conn = getConn();
    const [rows] = await conn.query(
        'SELECT username FROM user WHERE username = ?',
      [username]
    );
      return rows.length === 0;
  },
  findByUsername : async(username)=>{
    const conn = getConn();
    const [rows] = await conn.query(
      'SELECT * FROM user WHERE username = ?',
            [username]
    );
    return rows
  }
};
export default authModel;