import { Router } from 'express'
import uniqid from 'uniqid'
import { readAuthors, writeAuthors } from '../../utilities/fs-utilities.js'
import { authorValidation } from '../validation.js'
import { validationResult } from 'express-validator'
import createHttpError from 'http-errors'

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
            createHttpError(404, `Author with ID #: ${req.params.id} cannot be found!`)
        }
    } catch (error) {
        next(error)
    }
})

authorRouter.post("/", authorValidation, async (req, res, next) => {
    try {
        const authors = await readAuthors()
        const avoidEmailMatch = authors.findIndex(author => author.email === req.body.email)
        const errorList = validationResult(req)
        if (!errorList.isEmpty() || avoidEmailMatch) {
            next(createHttpError(400, { errorList }))
        } else if (authors.email === req.body.email) {
            next(createHttpError(400, { errorList }))
        } else {
            console.log(authors.indexOf);
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

authorRouter.delete("/:id", async (req, res, next) => {
    try {
        const authors = await readAuthors()
        const findAuthors = authors.find(author => author.id === req.params.id)
        if (!findAuthors) {
            createHttpError(404, `Author with ID #: ${req.params.id} cannot be found!`)
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