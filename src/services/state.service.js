const httpStatus = require('http-status');
const { ObjectId } = require('mongoose').Types;
const { State } = require('../models');
const { Country } = require('../models');
const { countryService } = require('.');
const ApiError = require('../utils/ApiError');

/**
 * Query for states
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryState = async (filter, options) => {
  const paginatedStates = await State.paginate(filter, options);
  await State.populate(paginatedStates.results, { path: 'country' });
  return paginatedStates;
};

/**
 * Create a state
 * @param {Object} stateBody
 * @returns {Promise<State>}
 */
const createState = async (stateBody) => {
  if (await State.isStateExists(stateBody.name, stateBody.state_code)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'State or State code already exists!');
  }
  return State.create(stateBody);
};

/**
 * Get state by id
 * @param {ObjectId} id
 * @returns {Promise<State>}
 */
const getStateById = async (id) => {
  return State.findById(id);
};

/**
 * Update state by id
 * @param {ObjectId} stateId
 * @param {Object} updateBody
 * @returns {Promise<State>}
 */
const updateStateById = async (stateId, updateBody) => {
  const state = await getStateById(stateId);
  if (!state) {
    throw new ApiError(httpStatus.NOT_FOUND, 'State not found');
  }
  if (updateBody.name && (await State.isStateExists(updateBody.name, updateBody.state_code, stateId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'State or State code already exists!');
  }
  Object.assign(state, updateBody);
  await state.save();
  return state;
};

/**
 * Delete state by id
 * @param {ObjectId} stateId
 * @returns {Promise<State>}
 */
const deleteStateById = async (stateId) => {
  const state = await getStateById(stateId);
  if (!state) {
    throw new ApiError(httpStatus.NOT_FOUND, 'State not found');
  }
  await state.remove();
  return state;
};

/**
 * Delete multiple states by their IDs
 * @param {Object} stateBody - Object containing state IDs to delete
 * @param {Array} stateBody.stateIds - Array of state IDs to delete
 * @returns {Promise<Array<State>>} - Array of deleted states
 */
const deleteManyStateById = async (stateBody) => {
  const states = stateBody.stateIds;
  const deletedStates = [];
  const notFoundStates = [];

  await Promise.all(
    states.map(async (stateId) => {
      try {
        const state = await getStateById(stateId);
        if (!state) {
          notFoundStates.push(stateId);
        } else {
          await state.remove();
          deletedStates.push(state);
        }
      } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Error deleting state with ID ${stateId}: ${error.message}`);
      }
    })
  );

  if (notFoundStates.length > 0) {
    throw new ApiError(httpStatus.NOT_FOUND, `Some states not found: ${notFoundStates.join(', ')}`);
  }

  return deletedStates;
};

/**
 * search state by country
 * @param {ObjectId} countryId
 * @returns {Promise<Country>}
 */
const searchStatesByCountry = async (countryId) => {
  const country = await countryService.getCountryById(countryId);

  if (!country) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Country not found');
  }
  const countryByState = await Country.aggregate([
    {
      $match: {
        _id: new ObjectId(countryId),
      },
    },
    {
      $lookup: {
        from: 'states',
        localField: '_id',
        foreignField: 'country',
        as: 'states',
      },
    },
  ]);
  return countryByState[0];
};

module.exports = {
  queryState,
  createState,
  getStateById,
  updateStateById,
  deleteStateById,
  deleteManyStateById,
  searchStatesByCountry,
};
