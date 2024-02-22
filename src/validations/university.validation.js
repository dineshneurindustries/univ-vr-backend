const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createUniversity = {
  body: Joi.object().keys({
    name: Joi.string().required().trim(),
    state: Joi.string().custom(objectId).required().trim(),
  }),
};

const getUniversities = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUniversity = {
  params: Joi.object().keys({
    universityId: Joi.string().custom(objectId).required().trim(),
  }),
};

const updateUniversity = {
  params: Joi.object().keys({
    universityId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().trim(),
      state: Joi.string().custom(objectId).required().trim(),
    })
    .min(1),
};

const deleteUniversity = {
  params: Joi.object().keys({
    universityId: Joi.string().custom(objectId).required().trim(),
  }),
};

const deleteManyUniversities = {
  body: Joi.object().keys({
    universityIds: Joi.array().items(Joi.string().custom(objectId)).required(),
  }),
};

const searchUniversitiesByState = {
  params: Joi.object().keys({
    stateId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createUniversity,
  getUniversities,
  getUniversity,
  updateUniversity,
  deleteUniversity,
  deleteManyUniversities,
  searchUniversitiesByState,
};
