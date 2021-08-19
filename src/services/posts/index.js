import { Router } from 'express'
import { readPosts, writePosts } from '../../utilities/fs-utilities.js'
import { commentValidation, postValidation } from '../validation.js'
import { validationResult } from 'express-validator'
import createHttpError from 'http-errors'
import uniqid from 'uniqid'
import { calculateReadTime } from '../../utilities/wordCount.js'

const postsRouter = Router()

postsRouter.get("/", async (req, res, next) => {
    try {
        const posts = await readPosts()
        if (req.query && req.query.title) {
            const filteredPosts = posts.filter(post => post.title === req.query.title)
            res.send(filteredPosts)
        } else {
            res.send(posts)
        }
    } catch (error) {
        next(error)
    }
})

postsRouter.get("/:id", async (req, res, next) => {
    try {
        let posts = await readPosts()
        let post = posts.find(post => post.id === req.params.id)
        if (post) {
            res.send(post)
        } else {
            createHttpError(404, `Post with ID #: ${req.params.id} cannot be found!`)
        }
    } catch (error) {
        next(error)
    }
})

postsRouter.get("/:id/comments", async (req, res, next) => {
    try {
        const posts = await readPosts()
        const post = posts.find(post => post.id === req.params.id)
        if(post){
            res.send(post.comments)
        } else {
            next(createHttpError(404, `Comments for the Post of ID: ${req.params.id} are not found!`))
        }
    } catch (error) {
        next(error)
    }
})

postsRouter.post("/", postValidation, async (req, res, next) => {
    try {
        const errorList = validationResult(req)
        if (!errorList.isEmpty()) {
            next(createHttpError(400, { errorList }))
        } else {
            let posts = await readPosts()
            const newPost = { ...req.body, readTime:calculateReadTime(req.body.content), id: uniqid(), createdAt: new Date().toISOString(), comments:[] }
            posts.push(newPost)
            await writePosts(posts)
            res.status(201).send({ id: newPost.id })
        }
    } catch (error) {
        console.log(error);
        next(error)
    }
})

postsRouter.post("/:id/comments", commentValidation, async (req, res, next) => {
    try {
        const posts = await readPosts()
        const filteredPosts = posts.filter(post => post.id !== req.params.id)
        const post = posts.find(post => post.id === req.params.id)
        console.log(post);
        if(post){
            const errorList = validationResult(req)
            if (!errorList.isEmpty()) {
                next(createHttpError(400, { errorList }))
            } else {
                const newComment = { commentId: uniqid(), ...req.body,  createdAt: new Date().toISOString() }
                const arrayOfComments = post.comments
                arrayOfComments.push(newComment)
                console.log(arrayOfComments);
                console.log(post);
                const updatedPosts = {...post, comments: arrayOfComments}
                filteredPosts.push(updatedPosts)
                await writePosts(filteredPosts)
                res.status(201).send('Uploaded Successfully')
            }
            createHttpError(404, `Post with ID #: ${req.params.id} cannot be found!`)
        }
    } catch (error) {
        console.log(error);
        next(error)
    }
})

postsRouter.put("/:id", async (req, res, next) => {

    try {
        let posts = await readPosts()
        const findPost = posts.find(post => post.id === req.params.id)
        if (!findPost) {
            next(createHttpError(404, `Post with ID #: ${req.params.id} cannot be found!`))
        } else {
            const filteredPosts = posts.filter(post => post.id !== req.params.id)
            const updatedPost = { id: req.params.id, ...req.body, updatedAt: new Date().toISOString() }
            filteredPosts.push(updatedPost)
            await writePosts(filteredPosts)
            res.status(201).send(updatedPost)
        }
    } catch (error) {
        console.log(error);
        next(error)
    }

})

postsRouter.delete("/:id", async (req, res, next) => {
    try {
        let posts = await readPosts()
        const findPost = posts.find(post => post.id === req.params.id)
        if (!findPost) {
            createHttpError(404, `Post with ID #: ${req.params.id} cannot be found!`)
        } else {
            posts = posts.filter(post => post.id !== req.params.id)
            await writePosts(posts)
            req.status(204).send()
        }
    } catch {
        console.log(error);
        next(error)
    }
})




export default postsRouter