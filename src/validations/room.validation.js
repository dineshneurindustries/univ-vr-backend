const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createRoom = {
  body: Joi.object().keys({
    name: Joi.string().required().trim(),
    image: Joi.string(),
    description: Joi.string(),
    building: Joi.string().custom(objectId).required(),
  }),
};

const getRooms = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getRoom = {
  params: Joi.object().keys({
    roomId: Joi.string().custom(objectId).required(),
  }),
};

const updateRoom = {
  params: Joi.object().keys({
    roomId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().trim(),
    image: Joi.string().trim(),
    description: Joi.string(),
    building: Joi.string().custom(objectId),
  }),
};

const deleteRoom = {
  params: Joi.object().keys({
    roomId: Joi.string().custom(objectId).required(),
  }),
};

const deleteManyRooms = {
  body: Joi.object().keys({
    roomIds: Joi.array().items(Joi.string().custom(objectId).required()).required(),
  }),
};

const searchRoomsByBuilding = {
  params: Joi.object().keys({
    buildingId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createRoom,
  getRooms,
  getRoom,
  updateRoom,
  deleteRoom,
  deleteManyRooms,
  searchRoomsByBuilding,
};
