const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCollege = {
  body: Joi.object().keys({
    name: Joi.string().required().trim(),
    university: Joi.string().custom(objectId).required(),
  }),
};

const getColleges = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getCollege = {
  params: Joi.object().keys({
    collegeId: Joi.string().custom(objectId).required(),
  }),
};

const updateCollege = {
  params: Joi.object().keys({
    collegeId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().trim(),
    university: Joi.string().custom(objectId),
  }),
};

const deleteCollege = {
  params: Joi.object().keys({
    collegeId: Joi.string().custom(objectId).required().trim(),
  }),
};

const deleteManyColleges = {
  body: Joi.object().keys({
    collegeIds: Joi.array().items(Joi.string().custom(objectId)).required(),
  }),
};

const searchCollegeByUniversity = {
  params: Joi.object().keys({
    universityId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createCollege,
  getColleges,
  getCollege,
  updateCollege,
  deleteCollege,
  deleteManyColleges,
  searchCollegeByUniversity,
};
