import multer from 'multer'
export const parseFile = multer()

export const uploadFile = (req,res,next)=> {

    try {
        console.log(req.file)
        res.send(ok)
    } catch (error) {
        next(error)
    }
}