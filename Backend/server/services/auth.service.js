import { getConn } from '../databaseConnect.js';
import authModel from '../models/auth.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const secret = 'lovedev'
const authService = {

  checkUsername: async (username) => {
    const conn = getConn();
    const [rows] = await conn.query(
      'SELECT username FROM user WHERE username = ?',
      [username]
    );

    return rows.length === 0; // true = ว่าง
  },
  register: async (username, password, email) => {
    const hashPassword = bcrypt.hashSync(password, 10);
    return await authModel.insertUsers(username, hashPassword, email);

  },
  login: async (username, password) => {
    const users = await authModel.findByUsername(username);
    if (!users.length) {
      throw new Error('USER_NOT_FOUND');
    }
    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error('INVALID_PASSWORD');
    }
    const token = jwt.sign({ username, role: 'user' },
      secret, {
      expiresIn: '1h',}
    );
    return token;
  }
}

export default authService;
