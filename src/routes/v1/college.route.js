const express = require('express');
const validate = require('../../middlewares/validate');
const collegeValidation = require('../../validations/college.validation');
const collegeController = require('../../controllers/college.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Colleges
 *   description: College management and retrieval
 */

/**
 * @swagger
 * /college:
 *   post:
 *     summary: Create a college
 *     description: Create a new college.
 *     tags: [Colleges]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - university
 *             properties:
 *               name:
 *                 type: string
 *               university:
 *                 type: string
 *             example:
 *               name: ABC College
 *               university: 65d338bcb44ca14c8ccd5253
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/College'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "409":
 *         $ref: '#/components/responses/DuplicateName'
 */

router.route('/').post(validate(collegeValidation.createCollege), collegeController.createCollege);

/**
 * @swagger
 * /college:
 *   get:
 *     summary: Get all colleges
 *     description: Retrieve a list of colleges.
 *     tags: [Colleges]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: College name
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
 *         description: Maximum number of college
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
 *                 $ref: '#/components/schemas/College'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 */

router.route('/').get(validate(collegeValidation.getColleges), collegeController.getColleges);
router.route('/deletemany').delete(validate(collegeValidation.deleteManyColleges), collegeController.deleteManyColleges);

/**
 * @swagger
 * /college/{universityId}/university:
 *   get:
 *     summary: Retrieve colleges by university ID
 *     description: Search colleges by university ID.
 *     tags: [Colleges]
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
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/College'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

router
  .route('/:universityId/university')
  .get(validate(collegeValidation.searchCollegeByUniversity), collegeController.searchCollegeByUniversity);

/**
 * @swagger
 * /college/{collegeId}:
 *   get:
 *     summary: Get a college
 *     description: Retrieve a single college by ID.
 *     tags: [Colleges]
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
 *               $ref: '#/components/schemas/College'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

router.route('/:collegeId').get(validate(collegeValidation.getCollege), collegeController.getCollege);

/**
 * @swagger
 * /college/{collegeId}:
 *   patch:
 *     summary: Update a college
 *     description: Update a college by ID.
 *     tags: [Colleges]
 *     parameters:
 *       - in: path
 *         name: collegeId
 *         required: true
 *         schema:
 *           type: string
 *         description: College ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               university:
 *                 type: string
 *             example:
 *                 name: abc college
 *                 university: 65d48fdefd295f1e5872874e
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/College'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

router.route('/:collegeId').patch(validate(collegeValidation.updateCollege), collegeController.updateCollege);

/**
 * @swagger
 * /college/{collegeId}:
 *   delete:
 *     summary: Delete a college
 *     description: Delete a college by ID.
 *     tags: [Colleges]
 *     parameters:
 *       - in: path
 *         name: collegeId
 *         required: true
 *         schema:
 *           type: string
 *         description: College ID
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

router.route('/:collegeId').delete(validate(collegeValidation.deleteCollege), collegeController.deleteCollege);

/**
 * @swagger
 * /college/deletemany:
 *   delete:
 *     summary: Delete multiple colleges
 *     description: Delete multiple colleges by their IDs.
 *     tags: [Colleges]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               collegeIds:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               collegeIds: ["65d338bcb44ca14c8ccd5253", "65d3395d9542ca0b54136d6b"]
 *     responses:
 *       "204":
 *         description: No content
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

module.exports = router;
