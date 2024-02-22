const httpStatus = require('http-status');
const { Country } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCountry = async (filter, options) => {
  const country = await Country.paginate(filter, options);
  return country;
};

/**
 * Create a country
 * @param {Object} countryBody
 * @returns {Promise<Country>}
 */
const createCountry = async (countryBody) => {
  if (await Country.isCountryExists(countryBody.name, countryBody.code)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Country or Country code already exists!');
  }
  return Country.create(countryBody);
};

/**
 * Get country by id
 * @param {ObjectId} countryId
 * @returns {Promise<Country>}
 */
const getCountryById = async (countryId) => {
  return Country.findById(countryId);
};

/**
 * Update country by id
 * @param {ObjectId} countryId
 * @param {Object} updateBody
 * @returns {Promise<Country>}
 */
const updateCountryById = async (countryId, updateBody) => {
  const country = await getCountryById(countryId);
  if (!country) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Country not found');
  }
  if (updateBody.name && (await Country.isCountryExists(updateBody.name, updateBody.code, countryId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Country or Country code already exists!');
  }
  Object.assign(country, updateBody);
  await country.save();
  return country;
};

/**
 * @param {ObjectId}countryId
 * @returns {Promise<Country>}
 */
const deleteCountryById = async (countryId) => {
  const country = await getCountryById(countryId);
  if (!country) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Country not found!');
  }
  await country.remove();
  return country;
};

/**
 * @param {Object} countryBody - Object containing state IDs to delete
 * @param {Array} countryBody.countryIds - Array of state IDs to delete
 * @returns {Promise<Country>}
 */
const deleteManyCountryById = async (countryBody) => {
  const countries = countryBody.countryIds;
  const deletedCountries = [];
  const notFoundCountries = [];

  countries.forEach(async (countryId) => {
    try {
      const country = await getCountryById(countryId);
      if (!country) {
        notFoundCountries.push(countryId);
      } else {
        await country.remove();
        deletedCountries.push(country);
      }
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Error deleting country with ID ${countryId}: ${error.message}`);
    }
  });

  if (notFoundCountries.length > 0) {
    throw ApiError(httpStatus.NOT_FOUND, `Some countries not found: ${notFoundCountries.join(', ')}`);
  }

  return deletedCountries;
};

module.exports = {
  queryCountry,
  createCountry,
  getCountryById,
  updateCountryById,
  deleteCountryById,
  deleteManyCountryById,
};
