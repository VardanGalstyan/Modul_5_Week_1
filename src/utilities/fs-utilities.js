import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs-extra'

const { readJSON, writeJSON, writeFile } = fs

const pathJsonPost = join(dirname(fileURLToPath(import.meta.url)), '../data/posts.json')
const pathJsonAuthors = join(dirname(fileURLToPath(import.meta.url)), '../data/authors.json')
export const publicFolderPath = join(dirname(fileURLToPath(import.meta.url)), '../../public/img/cover')
export const AvatarFolderPath = join(dirname(fileURLToPath(import.meta.url)), '../../public/img/avatar')


export const readPosts  = () => readJSON(pathJsonPost)
export const writePosts = (content) => writeJSON(pathJsonPost, content,)

export const readAuthors  = () => readJSON(pathJsonAuthors)
export const writeAuthors = (content) => writeJSON(pathJsonAuthors, content)

export const saveAvatar = (filename, content) => writeFile(join(publicFolderPath, filename), content)
export const saveCover = (filename, content) => writeFile(join(AvatarFolderPath, filename), content)