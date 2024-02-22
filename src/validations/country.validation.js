const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCountry = {
  body: Joi.object().keys({
    code: Joi.string().required().trim(),
    name: Joi.string().required().trim(),
  }),
};

const getCountries = {
  query: Joi.object().keys({
    code: Joi.string(),
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getCountry = {
  params: Joi.object().keys({
    countryId: Joi.string().custom(objectId),
  }),
};

const updateCountry = {
  params: Joi.object().keys({
    countryId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      code: Joi.string().trim(),
      name: Joi.string().trim(),
    })
    .min(1),
};

const deleteCountry = {
  params: Joi.object().keys({
    countryId: Joi.string().custom(objectId).required(),
  }),
};

const deleteManyCountries = {
  body: Joi.object().keys({
    countryIds: Joi.array().items(Joi.string().custom(objectId)).required(),
  }),
};

module.exports = {
  createCountry,
  getCountries,
  getCountry,
  updateCountry,
  deleteCountry,
  deleteManyCountries,
};
