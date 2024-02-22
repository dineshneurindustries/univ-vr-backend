const mongoose = require('mongoose');

const { Schema } = mongoose;
const { toJSON, paginate } = require('./plugins');

const collegeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  university: { type: Schema.Types.ObjectId, ref: 'University' },
});

collegeSchema.plugin(toJSON);
collegeSchema.plugin(paginate);
collegeSchema.virtual('collegeCount', {
  ref: 'University',
  localField: 'university',
  foreignField: '_id',
  count: true,
});

/**
 * Check if college already exist
 * @param {string} name - The college's name
 * @returns {Promise<boolean>}
 */
collegeSchema.statics.isCollegeExists = async function (collegeName) {
  const college = await this.findOne({ name: collegeName });
  return !!college;
};
/**
 * @typedef College
 */
const College = mongoose.model('College', collegeSchema);

module.exports = College;
