const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const countrySchema = mongoose.Schema({
  code: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
});

countrySchema.plugin(toJSON);
countrySchema.plugin(paginate);

/**
 * Check if country already exist
 * @param {string} name - The country's name
 * @returns {Promise<boolean>}
 */
countrySchema.statics.isCountryExists = async function (countryName, countryCode) {
  const country = await this.findOne({ $or: [{ name: countryName }, { code: countryCode }] });
  return !!country;
};

/**
 * @typedef country
 */
const Country = mongoose.model('Country', countrySchema);

module.exports = Country;
