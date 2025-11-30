import mongoose from 'mongoose';

const { Schema } = mongoose;

function arrayLimit(key) {
  return !(key.length > 2);
}
const Message = new Schema(
  {
    message: String,
    type: { type: String, enum: ['img', 'msg'] },
    user_id: { type: Schema.Types.ObjectId, ref: 'user' },
    wasSeen: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const DirectMsgSchema = new Schema(
  {
    dm_users: {
      type: [{ type: Schema.Types.ObjectId, ref: 'user' }],
      validate: [arrayLimit, 'Cannot exceed more than 2 users in DM.'],
    },
    messages: [Message],
  },
  {
    timestamps: true,
  },
);

const DirectMsg = mongoose.model('message', DirectMsgSchema);

export default DirectMsg;
