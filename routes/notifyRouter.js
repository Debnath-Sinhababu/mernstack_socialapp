import express from 'express'
import auth from '../middleware/auth.js'
import notifyCtrl from '../controllers/notifyCtrl.js'
 const router=express.Router()
router.post('/notify', auth, notifyCtrl.createNotify)
router.delete('/notify/:id', auth, notifyCtrl.removeNotify)
router.get('/notifies', auth, notifyCtrl.getNotifies)
router.put('/isReadNotify/:id', auth, notifyCtrl.isReadNotify)
router.delete('/deleteAllNotify', auth, notifyCtrl.deleteAllNotifies)
export default router