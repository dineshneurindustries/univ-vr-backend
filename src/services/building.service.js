const httpStatus = require('http-status');
const { ObjectId } = require('mongoose').Types;
const { Building, College } = require('../models');
const ApiError = require('../utils/ApiError');
const { collegeService } = require('.');
/**
 * Query for buildings
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryBuilding = async (filter, options) => {
  const paginatedBuildings = await Building.paginate(filter, options);
  await Building.populate(paginatedBuildings.results, { path: 'college' });
  return paginatedBuildings;
};

/**
 * Create a building
 * @param {Object} buildingBody
 * @returns {Promise<Building>}
 */
const createBuilding = async (buildingBody) => {
  const { name, college } = buildingBody;
  const createdBuildings = await Promise.all(
    name.map(async (buildingName) => {
      return Building.create({ name: buildingName, college });
    })
  );

  return createdBuildings;
};

/**
 * Get building by id
 * @param {ObjectId} id
 * @returns {Promise<Building>}
 */
const getBuildingById = async (id) => {
  return Building.findById(id);
};

/**
 * Update building by id
 * @param {ObjectId} buildingId
 * @param {Object} updateBody
 * @returns {Promise<Building>}
 */
const updateBuildingById = async (buildingId, updateBody) => {
  const building = await getBuildingById(buildingId);
  if (!building) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Building not found');
  }
  // if (updateBody.name && (await Building.isBuildingExists(updateBody.name, buildingId))) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Building already exists!');
  // }
  Object.assign(building, updateBody);
  await building.save();
  return building;
};

/**
 * Delete building by id
 * @param {ObjectId} buildingId
 * @returns {Promise<Building>}
 */
const deleteBuildingById = async (buildingId) => {
  const building = await getBuildingById(buildingId);
  if (!building) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Building not found');
  }
  await building.remove();
  return building;
};

/**
 * Delete multiple buildings by their IDs
 * @param {Object} buildingBody - Object containing building IDs to delete
 * @param {Array} buildingBody.buildingIds - Array of building IDs to delete
 * @returns {Promise<Array<Building>>} - Array of deleted buildings
 */
const deleteManyBuildingById = async (buildingBody) => {
  const buildings = buildingBody.buildingIds;
  const deletedBuildings = [];
  const notFoundBuildings = [];

  await Promise.all(
    buildings.map(async (buildingId) => {
      try {
        const building = await getBuildingById(buildingId);
        if (!building) {
          notFoundBuildings.push(buildingId);
        } else {
          await building.remove();
          deletedBuildings.push(building);
        }
      } catch (error) {
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          `Error deleting building with ID ${buildingId}: ${error.message}`
        );
      }
    })
  );

  if (notFoundBuildings.length > 0) {
    throw new ApiError(httpStatus.NOT_FOUND, `Some buildings not found: ${notFoundBuildings.join(', ')}`);
  }

  return deletedBuildings;
};

/**
 * search state by state
 * @param {ObjectId} universityId
 * @returns {Promise<State>}
 */
const searchBuildingsByCollege = async (collegeId) => {
  const state = await collegeService.getCollegeById(collegeId);
  if (!state) {
    throw new ApiError(httpStatus.NOT_FOUND, 'College not found');
  }
  const collegeByUniversity = await College.aggregate([
    {
      $match: {
        _id: new ObjectId(collegeId),
      },
    },
    {
      $lookup: {
        from: 'buildings',
        localField: '_id',
        foreignField: 'college',
        as: 'buildings',
      },
    },
  ]);
  return collegeByUniversity[0];
};

module.exports = {
  queryBuilding,
  createBuilding,
  getBuildingById,
  updateBuildingById,
  deleteBuildingById,
  deleteManyBuildingById,
  searchBuildingsByCollege,
};
