import {Router} from 'express'
import multer from 'multer'
import { saveAvatar } from '../../utilities/fs-utilities.js'

const filesRouter = Router()

filesRouter.post("/upload", multer().single('avatar'), async (req, res, next) => {
    try {
    await saveAvatar(req.file.originalname, req.file.buffer)
    res.send("Image has been uploaded!")
    } catch (error) {
        console.log(err);
        next(err)
    }
})

filesRouter.post("/uploadMultiple", multer().array('avatar'), async (req, res, next) => {
    try {
        const arrayOfPromises = req.files.map(file => saveAvatar(req.file.originalname, req.file.buffer))
        await  Promise.all(arrayOfPromises)
    } catch (error) {
        console.log(err);
        next(err)
    }
})

export default filesRouter