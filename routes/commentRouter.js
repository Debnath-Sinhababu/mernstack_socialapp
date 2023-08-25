import express from 'express'
import commentCtrl from "../controllers/commentCtrl.js";
import auth from "../middleware/auth.js";

const router=express.Router()

router.post('/comment', auth, commentCtrl.createComment)
router.put('/comment/:id', auth, commentCtrl.updateComment)
router.put('/comment/:id/like', auth, commentCtrl.likeComment)

router.put('/comment/:id/unlike', auth, commentCtrl.unLikeComment)
router.delete('/comment/:id', auth, commentCtrl.deleteComment)
export default router