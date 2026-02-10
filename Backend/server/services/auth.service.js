import { getConn } from '../databaseConnect.js';

const checkUsername = async (username) => {
  const conn = getConn();
  const [rows] = await conn.query(
    'SELECT username FROM user WHERE username = ?',
    [username]
  );

  return rows.length === 0; // true = ว่าง
};

export default checkUsername;
