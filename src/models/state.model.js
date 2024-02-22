const mongoose = require('mongoose');

const { Schema } = mongoose;
const { toJSON, paginate } = require('./plugins');

const stateSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  state_code: {
    type: String,
    required: true,
    trim: true,
  },
  country: { type: Schema.Types.ObjectId, ref: 'Country' },
});

stateSchema.plugin(toJSON);
stateSchema.plugin(paginate);
stateSchema.virtual('stateCount', {
  ref: 'Country',
  localField: 'country',
  foreignField: '_id',
  count: true,
});

/**
 * Check if state already exist
 * @param {string} stateName - The state's name
 * @param {string} stateCode - The state's name
 * @returns {Promise<boolean>}
 */
stateSchema.statics.isStateExists = async function (stateName, stateCode) {
  const state = await this.findOne({ $or: [{ name: stateName }, { state_code: stateCode }] });
  return !!state;
};

/**
 * @typedef State
 */
const State = mongoose.model('State', stateSchema);

module.exports = State;
