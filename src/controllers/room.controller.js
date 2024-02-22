const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { roomService } = require('../services');

const createRoom = catchAsync(async (req, res) => {
  const room = await roomService.createRoom(req);
  res.status(httpStatus.CREATED).json(room);
});

const getRooms = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await roomService.queryRoom(filter, options);
  res.send(result);
});

const getRoom = catchAsync(async (req, res) => {
  const building = await roomService.getRoomById(req.params.roomId);
  if (!building) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Building not found');
  }
  res.send(building);
});

const updateRoom = catchAsync(async (req, res) => {
  const building = await roomService.updateRoomById(req.params.roomId, req);
  res.send(building);
});

const deleteRoom = catchAsync(async (req, res) => {
  await roomService.deleteRoomById(req.params.roomId);
  res.status(httpStatus.NO_CONTENT).send();
});

const deleteManyRooms = catchAsync(async (req, res) => {
  await roomService.deleteManyRoomById(req.body);
  res.status(httpStatus.NO_CONTENT).send();
});

const searchRoomsByBuilding = catchAsync(async (req, res) => {
  const building = await roomService.searchRoomsByBuilding(req.params.buildingId);
  res.send({ building });
});

module.exports = {
  createRoom,
  getRooms,
  getRoom,
  updateRoom,
  deleteRoom,
  deleteManyRooms,
  searchRoomsByBuilding,
};
