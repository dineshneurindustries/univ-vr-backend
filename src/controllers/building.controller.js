const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { buildingService } = require('../services');

const createBuilding = catchAsync(async (req, res) => {
  const college = await buildingService.createBuilding(req.body);
  res.status(httpStatus.CREATED).send(college);
});

const getBuildings = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await buildingService.queryBuilding(filter, options);
  res.send(result);
});

const getBuilding = catchAsync(async (req, res) => {
  const building = await buildingService.getBuildingById(req.params.buildingId);
  if (!building) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Building not found');
  }
  res.send(building);
});

const updateBuilding = catchAsync(async (req, res) => {
  const building = await buildingService.updateBuildingById(req.params.buildingId, req.body);
  res.send(building);
});

const deleteBuilding = catchAsync(async (req, res) => {
  await buildingService.deleteBuildingById(req.params.buildingId);
  res.status(httpStatus.NO_CONTENT).send();
});

const deleteManyBuildings = catchAsync(async (req, res) => {
  await buildingService.deleteManyBuildingById(req.body);
  res.status(httpStatus.NO_CONTENT).send();
});

const searchBuildingByCollege = catchAsync(async (req, res) => {
  const college = await buildingService.searchBuildingsByCollege(req.params.collegeId);
  res.send({ college });
});

module.exports = {
  createBuilding,
  getBuildings,
  getBuilding,
  updateBuilding,
  deleteBuilding,
  deleteManyBuildings,
  searchBuildingByCollege,
};
