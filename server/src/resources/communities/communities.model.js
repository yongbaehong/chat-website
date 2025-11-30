import mongoose from 'mongoose';

const { Schema } = mongoose;

const Message = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'user' },
    message: String,
  },
  {
    timestamps: true,
  },
);

const CommunitySchema = Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'user' },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    address: {
      street: {
        type: String, required: true,
      },
      city: {
        type: String, required: true, index: true
      },
      stateAbbr: {
        type: String, required: true,
      },
      zipCode: {
        type: String, required: true,
      },
    },
    messages: [Message],
  },
  { timestamps: true },
);

// must create '.index' to Schema instance before assigning to '.model'
// fields and values must be in single quotes!! double will not work
// larger weight number gets priority on search
CommunitySchema.index({ name: 'text', 'address.city': 'text' }, { weights: { name: 2, 'address.city': 3 } });

const Communities = mongoose.model('communities', CommunitySchema);

export default Communities;
