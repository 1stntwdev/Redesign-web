import bcrypt from 'bcrypt';
import { getConn } from '../databaseConnect.js';
import checkUsername from '../services/auth.service.js';
const authController = {
  register: async (req, res) => {
    const { username, password, email } = req.body;

    try {
      const isAvailable = await checkUsername(username);
      if (!isAvailable) {
        return res.status(409).json({
          success: false,
          message: 'This username already taken',
        });
      }
      const hashPassword = bcrypt.hashSync(password, 10);

      await getConn().query(
        'INSERT INTO user (username, password, email) VALUES (?,?,?)',
        [username, hashPassword, email]
      );

      res.status(201).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false });
    }
  }
};

export default authController;
