import authService from '../services/auth.service.js';
const authController = {
  register: async (req, res) => {
    const { username, password, email } = req.body;
    try {
      const isAvailable = await authService.checkUsername(username);
      if (!isAvailable) {
        return res.status(409).json({
          success: false,
          message: 'This username already taken',
        });
      }
      await authService.register(username, password, email)
      res.status(201).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false });
    }
  },
  login : async (req, res) => {
    const { username, password } = req.body;
    try {
       const token = await authService.login(username, password);
        res.json({ success: true, token : token });
       
    } catch (error) {
      if (
        error.message === 'USER_NOT_FOUND' ||
        error.message === 'INVALID_PASSWORD'
      ) {
        return res.status(401).json({
          success: false ,
          error: 'INVALID_CREDENTIALS',
          message: 'Username or password is incorrect'
          });
      }
      console.error(error);
      res.status(500).json({ success: false });
    }
}
};

export default authController;
