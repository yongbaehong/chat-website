import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import multiparty from 'multiparty';
import User from './user.model';
import DirectMsg from '../direct_msg/direct_msg.model';
import copyFile from '../../util/copyFile';

/**
 * `saving a photo`
 */

// create directory to store vacation photos (if it doesn't already exist)
const dataDir = path.resolve(__dirname, '../../', 'public');
const userPhotosDir = path.join(dataDir, 'user-photos');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(userPhotosDir)) fs.mkdirSync(userPhotosDir);
const mkdir = promisify(fs.mkdir);
const rename = promisify(fs.rename);
const rmdir = promisify(fs.rm);
const copyFileAsync = promisify(fs.copyFile);
const unlinkAsync = promisify(fs.unlink);

// Create one user
export const createUser = async (req, res, next) => {
  try {
    const form = new multiparty.Form();
    form.parse(req, async (err, fields, files) => {
      try {
        if (err) return res.status(500).json({ message: err.message });
        const {
          username, password, gender, age,
        } = fields;
        const [name] = username;
        const [pw] = password;
        const [userGender] = gender;
        const [userAge] = age;
        let photo;
        if (files.photo === undefined) {
          photo = { originalFilename: 'default-avatar.svg', path: '' };
          const userExists = await User.findOne({ username: name }).select('-password').exec();
          if (userExists) return res.status(400).json({ message: 'Username already exists...' });
          const newUser = await User.create({
            username: name, password: pw, gender: userGender, age: userAge, avatar: photo.originalFilename,
          });
          if (!newUser) return res.status(400).json({ message: 'Failed to create new user...' });
          const dir = `${userPhotosDir}/${newUser._id}`;
          const filePath = `${dir}/${photo.originalFilename}`; // Regexp the original filename to username
          /**
           * *req.body is an empty obj and must be assigned `username` & `password` because Passport*
           * *expects these values in req.body*
           * *req.body is empty because we sent the information as mulitform/data not a JSON object*
           *  */
          req.body = { username: name, password: pw };
          // condition when photo not chosen
          await mkdir(dir);
          await copyFile(path.join(dir, '../../default-avatar.svg'), filePath);
          await newUser.save(next);
        } else {
          photo = files.photo[0];
          const userExists = await User.findOne({ username: name }).select('-password').exec();
          if (userExists) return res.status(400).json({ message: 'Username already exists...' });
          const newUser = await User.create({
            username: name, password: pw, gender: userGender, age: userAge, avatar: photo.originalFilename,
          });
          if (!newUser) return res.status(400).json({ message: 'Failed to create new user...' });
          const dir = `${userPhotosDir}/${newUser._id}`;
          const filePath = `${dir}/${photo.originalFilename}`; // Regexp the original filename to username
          /**
           * *req.body is an empty obj and must be assigned `username` & `password` because Passport*
           * *expects these values in req.body*
           * *req.body is empty because we sent the information as mulitform/data not a JSON object*
           *  */
          req.body = { username: name, password: pw };
          await mkdir(dir);
          await copyFileAsync(photo.path, filePath);
          await unlinkAsync(photo.path);
          await newUser.save(next);
        }
      } catch (formError) {
        return res.status(400).json({ message: err.message });
      }
    });
  } catch (err) {
    return res.status(400).json({ data: { message: err.message } });
  }
};

export const updateUserAvatar = async (req, res) => {
  try {
    const form = new multiparty.Form();

    form.parse(req, async (err, fields, files) => {
      try {
        if (err) return res.status(500).json({ message: err.message });
        /**
         * *req.body is an empty obj and must be assigned `username` & `password` because Passport*
         * *expects these values in req.body*
         * *req.body is empty because we sent the information as mulitform/data not a JSON object*
         *  */
        req.body = { username: req.user.username, password: req.user.password };
        // condition when photo not chosen
        if (files.photo === undefined) {
          throw new Error('You did not choose a photo. Please try again.');
        }

        const photo = files.photo[0];
        const dir = `${userPhotosDir}/${req.user._id}`;
        const filePath = `${dir}/${photo.originalFilename}`;
        await rmdir(dir, { recursive: true });
        await mkdir(dir);
        await copyFileAsync(photo.path, filePath);
        await unlinkAsync(photo.path);
        const { username, _id } = req.user;
        await User.findByIdAndUpdate(_id, { avatar: photo.originalFilename });
        const user = { username, _id };
        user.avatar = `${photo.originalFilename}`;
        return res.status(200).json({ user });
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const deletedUser = await User.findOne({ username }).exec();
    if (!deletedUser) {
      return res.status(400).json({ message: 'Something went wrong. Please try again later.' });
    }

    const confirmPassword = await deletedUser.checkPassword(password);
    if (confirmPassword === false) {
      return res.status(400).json({ message: 'That was the incorrect password. Please try again' });
    }

    await User.findOneAndDelete({ username }).lean().exec();
    const userdir = path.join(__dirname, '../../', `public/user-photos/${deletedUser._id.toString()}`);
    await rmdir(userdir, { recursive: true });
    return res.status(200).json({ message: 'Delete', user: deletedUser });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const prefFilter = async (req, res) => {
  try {
    const { age, gender, user_id } = req.body;
    const usersWithMsgs = await DirectMsg.find({ dm_users: { $in: [user_id] } }, { messages: 1 }).exec();

    if (gender[0] === '') {
      const filter = await User.find({ age: { $gte: age.min, $lte: age.max } }).select('-password -createdAt -updatedAt').lean().exec();
      for (let i = 0; i < usersWithMsgs.length; i += 1) {
        for (let j = 0; j < filter.length; j += 1) {
          const unseenMsgs = usersWithMsgs[i].messages.filter((msg) => {
            if ((msg.user_id.toString() === filter[j]._id.toString()) && (msg.wasSeen === false)) {
              return true;
            }
            return false;
          });
          if (unseenMsgs.length) {
            filter[j].unseen = unseenMsgs.length;
            filter[j].lastMsg = unseenMsgs[unseenMsgs.length - 1];
          }
        }
      }
      return res.status(200).json(filter);
    }
    const filter = await User.find({ gender: { $in: [...gender] }, age: { $gte: age.min, $lte: age.max } }).select('-password -createdAt -updatedAt').lean().exec();

    for (let i = 0; i < usersWithMsgs.length; i += 1) {
      for (let j = 0; j < filter.length; j += 1) {
        const unseenMsgs = usersWithMsgs[i].messages.filter((msg) => {
          if ((msg.user_id.toString() === filter[j]._id.toString()) && (msg.wasSeen === false)) {
            return true;
          }
          return false;
        });
        if (unseenMsgs.length) {
          filter[j].unseen = unseenMsgs.length;
          filter[j].lastMsg = unseenMsgs[unseenMsgs.length - 1];
        }
      }
    }
    return res.status(200).json(filter);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const matchedUsers = async (req, res) => {
  try {
    // get all DirectMsgs with the user and add number of unseen msgs to property to it
    const matchedPPL = await User.find().select('-password -age -gender -createdAt -updatedAt').lean().exec();
    const matchedDMs = await DirectMsg.find({ dm_users: { $in: [req.params.id] } }, { messages: 1 }).exec();
    for (let i = 0; i < matchedDMs.length; i += 1) {
      for (let j = 0; j < matchedPPL.length; j += 1) {
        const unseenMsgs = matchedDMs[i].messages.filter((msg) => {
          if ((msg.user_id.toString() === matchedPPL[j]._id.toString()) && (msg.wasSeen === false)) {
            return true;
          }
          return false;
        });
        if (unseenMsgs.length) {
          matchedPPL[j].unseen = unseenMsgs.length;
          matchedPPL[j].lastMsg = unseenMsgs[unseenMsgs.length - 1];
        }
      }
    }
    if (!matchedPPL) return res.status(400).json({ message: 'Could not get any matched users.' });
    return res.status(200).json(matchedPPL);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, _id, avatar } = req.user;
    const user = { username, _id, avatar };
    return res.status(200).json({ user, message: 'loginUser success' });
  } catch (err) {
    return res.status(400).json({ message: 'Login user Error' });
  }
};

export const logoutUser = async (req, res) => {
  try {
    req.logout();
    res.clearCookie('Authorization');
    res.clearCookie('connect.sid');
    return res.status(200).json({ message: 'You have logged out' });
  } catch (err) {
    return res.status(500).json({ message: 'Logout Error.' });
  }
};

export const authError = async (req, res) => {
  try {
    req.logout();
    res.clearCookie('Authorization');
    res.clearCookie('connect.sid');
    return res.status(400).json({ message: 'Invalid username & password combination...' });
  } catch (err) {
    return res.status(500).json({ message: 'Authentication Error.' });
  }
};

export const getUser = async (req, res) => {
  try {
    // use sessions [req.user] to find current user
    const user = await User.findOne({ username: req.user.username }).select('-password -createdAt -updatedAt').lean().exec();
    if (!user) {
      return res.status(400).json({ message: `Error getting user ${req.user.username}` });
    }
    return res.status(200).json({ user, message: `Welcome ${user.username}` });
  } catch (err) {
    return res.status(400).json({ message: 'Error getting user' });
  }
};

export const unseenUserMsgs = async (req, res) => {
  try {
    const { id } = req.params;
    const userMsgs = await DirectMsg.find({ dm_users: { $in: [id] }, 'messages.$[].wasSeen': false }, { _id: 0, dm_users: 1, messages: 1 }).lean().exec();
    const { friends } = await User.findById(id).populate({
      path: 'friends',
      model: 'user',
      select: '_id',
    })
      .select('-password -createdAt -updatedAt')
      .lean()
      .exec();

    if (!userMsgs) {
      return res.status(400).json({ message: 'Could not get Users of unseen messages. Please try again later.' });
    }
    const users = await User.find({ _id: { $in: [...userMsgs.map((u) => u.dm_users.filter((el) => el.toString() !== id)).flat()] } }).select('-password -createdAt -updatedAt').lean().exec();
    for (let i = 0; i < userMsgs.length; i += 1) {
      for (let j = 0; j < users.length; j += 1) {
        const unseenMsgs = userMsgs[i].messages.filter((msg) => {
          if ((msg.user_id.toString() === users[j]._id.toString()) && (msg.wasSeen === false)) {
            return true;
          }
          return false;
        });
        if (unseenMsgs.length) {
          users[j].unseen = unseenMsgs.length;
          users[j].lastMsg = unseenMsgs[unseenMsgs.length - 1];
        }
      }
    }

    return res.status(200).json(users.filter((el) => friends.map((friend) => friend._id.toString()).includes(el._id.toString()) || el.unseen > 0));
  } catch (err) {
    return res.status(500).json({ message: 'unseenUserMsgs ERROR' });
  }
};

export const addOrRemoveFriend = async (req, res) => {
  try {
    const { friendid, op, id } = req.params;
    if (op === 'add') {
      const user = await User.findByIdAndUpdate(id, { $addToSet: { friends: friendid } }, { new: true })
        .select('-password')
        .lean().exec();
      return res.status(200).json({ user });
    }
    if (op === 'remove') {
      const user = await User.findByIdAndUpdate(id, { $pull: { friends: friendid } }, { new: true })
        .select('-password')
        .lean().exec();
      return res.status(200).json({ user });
    }
  } catch (err) {
    return res.status(500).json({ message: 'ERROR: Could not add friend.' });
  }
};
