import express from 'express'
import postCtrl from '../controllers/postCtrl.js'
import auth from '../middleware/auth.js'
const router=express.Router()
router.route('/posts').post(auth,postCtrl.createPost)
router.route('/post/:id').get(auth,postCtrl.getPosts).put(auth,postCtrl.updatePost).delete(auth, postCtrl.deletePost)
router.route('/post/:id/like').put(auth,postCtrl.likePost)
router.route('/post/:id/unlike').put(auth,postCtrl.unLikePost)
router.get('/user_posts/:id', auth, postCtrl.getUserPosts)

router.route('/singlepost/:id') .get(auth, postCtrl.getPost)
router.get('/post_discover', auth, postCtrl.getPostsDicover)
router.put('/savePost/:id', auth, postCtrl.savePost)
router.put('/unSavePost/:id', auth, postCtrl.unSavePost)
router.get('/getSavePosts', auth, postCtrl.getSavePosts)
export default router