let joi = require("joi")



module.exports = {

    createWishlistVaidation: {

        body: joi.object().required().keys({

            user: joi.string().empty().required().messages({
                "string.base": "please enter a valid user Id",
                "string.empty": "user id cannot be empty",
                "any.required": "user id must be entered"
            }),

            items: joi.alternatives().optional().try(
                joi.object().optional().keys({
                    meal: joi.object().required().messages({
                        "object.base": "please enter a valid meal",
                        "any.required": "meal must be entered"
                    }),
                    restaurant: joi.string().empty().required().messages({
                        "string.base": "please enter a valid restaurant Id",
                        "any.required": "restaurant Id must be entered",
                        "string.empty": "restaurant id cannot be empty"
                    }),
                }).messages({
                    "object.base": "please enter a valid items"
                }),


                joi.array().min(2).optional().items(joi.object().optional().keys({
                    meal: joi.object().required().messages({
                        "object.base": "please enter a valid meal",
                        "any.required": "meal must be entered"
                    }),
                    restaurant: joi.string().empty().required().messages({
                        "string.base": "please enter a valid restaurant Id",
                        "any.required": "restaurant Id must be entered",
                        "string.empty": "restaurant id cannot be empty"
                    }),
                }).messages({
                    "object.base": "please enter a valid item"
                })).messages({
                    "array.base": "please enter a valid items",
                    "array.min": "you have to enter at least one item"
                })
            ),

        })
    }

}