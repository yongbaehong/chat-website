import DirectMsg from '../../direct_msg/direct_msg.model';

const LINK_DM = (socket) => async (data) => {
  try {
    const dmDoc = await DirectMsg.findOne({ dm_users: { $all: data.dm } }).exec();
    const userSocket = socket;
    userSocket.dmUsers = data.dm;
    userSocket.username = data.username;
    if (!dmDoc) {
      // create one and join _id
      // do not add .lean().exec() because .create() does not accept it.
      const newDmDoc = await DirectMsg.create({ dm_users: data.dm });
      userSocket.dm_id = newDmDoc._id.toString();
      await userSocket.join(`${newDmDoc._id}`);
      return userSocket.emit('DM_ID', { dm_id: newDmDoc._id });
    }
    if (dmDoc) {
      userSocket.dm_id = dmDoc._id.toString();
      // if the data.user_id !== messages.$[].user_id && .wasSeen === false
      // change .wasSeen to true
      let numOfUnreadMsgs = 0;

      for (let i = 0; i < dmDoc.messages.length; i += 1) {
        if ((dmDoc.messages[i].user_id.toString() !== data.user_id) && dmDoc.messages[i].wasSeen === false) {
          dmDoc.messages[i].wasSeen = true;
          numOfUnreadMsgs -= 1;
        }
      }
      dmDoc.save();
      await userSocket.join(`${dmDoc._id}`);
      await userSocket.emit('UPDATE_UNSEEN_MSGS_NAV', { data: numOfUnreadMsgs });
      return userSocket.emit('DM_ID', { dm_id: dmDoc._id });
    }
  } catch (err) {
    return userSocket.emit('SOCKET_ERROR', { message: 'Error linking to Direct Message.' });
  }
};

export default LINK_DM;
