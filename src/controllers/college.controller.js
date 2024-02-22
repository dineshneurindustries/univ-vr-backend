const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { collegeService } = require('../services');

const createCollege = catchAsync(async (req, res) => {
  const college = await collegeService.createCollege(req.body);
  res.status(httpStatus.CREATED).send(college);
});

const getColleges = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await collegeService.queryCollege(filter, options);
  res.send(result);
});

const getCollege = catchAsync(async (req, res) => {
  const college = await collegeService.getCollegeById(req.params.collegeId);
  if (!college) {
    throw new ApiError(httpStatus.NOT_FOUND, 'College not found');
  }
  res.send(college);
});

const updateCollege = catchAsync(async (req, res) => {
  const college = await collegeService.updateCollegeById(req.params.collegeId, req.body);
  res.send(college);
});

const deleteCollege = catchAsync(async (req, res) => {
  await collegeService.deleteCollegeById(req.params.collegeId);
  res.status(httpStatus.NO_CONTENT).send();
});

const deleteManyColleges = catchAsync(async (req, res) => {
  await collegeService.deleteManyCollegeById(req.body);
  res.status(httpStatus.NO_CONTENT).send();
});

const searchCollegeByUniversity = catchAsync(async (req, res) => {
  const university = await collegeService.searchCollegesByUniversity(req.params.universityId);
  res.send({ university });
});

module.exports = {
  createCollege,
  getColleges,
  getCollege,
  updateCollege,
  deleteCollege,
  deleteManyColleges,
  searchCollegeByUniversity,
};
