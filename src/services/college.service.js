const httpStatus = require('http-status');
const { ObjectId } = require('mongoose').Types;
const { College, University } = require('../models');
const ApiError = require('../utils/ApiError');
const { universityService } = require('.');

/**
 * Query for colleges
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCollege = async (filter, options) => {
  const paginatedColleges = await College.paginate(filter, options);
  await College.populate(paginatedColleges.results, { path: 'university' });
  return paginatedColleges;
};

/**
 * Create a college
 * @param {Object} collegeBody
 * @returns {Promise<College>}
 */
const createCollege = async (collegeBody) => {
  if (await College.isCollegeExists(collegeBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'College already exists!');
  }
  return College.create(collegeBody);
};

/**
 * Get college by id
 * @param {ObjectId} id
 * @returns {Promise<College>}
 */
const getCollegeById = async (id) => {
  return College.findById(id);
};

/**
 * Update college by id
 * @param {ObjectId} collegeId
 * @param {Object} updateBody
 * @returns {Promise<College>}
 */
const updateCollegeById = async (collegeId, updateBody) => {
  const college = await getCollegeById(collegeId);
  if (!college) {
    throw new ApiError(httpStatus.NOT_FOUND, 'College not found');
  }
  if (updateBody.name && (await College.isCollegeExists(updateBody.name, collegeId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'College already exists!');
  }
  Object.assign(college, updateBody);
  await college.save();
  return college;
};

/**
 * Delete college by id
 * @param {ObjectId} collegeId
 * @returns {Promise<College>}
 */
const deleteCollegeById = async (collegeId) => {
  const college = await getCollegeById(collegeId);
  if (!college) {
    throw new ApiError(httpStatus.NOT_FOUND, 'College not found');
  }
  await college.remove();
  return college;
};

/**
 * Delete multiple colleges by their IDs
 * @param {Object} collegeBody - Object containing college IDs to delete
 * @param {Array} collegeBody.collegeIds - Array of college IDs to delete
 * @returns {Promise<Array<College>>} - Array of deleted colleges
 */
const deleteManyCollegeById = async (collegeBody) => {
  const colleges = collegeBody.collegeIds;
  const deletedColleges = [];
  const notFoundColleges = [];

  await Promise.all(
    colleges.map(async (collegeId) => {
      try {
        const college = await getCollegeById(collegeId);
        if (!college) {
          notFoundColleges.push(collegeId);
        } else {
          await college.remove();
          deletedColleges.push(college);
        }
      } catch (error) {
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          `Error deleting college with ID ${collegeId}: ${error.message}`
        );
      }
    })
  );

  if (notFoundColleges.length > 0) {
    throw new ApiError(httpStatus.NOT_FOUND, `Some colleges not found: ${notFoundColleges.join(', ')}`);
  }

  return deletedColleges;
};

/**
 * search state by state
 * @param {ObjectId} universityId
 * @returns {Promise<State>}
 */
const searchCollegesByUniversity = async (universityId) => {
  const state = await universityService.getUniversityById(universityId);
  if (!state) {
    throw new ApiError(httpStatus.NOT_FOUND, 'University not found');
  }
  const collegeByUniversity = await University.aggregate([
    {
      $match: {
        _id: new ObjectId(universityId),
      },
    },
    {
      $lookup: {
        from: 'colleges',
        localField: '_id',
        foreignField: 'university',
        as: 'colleges',
      },
    },
  ]);
  return collegeByUniversity[0];
};

module.exports = {
  queryCollege,
  createCollege,
  getCollegeById,
  updateCollegeById,
  deleteCollegeById,
  deleteManyCollegeById,
  searchCollegesByUniversity,
};
