const httpStatus = require('http-status');
const { ObjectId } = require('mongoose').Types;
const { Room, Building } = require('../models');
const ApiError = require('../utils/ApiError');
const { buildingService } = require('.');
const { uploadToS3, deleteFromS3 } = require('../utils/multer');

/**
 * Query for rooms
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}s
 */
const queryRoom = async (filter, options) => {
  const paginatedRooms = await Room.paginate(filter, options);
  await Room.populate(paginatedRooms.results, { path: 'building' });
  return paginatedRooms;
};

/**
 * Create a room
 * @param {Object} roomBody
 * @returns {Promise<Room>}
 */
/**
 * Create a room
 * @returns {Promise<Room>}
 */
const createRoom = async (req) => {
  try {
    const { name, description, building } = req.body;
    const image = req.file;

    const imageUrl = await uploadToS3(image, 'rooms');

    const room = new Room({
      name,
      image: imageUrl,
      description,
      building,
    });
    const createdRoom = await room.save();

    return createdRoom;
  } catch (error) {
    throw new Error(`Error in createRoom: ${error.message}`);
  }
};

/**
 * Get room by id
 * @param {ObjectId} id
 * @returns {Promise<Room>}
 */
const getRoomById = async (id) => {
  return Room.findById(id);
};

/**
 * Update room by id
 * @param {ObjectId} roomId
 * @param {Object} updateBody
 * @returns {Promise<Room>}
 */
const updateRoomById = async (roomId, updateBody) => {
  const room = await getRoomById(roomId);
  if (!room) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Room not found');
  }

  // Handle image update separately
  if (updateBody.file && updateBody.file.fieldname === 'image') {
    const imageUrl = await uploadToS3(updateBody.file, 'rooms');
    if (room.image) {
      await deleteFromS3(room.image);
    }
    room.image = imageUrl;
  }

  if (updateBody.body.name) {
    room.name = updateBody.body.name;
  }
  if (updateBody.body.description) {
    room.description = updateBody.body.description;
  }
  if (updateBody.body.building) {
    room.building = updateBody.body.building;
  }

  await room.save();

  return room;
};

/**
 * Delete room by id
 * @param {ObjectId} roomId
 * @returns {Promise<Room>}
 */
const deleteRoomById = async (roomId) => {
  const room = await getRoomById(roomId);
  if (!room) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Room not found');
  }
  await deleteFromS3(room.image);
  await room.remove();
  return room;
};

/**
 * Delete multiple rooms by their IDs
 * @param {Object} roomBody - Object containing room IDs to delete
 * @param {Array} roomBody.roomIds - Array of room IDs to delete
 * @returns {Promise<Array<Room>>} - Array of deleted rooms
 */
const deleteManyRoomById = async (roomBody) => {
  const rooms = roomBody.roomIds;
  const deletedRooms = [];
  const notFoundRooms = [];

  await Promise.all(
    rooms.map(async (roomId) => {
      try {
        const room = await getRoomById(roomId);
        if (!room) {
          notFoundRooms.push(roomId);
        } else {
          await deleteFromS3(room.image);
          await room.remove();
          deletedRooms.push(room);
        }
      } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Error deleting room with ID ${roomId}: ${error.message}`);
      }
    })
  );

  if (notFoundRooms.length > 0) {
    throw new ApiError(httpStatus.NOT_FOUND, `Some rooms not found: ${notFoundRooms.join(', ')}`);
  }

  return deletedRooms;
};

/**
 * search rooms by building
 * @param {ObjectId} buildingId
 * @returns {Promise<State>}
 */
const searchRoomsByBuilding = async (buildingId) => {
  const building = await buildingService.getBuildingById(buildingId);
  if (!building) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Building not found');
  }
  const roomsByBuilding = await Building.aggregate([
    {
      $match: {
        _id: new ObjectId(buildingId),
      },
    },
    {
      $lookup: {
        from: 'rooms',
        localField: '_id',
        foreignField: 'building',
        as: 'rooms',
      },
    },
  ]);
  return roomsByBuilding[0];
};

module.exports = {
  queryRoom,
  createRoom,
  getRoomById,
  updateRoomById,
  deleteRoomById,
  deleteManyRoomById,
  searchRoomsByBuilding,
};
