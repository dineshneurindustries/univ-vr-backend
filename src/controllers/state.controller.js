const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { stateService } = require('../services');

const createState = catchAsync(async (req, res) => {
  const state = await stateService.createState(req.body);
  res.status(httpStatus.CREATED).send(state);
});

const getStates = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await stateService.queryState(filter, options);
  res.send(result);
});

const getState = catchAsync(async (req, res) => {
  const state = await stateService.getStateById(req.params.stateId);
  if (!state) {
    throw new ApiError(httpStatus.NOT_FOUND, 'State not found');
  }
  res.send(state);
});

const updateState = catchAsync(async (req, res) => {
  const state = await stateService.updateStateById(req.params.stateId, req.body);
  res.send(state);
});

const deleteState = catchAsync(async (req, res) => {
  await stateService.deleteStateById(req.params.stateIds);
  res.status(httpStatus.NO_CONTENT).send();
});

const deleteManyStates = catchAsync(async (req, res) => {
  await stateService.deleteManyStateById(req.body);
  res.status(httpStatus.NO_CONTENT).send();
});

const searchStateByCountry = catchAsync(async (req, res) => {
  const country = await stateService.searchStatesByCountry(req.params.countryId);
  res.send({ country });
});
module.exports = {
  createState,
  getStates,
  getState,
  updateState,
  deleteState,
  deleteManyStates,
  searchStateByCountry,
};
