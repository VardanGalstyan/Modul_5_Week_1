import { body } from 'express-validator'

export const postValidation =
    [
        body("author").exists().withMessage("Author is a  mandatory filed!"),
        body("category").exists().withMessage("Category is a mandatory filed!"),
        body("title").exists().withMessage("Title is a mandatory filed!"),
        body("cover").exists().withMessage("Cover is a mandatory filed!"),
        body("content").exists().withMessage("Content is a mandatory filed!")
    ]

export const authorValidation =
    [
        body("name").exists().withMessage("Name is a mandatory filed!"),
        body("surname").exists().withMessage("Surname is a mandatory filed!"),
        body("email").exists().withMessage("Email is a mandatory filed!"),
        body("dateofbirth").exists().withMessage("Date of birth is a mandatory filed!"),
        body("avatar").exists().withMessage("Avatar is a mandatory filed!")
    ]
    
export const commentValidation =
    [
        body("author").exists().withMessage("Author is a mandatory filed!"),
        body("content").exists().withMessage("Content is a mandatory filed!"),
    ]

