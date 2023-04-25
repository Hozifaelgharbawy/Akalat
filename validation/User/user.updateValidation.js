let joi = require("joi")


module.exports = {
  updateUserValidation: {
    body: joi.object().required().keys({
      name: joi.string().optional().empty().messages({
        "string.base": "please enter a valid name",
        "string.empty": "name cannot be empty"
      }),
      email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com'] } }).empty().optional().messages({
        "string.email": "please enter a valid email",
        "string.empty": "email cannot be empty"
      }),
      password: joi.string().empty().optional().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)).messages({
        "string.base": "please enter a valid password",
        "string.empty": "password cannot be empty",
        "string.pattern.base": "please enter a valid password A-Z, a-z, 1-9, special character"
      }),
      image: joi.object().optional().messages({
        "object.base": "please enter a valid image"
      }),
      role: joi.string().optional().messages({
        "string.base": "please enter a valid role admin or user"
      }),
      address: joi.string().optional().empty().messages({
        "string.base": "please enter a valid address",
        "string.empty": "address cannot be empty"
      }),
      phone: joi.string().optional().empty().messages({
        "string.base": "please enter a valid phone",
        "string.empty": "phone cannot be empty"
      }),
    })
  },
}