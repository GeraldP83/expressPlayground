const Joi = require('joi')
const crudSchema = {
    "cuSchema": {
        name: Joi.string().min(1).required()    
    },
    "rSchema": {
        query: Joi.string().regex(/^(id|name)$/).required()    
    }
}

module.exports = crudSchema
