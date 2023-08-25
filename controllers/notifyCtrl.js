import notifyModel from "../model/notifyModel.js";

const notifyCtrl={
    createNotify: async (req, res) => {
        try {
            const { id, recipients, url, text, content, image } = req.body

          
            if(recipients.includes(req.user._id.toString())) return;
            const notify = new notifyModel({
                id, recipients, url, text, content, image, user: req.user._id
            })

            await notify.save()
            return res.json({notify})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    removeNotify: async (req, res) => {
        console.log(req.params.id)
        try {
            const notify = await notifyModel.findOneAndDelete({
                id: req.params.id, url: req.query.url
            })
            
            return res.json({notify})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getNotifies: async (req, res) => {
        try {
            const notifies = await notifyModel.find({recipients: req.user._id})
            .sort('-createdAt').populate('user', 'avatar username')
            
            return res.json({notifies})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    isReadNotify: async (req, res) => {
        try {
            const notifies = await notifyModel.findOneAndUpdate({_id: req.params.id}, {
                isRead: true
            })

            return res.json({notifies})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteAllNotifies: async (req, res) => {
        try {
            const notifies = await notifyModel.deleteMany({recipients: req.user._id})
            console.log({notifies})
            
            return res.json({notifies})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
}
export default notifyCtrl