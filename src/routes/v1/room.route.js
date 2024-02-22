const express = require('express');

const roomController = require('../../controllers/room.controller');
const validate = require('../../middlewares/validate');
const roomValidation = require('../../validations/room.validation');
const { uploadFiles } = require('../../utils/multer');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: Room management
 */

/**
 * @swagger
 * /room:
 *   post:
 *     summary: Create rooms with an image
 *     description: Create a room with its respective image.
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               building:
 *                 type: string
 *               image:
 *                 type: file
 *                 description: Image file for the room
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

router.post('/', uploadFiles, validate(roomValidation.createRoom), roomController.createRoom);

/**
 * @swagger
 * /room:
 *   get:
 *     summary: Get all rooms
 *     description: Retrieve a list of rooms.
 *     tags: [Rooms]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Rooms name
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by query in the form of field:(desc|asc) (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Maximum number of room
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Room'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 */

router.route('/').get(validate(roomValidation.getRooms), roomController.getRooms);
router.route('/deletemany').delete(validate(roomValidation.deleteManyRooms), roomController.deleteManyRooms);

/**
 * @swagger
 * /room/{buildingId}/building:
 *   get:
 *     summary: Retrieve rooms by building ID
 *     description: Search rooms by building ID.
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: buildingId
 *         required: true
 *         schema:
 *           type: string
 *         description: building ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

router
  .route('/:buildingId/building')
  .get(validate(roomValidation.searchRoomsByBuilding), roomController.searchRoomsByBuilding);

/**
 * @swagger
 * /room/{roomId}:
 *   get:
 *     summary: Get a room
 *     description: Retrieve a single room by ID.
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: Building ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router.route('/:roomId').get(validate(roomValidation.getRoom), roomController.getRoom);

/**
 * @swagger
 * /room/{roomId}:
 *   patch:
 *     summary: Update a room
 *     description: Update a room by ID.
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               description:
 *                 type: string
 *               building:
 *                 type: string
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

router.route('/:roomId').patch(uploadFiles, validate(roomValidation.updateRoom), roomController.updateRoom);

/**
 * @swagger
 * /room/{roomId}:
 *   delete:
 *     summary: Delete a room
 *     description: Delete a room by ID.
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

router.route('/:roomId').delete(validate(roomValidation.deleteRoom), roomController.deleteRoom);

/**
 * @swagger
 * /room/deletemany:
 *   delete:
 *     summary: Delete multiple rooms
 *     description: Delete multiple rooms by their IDs.
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomIds:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               roomIds: ["65d338bcb44ca14c8ccd5253", "65d3395d9542ca0b54136d6b"]
 *     responses:
 *       "204":
 *         description: No content
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

module.exports = router;
