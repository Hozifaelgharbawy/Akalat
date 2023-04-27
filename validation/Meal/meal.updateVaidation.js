let joi = require("joi")


module.exports = {

    updateMealVaidation: {

        body: joi.object().required().keys({
            name: joi.string().optional().empty().messages({
                "string.base": "please enter a valid name",
                "string.empty": "name cannot be empty"
            }),

            restaurant: joi.string().empty().optional().messages({
                "string.base": "please enter a valid restaurant Id",
                "string.empty": "restaurant id cannot be empty"
            }),


            price: joi.number().optional().messages({
                "number.base": "please enter a valid price"
            }),


            originalPrice: joi.number().optional().messages({
                "number.base": "please enter a valid originalPrice"
            }),


            image: joi.array().optional().messages({
                "array.base": "please enter a valid image"
            }),

            description: joi.object().optional().messages({
                "object.base": "please enter a valid description"
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