import Community from '../../communities/communities.model';

const CHAT_MSG = (io) => async (data) => {
  try {
    const communityDoc = await Community.findByIdAndUpdate(
      data.chat_id,
      { $push: { messages: { user_id: data.user_id, message: data.message } } },
      { new: true },
    )
      .populate({
        path: 'messages.user_id', // access individual keys of objects in arrays
        model: 'user',
        select: '-password -createdAt -updatedAt',
      }).lean().exec();

    if (!communityDoc) {
      socket.emit('SOCKET_ERROR', { message: 'Error sending your message.' });
    }
    await io.to(`${communityDoc._id}`).emit('EMIT_CHAT_MSG', communityDoc.messages[communityDoc.messages.length - 1]);
    return;
  } catch (err) {
    return socket.emit('SOCKET_ERROR', { message: 'Error sending your message.' });
  }
};

export default CHAT_MSG;
