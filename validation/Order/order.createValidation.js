let joi = require("joi")


module.exports = {

    createOrderVaidation: {

        body: joi.object().required().keys({

            user: joi.string().empty().required().messages({
                "string.base": "please enter a valid user Id",
                "any.required": "user id must be entered",
                "string.empty": "user id cannot be empty"
            }),


            restaurant: joi.string().empty().optional().messages({
                "string.base": "please enter a valid restaurant Id",
                "string.empty": "restaurant id cannot be empty"
            }),

            delivery: joi.string().empty().optional().messages({
                "string.base": "please enter a valid delivery Id",
                "string.empty": "delivery id cannot be empty"
            }),

            items: joi.alternatives().optional().try(
                joi.object().optional().keys({
                    meal: joi.object().required().messages({
                        "object.base": "please enter a valid meal",
                        "any.required": "meal must be entered"
                    }),
                    quantity: joi.number().required().messages({
                        "number.base": "please enter a valid quantity",
                        "any.required": "quantity must be entered"
                    }),
                    total: joi.number().required().messages({
                        "number.base": "please enter a valid total cost",
                        "any.required": "total cost must be entered"
                    }),
                }).messages({
                    "object.base": "please enter a valid items"
                }),


                joi.array().min(2).optional().items(joi.object().optional().keys({
                    meal: joi.object().required().messages({
                        "object.base": "please enter a valid meal",
                        "any.required": "meal must be entered"
                    }),
                    quantity: joi.number().required().messages({
                        "number.base": "please enter a valid quantity",
                        "any.required": "quantity must be entered"
                    }),
                    total: joi.number().required().messages({
                        "number.base": "please enter a valid total cost",
                        "any.required": "total cost must be entered"
                    }),
                }).messages({
                    "object.base": "please enter a valid item"
                })).messages({
                    "array.base": "please enter a valid items",
                    "array.min": "you have to enter at least one item"
                })
            ),

            total: joi.number().required().messages({
                "number.base": "please enter a valid total cost",
                "any.required": "total cost must be entered"
            }),

            originalTotal: joi.number().optional().messages({
                "number.base": "please enter a valid total"
            }),



        })
    }

}