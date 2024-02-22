const express = require('express');
const validate = require('../../middlewares/validate');
const universityValidation = require('../../validations/university.validation');
const universityController = require('../../controllers/university.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Universities
 *   description: University management and retrieval
 */

/**
 * @swagger
 * /university:
 *   post:
 *     summary: Create a university
 *     description: Create a new university.
 *     security:
 *       - bearerAuth: []
 *     tags: [Universities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - state
 *             properties:
 *               name:
 *                 type: string
 *               state:
 *                 type: string
 *             example:
 *               name: Stanford University
 *               state: 5ebac534954b54139806c112
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/University'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

router.route('/').post(validate(universityValidation.createUniversity), universityController.createUniversity);

/**
 * @swagger
 * /university:
 *   get:
 *     summary: Get all universities
 *     description: Retrieve a list of universities.
 *     security:
 *       - bearerAuth: []
 *     tags: [Universities]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: University name
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
 *         description: Maximum number of universities
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
 *                     $ref: '#/components/schemas/University'
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

router.route('/').get(validate(universityValidation.getUniversities), universityController.getUniversities);
router
  .route('/deletemany')
  .delete(validate(universityValidation.deleteManyUniversities), universityController.deleteManyUniversities);

/**
 * @swagger
 * /university/{stateId}/state:
 *   get:
 *     summary: Retrieve universities by state ID
 *     description: Search a state by ID.
 *     tags: [Universities]
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
  .route('/:stateId/state')
  .get(validate(universityValidation.searchUniversitiesByState), universityController.searchUniversityByState);

/**
 * @swagger
 * /university/{universityId}:
 *   get:
 *     summary: Get a university
 *     description: Retrieve a single university by ID.
 *     security:
 *       - bearerAuth: []
 *     tags: [Universities]
 *     parameters:
 *       - in: path
 *         name: universityId
 *         required: true
 *         schema:
 *           type: string
 *         description: University ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/University'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router.route('/:universityId').get(validate(universityValidation.getUniversity), universityController.getUniversity);

/**
 * @swagger
 * /university/{universityId}:
 *   patch:
 *     summary: Update a university
 *     description: Update a university by ID.
 *     security:
 *       - bearerAuth: []
 *     tags: [Universities]
 *     parameters:
 *       - in: path
 *         name: universityId
 *         required: true
 *         schema:
 *           type: string
 *         description: University ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - state
 *             properties:
 *               name:
 *                 type: string
 *               state:
 *                 type: string
 *             example:
 *               name: Updated University Name
 *               state: 5ebac534954b54139806c112
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/University'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router.route('/:universityId').patch(validate(universityValidation.updateUniversity), universityController.updateUniversity);

/**
 * @swagger
 * /university/{universityId}:
 *   delete:
 *     summary: Delete a university
 *     description: Delete a university by ID.
 *     tags: [Universities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: universityId
 *         required: true
 *         schema:
 *           type: string
 *         description: University ID
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router
  .route('/:universityId')
  .delete(validate(universityValidation.deleteUniversity), universityController.deleteUniversity);

/**
 * @swagger
 * /university/deletemany:
 *   delete:
 *     summary: Delete multiple universities
 *     description: Delete multiple universities by their IDs.
 *     tags: [Universities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               universityIds:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               universityIds: ["65d338bcb44ca14c8ccd5253", "65d3395d9542ca0b54136d6b"]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/University'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

module.exports = router;
