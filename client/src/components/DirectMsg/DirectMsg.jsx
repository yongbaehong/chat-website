import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useReducer,
  useState,
  createContext,
} from 'react';
import { connect } from 'react-redux'
import moment from 'moment';
import { Form, FormControl, Image, InputGroup, Modal } from 'react-bootstrap';
import { responseParser, status } from '../../util/fetchHandler';
import { reducer } from './messagesReducer'
import { updateMatch, changeProfile, errorMatch } from '../../pages/User/Matches/actions'
import './DirectMsg.css'

function DirectMsg({ profile, user, ...props }) {
  // create the socket context with socket attached to user object
  const [showGallery, setShowGallery] = useState(false);
  const [galleryImg, setGalleryImg] = useState('')
  const handleClose = () => setShowGallery(false);
  const handleShow = (msgObj) => () => {
    setGalleryImg(msgObj.message)
    setShowGallery(prev => !prev)
  };
  const socket = useContext(createContext(user.socket))
  const [messages, appendMessages] = useReducer(reducer, { dm_id: "", messages: [] });
  const msgInputRef = useRef(null)
  const picInputRef = useRef(null)
  const scroll = () => {
    const msgBox = document.querySelector('#DirectMsg-ul').lastChild
    msgBox.scrollIntoView(false)
  }
  useLayoutEffect(() => {
    scroll()
  })

  const postText = useCallback(() => {
    if (msgInputRef.current.value.length < 1) {
      msgInputRef.current.placeholder = "Must type something"
      return msgInputRef.current.focus()
    }
    const msgInfo = {
      dm_id: messages.dm_id,
      socketId: socket.id,
      roomId: [profile._id, user._id],
      message: msgInputRef.current.value,
    };
    socket.emit('MESSAGE', msgInfo);
    msgInputRef.current.value = '';
    msgInputRef.current.placeholder = "Type message here..."
  }, [messages]); // need to pass in profile and messages to keep track of changes

  const postImg = useCallback((evt) => {
    evt.preventDefault()
    const file = picInputRef.current.files[0]
    if (file) {
      return new Promise(function (resolve, reject) {

        if (file.size > 485000) {
          return resolve(props.errorMatch(new Error('The Photo size was over 485kB and was not sent. Please choose a Photo file size lower than 485kB. Thank you.')))
        }

        var reader = new FileReader();
        reader.onload = function (e) {
          //get all content
          var buffer = e.target.result;
          //send the content via socket
          socket.emit('POST_IMG', {
            name: file.name, image: buffer,
            dm_id: messages.dm_id, socketId: socket.id,
            roomId: [profile._id, user._id],
          });

          picInputRef.current.value = '';
          return resolve(true)
        };

        reader.readAsBinaryString(file);
        // clear input value
        picInputRef.current.value = '';
        reader.onabort = function (evt) {
          return reject(error);
        }
        reader.onerror = function (error) {
          return reject(error);
        }
      });
    } else {
      picInputRef.current.value = '';
      console.warn('no File')
    }

  }, [messages])

  const changeDmRoom = useCallback(async () => {
    await socket.emit('LINK_DM', { dm: [profile._id, user._id], username: user.username, user_id: user._id })
    await props.updateMatch({ type: 'CHANGE_PROFILE', user_id: profile._id, data: 0 })
  }, [])

  const removeSocketFromDm = useCallback((profile, userId) => {
    socket.emit('UNLINK_DM', { profile, user_id: userId })
  }, [profile])

  useEffect(() => {
    if ('_id' in profile) {
      // fetch dm data
      fetch(`/api/dm/${user._id}/${profile._id}`)
        .then(status)
        .then(responseParser)
        .then((data) => appendMessages({ dm_id: data.data._id, status: 'INITIAL', initialMsgs: !!data.data.messages.length ? data.data.messages : [] }))
        .catch((err) => console.error(err))
    }
    socket.on('LINK_DM', changeDmRoom)
    socket.on('DM_ID', (data) => appendMessages({ status: 'SET_DM_ID', dm_id: data.dm_id }))
    socket.on('MESSAGE', postText);
    socket.on('EMIT_MSG', (msg) => {
      const { message, user_id, wasSeen, _id, createdAt, type } = msg
      appendMessages({ status: 'ADD_MESSAGE', message: { createdAt, _id, type, message, wasSeen, user_id: user_id._id } })
    })

    socket.on('POST_IMG', postImg)

    return async () => {
      socket.off('LINK_DM')
      socket.off('DM_ID')
      socket.off('MESSAGE')
      // required, so it stops after first event 
      socket.off('EMIT_MSG')
      socket.off('POST_IMG')
    }
  }, []);

  useEffect(() => {
    changeDmRoom()
    return () => {
      props.changeProfile({ type: 'PROFILE', profile: {} })
      removeSocketFromDm(profile, user._id)
    }
  }, [])

  return (
    <>
      <ul className="list-unstyled p-2 mb-5 scroll" id="DirectMsg-ul">
        {(!!messages.messages.length) ? messages.messages.map((msgObj, idx) => {
          return (<li key={idx} className={`${(msgObj.wasSeen !== undefined) ? (msgObj.user_id === user._id) ? "DirectMsg-ul-li-left text-lg-center text-md-end text-end" : "DirectMsg-ul-li-right text-lg-center text-md-start" : "DirectMsg-ul-li-center"}`}>
            <span className="text-secondary px-2">{moment(msgObj.createdAt).format('MMM D, h:mm a')}</span>
            <div>
              <div className={`${(msgObj.wasSeen !== undefined) ? (msgObj.user_id === user._id) ? "text-end message-bubble-user" : "text-start message-bubble-profile" : "message-bubble-default"}`}>
                {((msgObj.user_id !== user._id) && 'avatar' in profile) ?
                  <>
                    <Image
                      className="img-clip-circle"
                      src={`/user-photos/${msgObj.user_id}/${profile.avatar}`}
                      alt="message-avatar"
                      width="40"
                      height="40"
                    />
                  </> : null
                }
                {(msgObj.type === 'msg') ?
                  <p className="px-2 m-0">{msgObj.message}</p> :
                  <Image
                    src={`/dm_photos/${messages.dm_id}/${msgObj.message}`}
                    width="100"
                    height="100"
                    alt="chat-photo"
                    onClick={handleShow(msgObj)}
                    role="button"
                  />
                }
              </div>
            </div>
          </li>)
        }

        ) : <span className="fst-bold">There're no messages, send a message and start now...</span>}
      </ul>
      <InputGroup className="px-1 mb-3 fixed-bottom" id="DirectMsg-textField">
        <FormControl className="" ref={msgInputRef} placeholder="Type message here..." />
        <InputGroup.Text onClick={postText} role="button"><i className="fa fa-paper-plane"></i></InputGroup.Text>
        <InputGroup.Text>
          <Form>
            <Form.Group className="image-upload">
              <Form.Label htmlFor="file-input" className="m-0" role="button">
                <i className="fa fa-camera"></i>
              </Form.Label>
              <Form.Control onChange={postImg} id="file-input" type="file" name="chat-photo" label="Example file input" accept="image/*" ref={picInputRef} />
            </Form.Group>
          </Form>
        </InputGroup.Text>
      </InputGroup>


      <Modal show={showGallery} onHide={handleClose} centered id="galleryModal">
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body className="p-1">
          <Image
            src={`/dm_photos/${messages.dm_id}/${galleryImg}`}
            id="galleryImg"
            alt="chat-photo"
          />
        </Modal.Body>
      </Modal>
    </>
  )
}

const mapStateToProps = STATE => {
  return {
    ...STATE
  }
}

export default connect(mapStateToProps, { updateMatch, changeProfile, errorMatch })(DirectMsg);
