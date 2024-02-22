const express = require('express');
// const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const countryValidation = require('../../validations/country.validation');
const countryController = require('../../controllers/country.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(countryValidation.createCountry), countryController.createCountry)
  .get(validate(countryValidation.getCountries), countryController.getCountries);

router.route('/deletemany').delete(validate(countryValidation.deleteManyCountries), countryController.deleteManyCountries);

router
  .route('/:countryId')
  .patch(validate(countryValidation.updateCountry), countryController.updateCountry)
  .get(validate(countryValidation.getCountry), countryController.getCountry)
  .delete(validate(countryValidation.deleteCountry), countryController.deleteCountry);

// ######### permission route #########
//
//   router
//   .route('/')
//   .post(auth('manageCountries'), validate(countryValidation.createCountry), countryController.createCountry)
//   .get(auth('getCountries'), validate(countryValidation.getCountries), countryController.getCountries);

// router
//   .route('/:countryId')
//   .get(auth('getCountries'), validate(countryValidation.getCountry), countryController.getCountry)
//   .patch(auth('manageCountries'), validate(countryValidation.updateCountry), countryController.updateCountry)
//   .delete(auth('manageCountries'), validate(countryValidation.deleteCountry), countryController.deleteCountry);

// router
//   .route('/deletemany')
//   .delete(auth('manageCountries'), validate(countryValidation.deleteManyCountries), countryController.deleteManyCountries);
//
// ######### END #########

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Countries
 *   description: Country management and retrieval
 */

/**
 * @swagger
 * /country:
 *   post:
 *     summary: Create a country
 *     description: Only admins can create countries.
 *     tags: [Countries]
 *     security:
 *       - bearerAuth: []
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
 *               code:
 *                 type: string
 *             example:
 *               name: Country Name
 *               code: CN
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Country'
 *       "400":
 *         $ref: '#/components/responses/DuplicateName'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all countries
 *     description: Only admins can retrieve all countries.
 *     tags: [Countries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Country name
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
 *         description: Maximum number of countries
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
 *                     $ref: '#/components/schemas/Country'
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
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 * /country/{countryId}:
 *   get:
 *     summary: Get a country
 *     description: Get a country by its ID.
 *     tags: [Countries]
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
 *                $ref: '#/components/schemas/Country'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a country
 *     description: Update a country by its ID.
 *     tags: [Countries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: countryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Country ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             example:
 *               name: New Country Name
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Country'
 *       "400":
 *         $ref: '#/components/responses/DuplicateName'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a country
 *     description: Delete a country by its ID.
 *     tags: [Countries]
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
 *       "204":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 * /country/deletemany:
 *   delete:
 *     summary: Delete multiple countries
 *     description: Delete multiple countries by their IDs.
 *     tags: [Countries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               countryIds:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               countryIds: ["65d338bcb44ca14c8ccd5253", "65d3395d9542ca0b54136d6b"]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Country'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
