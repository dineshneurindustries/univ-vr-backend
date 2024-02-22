const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createState = {
  body: Joi.object().keys({
    name: Joi.string().required().trim(),
    state_code: Joi.string().required().trim(),
    country: Joi.string().custom(objectId).required(),
  }),
};

const getStates = {
  query: Joi.object().keys({
    name: Joi.string(),
    state_code: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getState = {
  params: Joi.object().keys({
    stateId: Joi.string().custom(objectId).required(),
  }),
};

const updateState = {
  params: Joi.object().keys({
    stateId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().trim(),
      state_code: Joi.string().trim(),
      country: Joi.string().custom(objectId),
    })
    .min(1),
};

const deleteState = {
  params: Joi.object().keys({
    stateId: Joi.string().custom(objectId).required(),
  }),
};

const deleteManyStates = {
  body: Joi.object().keys({
    stateIds: Joi.array().items(Joi.string().custom(objectId)).required(),
  }),
};

const searchStateByCountry = {
  params: Joi.object().keys({
    countryId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createState,
  getStates,
  getState,
  updateState,
  deleteState,
  deleteManyStates,
  searchStateByCountry,
};
