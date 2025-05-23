const Joi = require("joi");

const listSchema = Joi.object({
    list: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().min(5).required(),
        image: Joi.string().allow("", null),
        country:Joi.string().required()
    }).required()
});


const reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required()
    })
})


module.exports = { listSchema,reviewSchema };

