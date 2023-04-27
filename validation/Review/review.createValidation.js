let joi = require("joi")


module.exports = {

    createReviewVaidation: {

        body: joi.object().required().keys({

            user: joi.string().empty().required().messages({
                "string.base": "please enter a valid user Id",
                "any.required": "user Id must be entered",
                "string.empty": "user Id cannot be empty"
            }),


            restaurant: joi.string().empty().required().messages({
                "string.base": "please enter a valid restaurant Id",
                "any.required": "restaurant Id must be entered",
                "string.empty": "restaurant Id cannot be empty"
            }),
            mael: joi.string().empty().optional().messages({
                "string.base": "please enter a valid mael Id",
                "string.empty": "mael Id cannot be empty"
            }),
            delivery: joi.string().empty().optional().messages({
                "string.base": "please enter a valid delivery Id",
                "string.empty": "delivery Id cannot be empty"
            }),

            review: joi.string().empty().optional().max(150).messages({
                "string.base": "please enter a valid review",
                "string.empty": "review cannot be empty",
                "string.max": "Review must be no more than 150 characters"
            }),

            rating: joi.number().required().min(1).max(5).messages({
                "number.base": "please enter a valid rating",
                "any.required": "rating must be entered",
                "number.min": "rating must be between 1 and 5",
                "number.max": "rating must be between 1 and 5"
            }),

            type: joi.string().empty().required().messages({
                "string.base": "please enter a valid type [delivery, restaurant, mael]",
                "string.empty": "type cannot be empty",
                "any.required": "type must be entered [delivery, restaurant, mael]"
            })


        })
    }

}