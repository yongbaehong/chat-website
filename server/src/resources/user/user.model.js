import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema } = mongoose;
const gender = {
  values: ['female', 'male', 'other'],
  message: ' with value `{VALUE}`',
};
const UserSchema = Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      default: 'other',
      enum: gender,
    },
    age: {
      type: Number,
      min: 18,
      max: 130,
      default: 18,
      required: true,
    },
    avatar: {
      type: String,
      trim: true,
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  },
  { timestamps: true },
);

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  bcrypt.hash(this.password, 8, (err, hash) => {
    if (err) {
      return next(err);
    }
    this.password = hash;
    return next();
  });
});

UserSchema.methods.checkPassword = function (password) {
  const passwordHash = this.password;
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err);
      }
      return resolve(same);
    });
  });
};

const User = mongoose.model('user', UserSchema);

export default User;
