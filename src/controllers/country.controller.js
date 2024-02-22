const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { countryService } = require('../services');

const createCountry = catchAsync(async (req, res) => {
  const country = await countryService.createCountry(req.body);
  res.status(httpStatus.CREATED).send(country);
});

const getCountries = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await countryService.queryCountry(filter, options);
  res.send(result);
});

const getCountry = catchAsync(async (req, res) => {
  const country = await countryService.getCountryById(req.params.countryId);
  if (!country) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Country not found');
  }
  res.send(country);
});

const updateCountry = catchAsync(async (req, res) => {
  const country = await countryService.updateCountryById(req.params.countryId, req.body);
  res.send(country);
});

const deleteCountry = catchAsync(async (req, res) => {
  await countryService.deleteCountryById(req.params.countryId);
  res.status(httpStatus.NO_CONTENT).send();
});

const deleteManyCountries = catchAsync(async (req, res) => {
  await countryService.deleteManyCountryById(req.body);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createCountry,
  getCountries,
  getCountry,
  updateCountry,
  deleteCountry,
  deleteManyCountries,
};
