import express from 'express';
import multer from 'multer';

const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "public/images");
    },
    filename: (req, file, cb)=>{
        cb(null, req.body.name);
    }
});
const upload = multer({storage: storage});

router.post('/', upload.single("file", (req, res)=>{
    try {
        return res.status(200).json("Uploaded Successfully")
    } catch (error) {
        console.log(error)
    }
}))

export default router