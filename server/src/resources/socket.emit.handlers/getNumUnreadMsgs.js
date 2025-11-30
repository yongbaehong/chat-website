import DirectMsg from '../direct_msg/direct_msg.model';

const GET_NUM_UNREAD_MSGS = (io, userSocket) => async (data) => {
  try {
    // attach/initialize user_id to current socket
    userSocket.user_id = data.user_id;

    const allUserDMs = await DirectMsg.find({ dm_users: { $in: [data.user_id] } }, { messages: 1 }).populate('messages').exec();
    let numOfUnreadMsgs = 0;

    for (let i = 0; i < allUserDMs.length; i += 1) {
      for (let j = 0; j < allUserDMs[i].messages.length; j += 1) {
        if ((allUserDMs[i].messages[j].user_id.toString() !== data.user_id) && (allUserDMs[i].messages[j].wasSeen === false)) {
          numOfUnreadMsgs += 1;
        }
      }
    }
    return userSocket.emit('NAVMATCHES_MSGS_NUM', { data: numOfUnreadMsgs });
  } catch (err) {
    return socket.emit('SOCKET_ERROR', { message: 'Error getting number of unread messages.' });
  }
};

export default GET_NUM_UNREAD_MSGS;
