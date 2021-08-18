import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs-extra'

const pathJsonPost = join(dirname(fileURLToPath(import.meta.url)), '../data/posts.json')

export const readPosts = () => fs.readFile(pathJsonPost)
export const writePosts = (content) => fs.writeFile(pathJsonPost, JSON.stringify(content, null, 2))