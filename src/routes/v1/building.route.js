const express = require('express');
const validate = require('../../middlewares/validate');
const buildingValidation = require('../../validations/building.validation');
const buildingController = require('../../controllers/building.controller');

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Building
 *   description: Building management and retrieval
 */

/**
 * @swagger
 * /building:
 *   post:
 *     summary: Create a building
 *     description: Create a new building.
 *     tags: [Building]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - college
 *             properties:
 *               name:
 *                 type: array
 *               college:
 *                 type: string
 *             example:
 *               name: ["ABC building", "DEF building"]
 *               college: 65d338bcb44ca14c8ccd5253
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Building'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "409":
 *         $ref: '#/components/responses/DuplicateName'
 */
router.route('/').post(validate(buildingValidation.createBuilding), buildingController.createBuilding);

/**
 * @swagger
 * /building:
 *   get:
 *     summary: Get all buildings
 *     description: Retrieve a list of buildings.
 *     tags: [Building]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Building name
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
 *         description: Maximum number of building
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
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Building'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 */

router.route('/').get(validate(buildingValidation.getBuildings), buildingController.getBuildings);
router.route('/deletemany').delete(validate(buildingValidation.deleteManyBuildings), buildingController.deleteManyBuildings);

/**
 * @swagger
 * /building/{collegeId}/college:
 *   get:
 *     summary: Retrieve buildings by college ID
 *     description: Search buildings by college ID.
 *     tags: [Building]
 *     parameters:
 *       - in: path
 *         name: collegeId
 *         required: true
 *         schema:
 *           type: string
 *         description: College ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Building'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

router
  .route('/:collegeId/college')
  .get(validate(buildingValidation.searchBuildingByCollege), buildingController.searchBuildingByCollege);

/**
 * @swagger
 * /building/{buildingId}:
 *   get:
 *     summary: Get a building
 *     description: Retrieve a single building by ID.
 *     tags: [Building]
 *     parameters:
 *       - in: path
 *         name: buildingId
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
 *               $ref: '#/components/schemas/Building'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router.route('/:buildingId').get(validate(buildingValidation.getBuilding), buildingController.getBuilding);

/**
 * @swagger
 * /building/{buildingId}:
 *   patch:
 *     summary: Update a building
 *     description: Update a building by ID.
 *     tags: [Building]
 *     parameters:
 *       - in: path
 *         name: buildingId
 *         required: true
 *         schema:
 *           type: string
 *         description: Building ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               college:
 *                 type: string
 *             example:
 *                 name: abc building
 *                 college: 65d48fdefd295f1e5872874e
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Building'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

router.route('/:buildingId').patch(validate(buildingValidation.updateBuilding), buildingController.updateBuilding);

/**
 * @swagger
 * /building/{buildingId}:
 *   delete:
 *     summary: Delete a building
 *     description: Delete a building by ID.
 *     tags: [Building]
 *     parameters:
 *       - in: path
 *         name: buildingId
 *         required: true
 *         schema:
 *           type: string
 *         description: Building ID
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

router.route('/:buildingId').delete(validate(buildingValidation.deleteBuilding), buildingController.deleteBuilding);

/**
 * @swagger
 * /building/deletemany:
 *   delete:
 *     summary: Delete multiple buildings
 *     description: Delete multiple buildings by their IDs.
 *     tags: [Building]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               buildingIds:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               buildingIds: ["65d338bcb44ca14c8ccd5253", "65d3395d9542ca0b54136d6b"]
 *     responses:
 *       "204":
 *         description: No content
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

module.exports = router;
