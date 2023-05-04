let joi = require("joi")


module.exports = {

    createMealVaidation: {

        body: joi.object().required().keys({
            name: joi.string().required().empty().messages({
                "string.base": "please enter a valid name",
                "any.required": "name must be entered",
                "string.empty": "name cannot be empty"
            }),

            restaurant: joi.string().empty().required().messages({
                "string.base": "please enter a valid restaurant Id",
                "any.required": "restaurant Id must be entered",
                "string.empty": "restaurant id cannot be empty"
            }),


            price: joi.number().required().messages({
                "number.base": "please enter a valid price",
                "any.required": "price must be entered"
            }),


            originalPrice: joi.number().required().messages({
                "number.base": "please enter a valid originalPrice",
                "any.required": "originalPrice must be entered"
            }),


            image: joi.array().optional().messages({
                "array.base": "please enter a valid image"
            }),

            description: joi.string().empty().optional().messages({
                "string.base": "please enter a valid description",
                "string.empty": "restaurant id cannot be empty"
            }),

            rate: joi.number().optional().min(1).max(5).messages({
                "number.base": "please enter a valid rate",
                "number.min": "rate must be between 1 and 5",
                "number.max": "rate must be between 1 and 5"
            }),

            numOfReviews: joi.number().optional().messages({
                "number.base": "please enter a valid numOfReviews",
            }),

        })
    }

}