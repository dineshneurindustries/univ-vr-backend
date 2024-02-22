const httpStatus = require('http-status');
const { ObjectId } = require('mongoose').Types;
const { University } = require('../models');
const { State } = require('../models');
const { stateService } = require('.');
const ApiError = require('../utils/ApiError');

/**
 * Query for universities
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUniversity = async (filter, options) => {
  const paginatedUniversities = await University.paginate(filter, options);
  await University.populate(paginatedUniversities.results, { path: 'state' });
  return paginatedUniversities;
};

/**
 * Create a university
 * @param {Object} universityBody
 * @returns {Promise<University>}
 */
const createUniversity = async (universityBody) => {
  if (await University.isUniversityExists(universityBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'University already exists!');
  }
  return University.create(universityBody);
};

/**
 * Get university by id
 * @param {ObjectId} id
 * @returns {Promise<University>}
 */
const getUniversityById = async (id) => {
  return University.findById(id);
};

/**
 * Update university by id
 * @param {ObjectId} universityId
 * @param {Object} updateBody
 * @returns {Promise<University>}
 */
const updateUniversityById = async (universityId, updateBody) => {
  const university = await getUniversityById(universityId);
  if (!university) {
    throw new ApiError(httpStatus.NOT_FOUND, 'University not found');
  }
  if (updateBody.name && (await University.isUniversityExists(updateBody.name, universityId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'University already exists!');
  }
  Object.assign(university, updateBody);
  await university.save();
  return university;
};

/**
 * Delete university by id
 * @param {ObjectId} universityId
 * @returns {Promise<University>}
 */
const deleteUniversityById = async (universityId) => {
  const university = await getUniversityById(universityId);
  if (!university) {
    throw new ApiError(httpStatus.NOT_FOUND, 'University not found');
  }
  await university.remove();
  return university;
};

/**
 * Delete multiple universities by their IDs
 * @param {Object} universityBody - Object containing university IDs to delete
 * @param {Array} universityBody.universityIds - Array of university IDs to delete
 * @returns {Promise<Array<University>>} - Array of deleted universities
 */
const deleteManyUniversityById = async (universityBody) => {
  const universities = universityBody.universityIds;
  const deletedUniversities = [];
  const notFoundUniversities = [];

  await Promise.all(
    universities.map(async (universityId) => {
      try {
        const university = await getUniversityById(universityId);
        if (!university) {
          notFoundUniversities.push(universityId);
        } else {
          await university.remove();
          deletedUniversities.push(university);
        }
      } catch (error) {
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          `Error deleting university with ID ${universityId}: ${error.message}`
        );
      }
    })
  );

  if (notFoundUniversities.length > 0) {
    throw new ApiError(httpStatus.NOT_FOUND, `Some universities not found: ${notFoundUniversities.join(', ')}`);
  }

  return deletedUniversities;
};

/**
 * search state by state
 * @param {ObjectId} stateId
 * @returns {Promise<State>}
 */
const searchUniversitiesByState = async (stateId) => {
  const state = await stateService.getStateById(stateId);
  if (!state) {
    throw new ApiError(httpStatus.NOT_FOUND, 'State not found');
  }
  const universityByState = await State.aggregate([
    {
      $match: {
        _id: new ObjectId(stateId),
      },
    },
    {
      $lookup: {
        from: 'universities',
        localField: '_id',
        foreignField: 'state',
        as: 'universities',
      },
    },
  ]);
  return universityByState[0];
};

module.exports = {
  queryUniversity,
  createUniversity,
  getUniversityById,
  updateUniversityById,
  deleteUniversityById,
  deleteManyUniversityById,
  searchUniversitiesByState,
};
