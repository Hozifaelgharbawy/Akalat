let joi = require("joi")


module.exports = {
  createDeliveryValidation: {
    body: joi.object().required().keys({
      name: joi.string().required().empty().messages({
        "string.base": "please enter a valid name",
        "any.required": "name must be entered",
        "string.empty": "name cannot be empty"
      }),
      email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com'] } }).empty().required().messages({
        "string.email": "please enter a valid email",
        "any.required": "email must be entered",
        "string.empty": "email cannot be empty"
      }),
      password: joi.string().empty().required().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)).messages({
        "string.base": "please enter a valid password",
        "any.required": "password must be entered",
        "string.empty": "password cannot be empty",
        "string.pattern.base": "please enter a valid password A-Z, a-z, 1-9, special character"
      }),
      image: joi.object().optional().messages({
        "object.base": "please enter a valid image"
      }),
      role: joi.string().optional().messages({
        "string.base": "please enter a valid role admin or user"
      }),
      address: joi.string().required().empty().messages({
        "string.base": "please enter a valid address",
        "any.required": "address must be entered",
        "string.empty": "address cannot be empty"
      }),
      phone: joi.string().required().empty().messages({
        "string.base": "please enter a valid phone",
        "any.required": "phone must be entered",
        "string.empty": "phone cannot be empty"
      }),
    })
  },

  loginValidation: {
    body: joi.object().required().keys({
      email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com'] } }).empty().required().messages({
        "string.email": "please enter a valid email",
        "any.required": "email must be entered",
        "string.empty": "email cannot be empty"
      }),
      password: joi.string().empty().required().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)).messages({
        "string.base": "please enter a valid password",
        "any.required": "password must be entered",
        "string.empty": "password cannot be empty",
        "string.pattern.base": "please enter a valid password A-Z, a-z, 1-9, special character"
      })
    })
  },

  resetPasswordValidation: {
    body: joi.object().required().keys({
      email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com'] } }).empty().required().messages({
        "string.email": "please enter a valid email",
        "any.required": "email must be entered",
        "string.empty": "email cannot be empty"
      }),
      newPassword: joi.string().empty().required().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)).messages({
        "string.base": "please enter a valid newPassword",
        "any.required": "newPassword must be entered",
        "string.empty": "newPassword cannot be empty",
        "string.pattern.base": "please enter a valid newPassword A-Z, a-z, 1-9, special character"
      })
    })
},
}