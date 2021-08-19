import express from 'express'
import cors from 'cors'
import listEndpoints from 'express-list-endpoints'
import {join} from 'path'
import postsRouter from './services/posts/index.js'
import filesRouter from './services/file/index.js'
import authorRouter from './services/authors/index.js'
import { badRequestError, forbiddenError, genericServerError, notFoundError } from './services/errorHandlers.js'


const server = express()

const port = process.env.PORT

const publicFolderPath = join(process.cwd(), "public")

server.use(express.static(publicFolderPath)) // this is to access the public folder
server.use(cors())
server.use(express.json())

server.use("/posts", postsRouter)
server.use("/files", filesRouter)
server.use("/authors", authorRouter)

server.use(notFoundError)
server.use(badRequestError)
server.use(forbiddenError)
server.use(genericServerError)


console.table(listEndpoints(server))

server.listen(port, () => console.log(`Server is running on Port #: ${port}`))
server.on('error', (error) => console.log(`Server is not running due to ${error}`))