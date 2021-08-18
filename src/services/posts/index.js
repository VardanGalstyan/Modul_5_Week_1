import { Router } from 'express'
import { readPosts, writePosts } from '../../utilities/fs-utilities.js'
import uniqid from 'uniqid'

const postsRouter = Router()

postsRouter.get("/", async (req, res, next) => {
    try {
        const posts = await readPosts()
        res.send(posts)
    } catch (error) {
        console.log(error);
        next(error)
    }
})

postsRouter.get("/:id", async (req, res, next) => {
    try {
        let posts = await readPosts()
        posts = posts.find(post => post.id === req.params.id)
        res.send(posts)
    } catch (error) {
        console.log(error);
        next(error)
    }
})

postsRouter.post("/", async (req, res, next) => {
    try {
        let posts = JSON.parse(await readPosts())
        console.log('posts', posts);
        const newPost = { ...req.body, id: uniqid(), createdAt: new Date().toISOString() }
        console.log('newpost', newPost);
        posts.push(newPost)
        await writePosts(posts)
        res.status(201).send({ id: newPost.id })
    } catch (error) {
        console.log(error);
        next(error)
    }
})

postsRouter.put("/:id", async (req, res, next) => {

    try {
        let posts = JSON.parse(await readPosts())
        const filteredPosts = posts.filter(post => post.id !== req.params.id)
        const updatedPost = { id: req.params.id, ...req.body, updatedAt: new Date().toISOString() }
        filteredPosts.push(updatedPost)
        await writePosts(filteredPosts)
        res.status(201).send(updatedPost)
    } catch (error) {
        console.log(error);
        next(error)
    }

})

postsRouter.delete("/:id", async (req, res, next) => {
    try {
        let posts = JSON.parse(await readPosts())
        posts = posts.filter(post => post.id !== req.params.id)
        await writePosts(posts)
        req.status(204).send()
    } catch {
        console.log(error);
        next(error)
    }
})


export default postsRouter