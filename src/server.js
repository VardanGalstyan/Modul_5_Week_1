import express from 'express'
import cors from 'cors'
import listEndpoints from 'express-list-endpoints'
import postsRouter from './services/posts/index.js'


const server = express()

const port = process.env.PORT

server.use(cors())
server.use(express.json())

server.use("/posts", postsRouter)


console.table(listEndpoints(server))

server.listen(port, () => console.log(`Server is running on Port #: ${port}`))
server.on('error', (error) => console.log(`Server is not running due to ${error}`))