const express = require('express');
const validate = require('../../middlewares/validate');
const stateValidation = require('../../validations/state.validation');
const stateController = require('../../controllers/state.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: States
 *   description: State management and retrieval
 */

/**
 * @swagger
 * /state:
 *   post:
 *     summary: Create a state
 *     description: Create a new state.
 *     security:
 *       - bearerAuth: []
 *     tags: [States]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               state_code:
 *                 type: string
 *               country:
 *                 type: string
 *             example:
 *               name: State name
 *               state_code: SN
 *               country: 65d3519b82497226d802d2e3
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/State'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

router.route('/').post(validate(stateValidation.createState), stateController.createState);

/**
 * @swagger
 * /state/{countryId}/country:
 *   get:
 *     summary: Retrieve states by country ID
 *     description: Search a country by ID.
 *     tags: [States]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: countryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Country ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 code:
 *                   type: string
 *                 __v:
 *                   type: number
 *                 states:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       state_code:
 *                         type: string
 *                       country:
 *                         type: string
 *                       __v:
 *                         type: number
 *             example:
 *               - _id: "65d3519b82497226d802d2e3"
 *                 name: "India"
 *                 code: "IN"
 *                 __v: 0
 *                 states:
 *                   - _id: "65d469e7fae9ac2d241c2f1e"
 *                     name: "State name"
 *                     state_code: "SN"
 *                     country: "65d3519b82497226d802d2e3"
 *                     __v: 0
 */
router
  .route('/:countryId/country')
  .get(validate(stateValidation.searchStateByCountry), stateController.searchStateByCountry);

/**
 * @swagger
 * /state:
 *   get:
 *     summary: Get all states
 *     description: Retrieve a list of states.
 *     security:
 *       - bearerAuth: []
 *     tags: [States]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: State name
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
 *         description: Maximum number of states
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
 *                     $ref: '#/components/schemas/State'
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
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router.route('/').get(validate(stateValidation.getStates), stateController.getStates);
router.route('/deletemany').delete(validate(stateValidation.deleteManyStates), stateController.deleteManyStates);

/**
 * @swagger
 * /state/{stateId}:
 *   get:
 *     summary: Get a state
 *     description: Retrieve a single state by ID.
 *     security:
 *       - bearerAuth: []
 *     tags: [States]
 *     parameters:
 *       - in: path
 *         name: stateId
 *         required: true
 *         schema:
 *           type: string
 *         description: State ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/State'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router.route('/:stateId').get(validate(stateValidation.getState), stateController.getState);

/**
 * @swagger
 * /state/{stateId}:
 *   patch:
 *     summary: Update a state
 *     description: Update a state by ID.
 *     security:
 *       - bearerAuth: []
 *     tags: [States]
 *     parameters:
 *       - in: path
 *         name: stateId
 *         required: true
 *         schema:
 *           type: string
 *         description: State ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               state_code:
 *                 type: string
 *               country:
 *                 type: string
 *             example:
 *               name: State name
 *               state_code: SN
 *               country: 65d3519b82497226d802d2e3
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/State'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router.route('/:stateId').patch(validate(stateValidation.updateState), stateController.updateState);

/**
 * @swagger
 * /state/{stateId}:
 *   delete:
 *     summary: Delete a state
 *     description: Delete a state by ID.
 *     tags: [States]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: stateId
 *         required: true
 *         schema:
 *           type: string
 *         description: State ID
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router.route('/:stateId').delete(validate(stateValidation.deleteState), stateController.deleteState);

/**
 * @swagger
 * /state/deletemany:
 *   delete:
 *     summary: Delete multiple states
 *     description: Delete multiple states by their IDs.
 *     tags: [States]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stateIds:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               stateIds: ["65d338bcb44ca14c8ccd5253", "65d3395d9542ca0b54136d6b"]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/State'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

module.exports = router;
