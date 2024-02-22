const mongoose = require('mongoose');

const { Schema } = mongoose;
const { toJSON, paginate } = require('./plugins');

const universitySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  state: { type: Schema.Types.ObjectId, ref: 'State' },
});

universitySchema.plugin(toJSON);
universitySchema.plugin(paginate);
universitySchema.virtual('universityCount', {
  ref: 'State',
  localField: 'state',
  foreignField: '_id',
  count: true,
});

/**
 * Check if university already exist
 * @param {string} name - The university's name
 * @returns {Promise<boolean>}
 */
universitySchema.statics.isUniversityExists = async function (universityName) {
  const university = await this.findOne({ name: universityName });
  return !!university;
};
/**
 * @typedef University
 */
const University = mongoose.model('University', universitySchema);

module.exports = University;
