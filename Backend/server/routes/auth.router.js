import authController from '../controllers/auth.controller.js';
import checkUsername from '../middlewares/check.auth.js'
const authRouter = (router) => {
  router.post('/register',checkUsername, authController.register);
}
export default authRouter;