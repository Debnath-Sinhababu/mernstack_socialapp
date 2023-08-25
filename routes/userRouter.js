import express from 'express';
import userCtrl from '../controllers/userCtrl.js';
import auth from '../middleware/auth.js';
const router=express.Router();

router.get('/search', auth  ,userCtrl.searchUser);
router.get('/user/:id', auth, userCtrl.getUser)
router.put('/user', auth, userCtrl.updateUser)
router.put('/user/follow/:id', auth, userCtrl.follow)
router.put('/user/unfollow/:id', auth, userCtrl.unfollow)
router.get('/suggestionsUser', auth, userCtrl.suggestionsUser)
export default router