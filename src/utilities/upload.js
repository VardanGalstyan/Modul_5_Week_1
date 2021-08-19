import multer from 'multer'
import { extname, join } from 'path'
import { publicFolderPath, saveAvatar } from './fs-utilities.js'

export const parseFile = multer()

export const uploadFile = async (req, res, next) => {
    try {
        const extension = extname(req.file.originalname)
        const fileName = `${req.params.id}${extension}`
        const pathToFile = join(publicFolderPath, fileName)
        await saveAvatar(pathToFile, req.file.buffer)
        const url = `http://localhost:${process.env.PORT}/${fileName}`
        req.file = url
        next()
    } catch (error) {
        next(error)
    }
}