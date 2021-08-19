import { Router } from 'express'
import uniqid from 'uniqid'
import { readAuthors, writeAuthors,readPosts, saveAvatar } from '../../utilities/fs-utilities.js'
import { authorValidation } from '../validation.js'
import { validationResult } from 'express-validator'
import createHttpError from 'http-errors'
import multer from 'multer'
import { extname } from 'path'


const authorRouter = Router()


authorRouter.get("/", async (req, res, next) => {
    try {
        const authors = await readAuthors()
        if (req.query && req.query.title) {
            const filteredAuthors = authors.filter(author => author.title === req.query.title)
            res.send(filteredAuthors)
        } else {
            res.send(authors)
        }
    } catch (error) {
        next(error)
    }
})

authorRouter.get("/:id", async (req, res, next) => {
    try {
        let authors = await readAuthors()
        let author = authors.find(author => author.id === req.params.id)
        if (author) {
            res.send(author)
        } else {
            next(createHttpError(404, `Author with ID #: ${req.params.id} cannot be found!`))
        }
    } catch (error) {
        next(error)
    }
})

authorRouter.get("/:id/posts", async (req, res, next) => {
    try {
        let posts = await readPosts()
        let authorsPosts = posts.filter(post => post.author === req.params.id)
         res.send(authorsPosts)
    } catch (error) {
        next(error)
    }
})

authorRouter.post("/", authorValidation, async (req, res, next) => {
    try {
        const authors = await readAuthors()
        const avoidEmailMatch = authors.findIndex(author => author.email === req.body.email)
        const errorList = validationResult(req)
        if (!errorList.isEmpty()) {
            next(createHttpError(400, { errorList }))
        } else if (avoidEmailMatch === 1) {
            next(createHttpError(404, `There is another author with the same Email: ${req.body.email} !`))
        } else {
            const newAuthor = { ...req.body, id: uniqid(), createdAt: new Date().toISOString() }
            authors.push(newAuthor)
            await writeAuthors(authors)
            res.status(201).send({ id: newAuthor.id })
        }
    } catch (error) {
        console.log(error);
        next(error)
    }
})

authorRouter.put("/:id", authorValidation, async (req, res, next) => {

    try {
        const errorList = validationResult(req)
        if (!errorList.isEmpty()) {
            next(createHttpError(400, { errorList }))
        } else {
            const authors = await readAuthors()
            const filteredAuthor = authors.filter(author => author.id !== req.params.id)
            const updatedAuthor = { id: req.params.id, ...req.body, updatedAt: new Date().toISOString() }
            filteredAuthor.push(updatedAuthor)
            await writeAuthors(filteredAuthor)
            res.status(201).send(updatedAuthor)
        }
    } catch (error) {
        console.log(error);
        next(error)
    }

})

authorRouter.put("/:id/avatar", multer().single('avatar'),  async (req, res, next) => {
    try {
        const extension = extname(req.file.originalname)
        const fileName = `${req.params.id}${extension}`
        const authors = await readAuthors()
        const author = authors.find(author => author.id === req.params.id)
        if (!author) {
            next(createHttpError(404, { errorList }))
        } else {
            await saveAvatar(fileName, req.file.buffer)
            const avatarPath = `http://localhost:${process.env.PORT}/${fileName}`
            const updatedAuthor = { id: req.params.id, ...author, avatar: avatarPath, updatedAt: new Date().toISOString() }
            const filteredAuthor = authors.filter(author => author.id !== req.params.id)
            filteredAuthor.push(updatedAuthor)
            await writeAuthors(filteredAuthor)
            res.status(201).send("The cover has been uploaded!", updatedAuthor)
        }
    } catch (error) {
        console.log(error);
        next(error)
    }
})

authorRouter.delete("/:id", async (req, res, next) => {
    try {
        const authors = await readAuthors()
        const findAuthors = authors.find(author => author.id === req.params.id)
        if (!findAuthors) {
            next(createHttpError(404, `Author with ID #: ${req.params.id} cannot be found!`))
        } else {
            const filteredAuthors = authors.filter(author => author.id !== req.params.id)
            await writeAuthors(filteredAuthors)
            res.status(204).send(filteredAuthors)
        }
    } catch {
        console.log(error)
        next(error)
    }
})




export default authorRouter