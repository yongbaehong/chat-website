import LINK_DM from './direct_message/linkDm';
import MESSAGE from './direct_message/message';
import POST_IMG from './direct_message/postImg';
import UNLINK_DM from './direct_message/unlinkDm';

import LINK_CHATROOM from './chat_room/linkChatroom';
import UNLINK_CHATROOM from './chat_room/unlinkChatroom';
import CHAT_MSG from './chat_room/chatMessage';
import POST_CHAT_PIC from './chat_room/postChatPic';
import GET_NUM_UNREAD_MSGS from './getNumUnreadMsgs';
import DISCONNECT from './disconnect';

const onConnection = (io, socket) => {
  // DM
  socket.on('LINK_DM', LINK_DM(socket));
  socket.on('UNLINK_DM', UNLINK_DM(socket));
  socket.on('MESSAGE', MESSAGE(io, socket));
  socket.on('POST_IMG', POST_IMG(io, socket));
  // CHATROOM
  socket.on('LINK_CHATROOM', LINK_CHATROOM(io, socket));
  socket.on('UNLINK_CHATROOM', UNLINK_CHATROOM(io, socket));
  socket.on('CHAT_MSG', CHAT_MSG(io));
  socket.on('POST_CHAT_PIC', POST_CHAT_PIC(io));
  // NAV
  socket.on('GET_NUM_UNREAD_MSGS', GET_NUM_UNREAD_MSGS(io, socket));
  socket.on('disconnect', DISCONNECT(io, socket));
};

export default onConnection;
