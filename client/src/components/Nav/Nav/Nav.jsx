import { useContext, useEffect, createContext, useState } from 'react'
import { connect } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { updateMsgNum, incrementMsgsNum, socketError, dismissSocketError } from './action' // navigation
import { fetchMatches, showPreferenceModal, updateMatch } from '../../../pages/User/Matches/actions' // matches
import { fetchCommunes, createCommune } from '../../../pages/User/Community/actions' // Commune
import NavBottom_Icon from '../Icons/NavBottom_Icons'
import { IconButtonOverLay, cog } from '../../Popover/Popover'
import CreateCommuneModal from '../../CreateCommuneModal/CreateCommuneModal'
import ToastAlert from '../../Toast/Toast'
import './Nav.css'

function Nav({ ...props }) {
  const navigate = useNavigate()
  const [socket] = useState(useContext(createContext(props.user.socket)))
  const location = useLocation()
  const unseenUserMsgs = async () => {
    await navigate('/user/SETTINGS_MATCHES')
    await props.fetchMatches(`/api/unseen-user-messages/${props.user._id}`)
  }
  const showPref = () => props.showPreferenceModal(true)
  const getAllPeople = () => props.fetchMatches(`/api/matched/users/${props.user._id}`)
  const getAllCommune = () => props.fetchCommunes('/api/communities/all')

  useEffect(() => {
    // get number of unchecked messages when user logs in
    socket.on('GET_NUM_UNREAD_MSGS', socket.emit('GET_NUM_UNREAD_MSGS', { user_id: props.user._id }))
    socket.on('NAVMATCHES_MSGS_NUM', ({ data }) => props.updateMsgNum(data))
    return () => {
      socket.off('NAVMATCHES_MSGS_NUM')
    }
  }, [])

  useEffect(() => {
    // add 1 to total of nav msg-num
    socket.on('NAVMATCHES_MSGS_ADD', ({ data }) => props.incrementMsgsNum(data))
    // when linked to dm, subtracts profile-msg-num from total-msg-num
    socket.on('UPDATE_UNSEEN_MSGS_NAV', ({ data }) => props.incrementMsgsNum(data))
    // update specific message
    socket.on('UPDATE_UNSEEN_MSGS', (data) => {
      props.updateMatch({ type: 'UPDATE_MATCHES', user_id: data.user_id, data: data.data, dm: data.dm })
    })
    socket.on('SOCKET_ERROR', (data) => {
      props.socketError(data.message)
    })
  }, [])

  return (
    <>
      <ToastAlert toast={props.navigation.showError} setToast={props.dismissSocketError} toastMsg={props.navigation.errorMsg} />
      {(props.loggedIn && props.user.hasOwnProperty('socket')) ?
        <div className="bg-white shadow fixed-bottom pt-2 pb-2 d-flex justify-content-evenly align-items-baseline">

          {(location.pathname !== '/user/SETTINGS_DASHBOARD' && location.pathname.startsWith('/user') && location.pathname !== '/user/SETTINGS_PROFILE') ?
            <>
              <NavBottom_Icon click={(location.pathname === '/user/SETTINGS_MATCHES') ? getAllPeople : getAllCommune} defaultClass="Icon-box">
                <i className={`Nav-icons bg-white rounded-pill fa fa-${(location.pathname === '/user/SETTINGS_MATCHES') ? 'layer-group' : 'layer-group'} fs-5 NavMatches-Msg-comment`} role="button" >
                </i>
                <span className="text-secondary">all</span>
              </NavBottom_Icon>
            </> : null
          }

          {(location.pathname === '/user/SETTINGS_MATCHES') ?
            <>
              <NavBottom_Icon click={showPref} defaultClass="Icon-box">
                <i className="Nav-icons bg-white rounded-pill fa fa-puzzle-piece fs-5 NavMatches-Msg-comment" role="button" >
                </i>
                <span className="text-secondary">prefs</span>
              </NavBottom_Icon>
            </>
            : (location.pathname === '/user/SETTINGS_COMMUNITY') ?
              <>
                <CreateCommuneModal createOneCommune={props.createCommune} user={props.user} />
              </>
              : null
          }

          <NavBottom_Icon click={unseenUserMsgs} defaultClass="Icon-box">
            <i className="Nav-icons bg-white rounded-pill fa fa-user-friends fs-5 NavMatches-Msg-comment" role="button">
              {(props.navigation.msg_num ?
                <i className="fa fa-comment-alt NavMatches-Msg-num">
                  <span className="NavMatches-Msg-num2">{props.navigation.msg_num}</span>
                </i>
                : null)
              }

            </i>
            <span className="text-secondary">friends</span>
          </NavBottom_Icon>

          <NavBottom_Icon defaultClass="Icon-box">
            <Link to="/user/SETTINGS_DASHBOARD">
              <i className="Nav-icons bg-white rounded-pill fa fa-home fa-1x NavMatches-Msg-comment" role="button" ></i>
            </Link>
            <span className="text-secondary">dash</span>
          </NavBottom_Icon>

          <NavBottom_Icon defaultClass="Icon-box">
            <IconButtonOverLay
              customClass={'shadow'}
              popover={cog}
              trigger={['focus', 'click']}
            >
              <i className="Nav-icons bg-white rounded-pill fa fa-cog fa-1x NavMatches-Msg-comment" role="button" ></i>
            </IconButtonOverLay>
          </NavBottom_Icon>

        </div>
        : null
      }
    </>
  )
}

function mapStateToProps(STATE) {
  return {
    ...STATE
  }
}

export default connect(mapStateToProps, {
  updateMsgNum, incrementMsgsNum, fetchMatches,
  showPreferenceModal, fetchCommunes,
  createCommune, updateMatch, socketError,
  dismissSocketError
})(Nav)