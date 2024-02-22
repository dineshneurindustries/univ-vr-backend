const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createBuilding = {
  body: Joi.object().keys({
    name: Joi.array().required(),
    college: Joi.string().custom(objectId).required(),
  }),
};
const getBuildings = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getBuilding = {
  params: Joi.object().keys({
    buildingId: Joi.string().custom(objectId).required(),
  }),
};

const updateBuilding = {
  params: Joi.object().keys({
    buildingId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().trim(),
      college: Joi.string().custom(objectId),
    })
    .min(1),
};

const deleteBuilding = {
  params: Joi.object().keys({
    buildingId: Joi.string().custom(objectId),
  }),
};

const deleteManyBuildings = {
  body: Joi.object().keys({
    buildingIds: Joi.array().items(Joi.string().custom(objectId).required()).required(),
  }),
};

const searchBuildingByCollege = {
  params: Joi.object().keys({
    collegeId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createBuilding,
  getBuildings,
  getBuilding,
  updateBuilding,
  deleteBuilding,
  deleteManyBuildings,
  searchBuildingByCollege,
};
