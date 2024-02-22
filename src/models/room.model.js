const mongoose = require('mongoose');

const { Schema } = mongoose;
const { toJSON, paginate } = require('./plugins');

const roomSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
  },
  description: {
    type: String,
  },

  building: { type: Schema.Types.ObjectId, ref: 'Building' },
});

roomSchema.plugin(toJSON);
roomSchema.plugin(paginate);
roomSchema.virtual('buildingCount', {
  ref: 'College',
  localField: 'college',
  foreignField: '_id',
  count: true,
});

/**
 * @typedef Room
 */
const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
