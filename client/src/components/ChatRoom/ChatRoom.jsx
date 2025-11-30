import {
  useCallback, useContext,
  useEffect, useLayoutEffect,
  useRef, useReducer,
  createContext
} from 'react'
import { connect } from 'react-redux'
import {
  InputGroup, Form, FormControl,
  Image
} from 'react-bootstrap'
import moment from 'moment'
import { updateCommune } from '../../pages/Commune/actions/action'
import chatRoomReducer from './chatroomReducer'

import './ChatRoom.css'

function ChatRoom({ user, commune, updateCommune, errorCommune, ...props }) {
  const socket = useContext(createContext(user.socket))
  const [messages, appendMessages] = useReducer(chatRoomReducer, { chat_id: '', messages: [] })
  const msgInputRef = useRef(null)
  const chatPicInputRef = useRef(null)
  // Post picture in chatroom
  const postText = useCallback(() => {
    if (msgInputRef.current.value.length < 1) {
      msgInputRef.current.placeholder = "Must type something"
      return msgInputRef.current.focus()
    }
    const msgInfo = {
      chat_id: messages.chat_id,
      socketId: socket.id,
      user_id: user._id,
      message: msgInputRef.current.value,
    };
    socket.emit('CHAT_MSG', msgInfo);
    msgInputRef.current.value = '';
    msgInputRef.current.placeholder = "Type message here..."
  }, [messages])

  const postPic = () => {
    const file = chatPicInputRef.current.files[0]
    if (file) {
      return new Promise(function (resolve, reject) {

        if (file.size > 658000) {
          return resolve(errorCommune(new Error('The Photo size was over 685kB and was not sent. Please choose a Photo file size lower than 685kB. Thank you.')))
        }

        var reader = new FileReader();
        reader.onload = function (e) {
          //get all content
          var buffer = e.target.result;
          //send the content via socket
          socket.emit('POST_CHAT_PIC', {
            user_id: user._id,
            name: file.name,
            image: buffer,
            socketId: socket.id,
            chat_id: messages.chat_id,
          });

          chatPicInputRef.current.value = '';
          return resolve(true)
        };

        reader.readAsDataURL(file);
        // clear input value
        chatPicInputRef.current.value = '';
        reader.onabort = function (evt) {
          return reject(error);
        }
        reader.onerror = function (error) {
          return reject(error);
        }
      });
    }
  }

  const changeChatRoom = useCallback(() => {
    socket.emit('LINK_CHATROOM', { chat_id: commune._id, username: user.username, user_id: user._id, avatar: user.avatar })
  }, [])

  // scroll to bottom
  const scroll = () => {
    const msgBox = document.querySelector('#ChatRoomMsg-ul').lastChild
    msgBox.scrollIntoView(false)
  }
  useLayoutEffect(() => {
    scroll()
  })

  useEffect(() => {
    socket.on('LINK_CHATROOM', changeChatRoom)
    socket.on('JOINED', (data) => {
      appendMessages({ status: 'SET_CHAT_ID', chat_id: data.chat_id })
    })
    socket.on('CHAT_MSG', postPic)
    socket.on('EMIT_CHAT_MSG', (msg) => appendMessages({
      status: 'ADD_CHAT_MSG',
      message: msg
    }))
    socket.on('POST_CHAT_PIC', postPic)

    return () => {
      socket.off('LINK_CHATROOM')
      socket.off('JOINED')
      socket.off('CHAT_MSG')
      socket.off('EMIT_CHAT_MSG')
      socket.off('POST_CHAT_PIC')
    }
  }, [])

  useEffect(() => {
    changeChatRoom()
    return async () => {
      // When ChatRoom UNMOUNTS, this socket will leave the specified chat.id room
      await socket.emit('UNLINK_CHATROOM', { chat_id: commune._id })
      await updateCommune({ type: 'UNLINK_COMMUNE' })
    }
  }, [])
  return (
    <>
      <div id="ChatRoomMsg">
        <ul className="list-unstyled p-2 mb-5 scroll" id="ChatRoomMsg-ul">
          {(!!messages.messages.length) ? messages.messages.map((msgObj, idx) => {
            return (<li key={idx} className="">
              {msgObj.user_id ?
                <>
                  <Image
                    className="img-clip-circle"
                    src={`/user-photos/${msgObj.user_id._id}/${msgObj.user_id.avatar}`}
                    alt="message-avatar"
                    width="60"
                    height="60"
                  />
                  <span className="text-secondary px-2"><em className={`${msgObj.user_id.username !== user.username ? "ChatRoom-username" : null}`}>{msgObj.user_id.username}</em> : {moment(msgObj.createdAt).format('MMM D, h:mm a')}</span>
                  <br />
                </> : null
              }
              <p className={`px-3 pb-2 ${msgObj.user_id ? null : 'text-danger opacity-50'}`}>{
                msgObj.image ?
                  <Image
                    src={msgObj.image}
                    width="200"
                    height="200"
                    rounded
                  /> :
                  msgObj.message
              }</p>
            </li>)
          }

          ) : <span className="fst-bold"><em>You have entered {commune.name}</em></span>}
        </ul>
        <InputGroup className="px-1 mb-3" id="ChatRoom-text-input">
          <FormControl className="" ref={msgInputRef} placeholder="Type message here..." />
          <InputGroup.Text id="msgBtn" onClick={postText} role="button"><i className="fa fa-paper-plane"></i></InputGroup.Text>
          <InputGroup.Text id="msgBtn">
            <Form>
              <Form.Group className="image-upload">
                <Form.Label htmlFor="file-input" className="m-0" role="button">
                  <i className="fa fa-camera"></i>
                </Form.Label>
                <Form.Control onChange={postPic} id="file-input" type="file" name="chat-photo" label="Example file input" accept="image/*" ref={chatPicInputRef} />
              </Form.Group>
            </Form>
          </InputGroup.Text>
        </InputGroup>
      </div>
    </>
  )
}

const mapStateToProps = STATE => {
  return {
    ...STATE
  }
}

export default connect(mapStateToProps, {
  updateCommune,
})(ChatRoom);