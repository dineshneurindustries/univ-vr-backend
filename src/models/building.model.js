const mongoose = require('mongoose');

const { Schema } = mongoose;
const { toJSON, paginate } = require('./plugins');

const buildingSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  college: { type: Schema.Types.ObjectId, ref: 'College' },
});

buildingSchema.plugin(toJSON);
buildingSchema.plugin(paginate);
buildingSchema.virtual('buildingCount', {
  ref: 'College',
  localField: 'college',
  foreignField: '_id',
  count: true,
});

/**
 * Check if building already exist
 * @param {string} name - The building's name
 * @returns {Promise<boolean>}
 */
buildingSchema.statics.isBuildingExists = async function (buildingeName) {
  const building = await this.findOne({ name: buildingeName });
  return !!building;
};

/**
 * @typedef Building
 */
const Building = mongoose.model('Building', buildingSchema);

module.exports = Building;
