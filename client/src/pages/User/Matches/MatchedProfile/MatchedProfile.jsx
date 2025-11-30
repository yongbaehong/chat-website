import { useEffect } from 'react'
import { connect } from 'react-redux'
import { Image } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import DirectMsg from '../../../../components/DirectMsg/DirectMsg'
import ToastAlert from '../../../../components/Toast/Toast';
import { addRemoveFriend } from '../../actions/actions'
import { changeProfile, dismissMatchError } from '../actions'
import './MatchedProfile.css'

function MatchedProfile({ changeProfile, dismissMatchError, addRemoveFriend, ...props }) {
  const nav = useNavigate()
  const chat = async () => {
    await changeProfile({ type: 'PROFILE', profile: {} })
    await nav('/user/SETTINGS_MATCHES')
  }

  const addOrRemoveFriend = () => {
    if (!props.user.friends.includes(props.matches.profile._id)) {
      addRemoveFriend(`/api/friend/${props.matches.profile._id}/add/${props.user._id}`)
    } else {
      addRemoveFriend(`/api/friend/${props.matches.profile._id}/remove/${props.user._id}`)
    }
  }

  useEffect(() => {
    if (props.matches.profile.hasOwnProperty('username') === false) {
      nav('/user/SETTINGS_MATCHES')
    }
  }, [])

  return (
    <>
      <div id="MatchedProfile-user-info">
        <ToastAlert toast={props.matches.err} setToast={dismissMatchError} toastMsg={props.matches.errMsg} />
        <div className="d-flex justify-content-end">
          <i className="MatchedProfile-chevron fa fa-chevron-left me-3 mt-2 fs-1" onClick={chat} role="button"></i>
        </div>
        {(props.matches.profile.hasOwnProperty('_id')) ?
          <section className="d-flex align-items-center">
            <Image
              className="img-clip-circle"
              src={`/user-photos/${props.matches.profile._id}/${props.matches.profile.avatar}`}
              alt="avatar-profile"
              width="60"
              height="60"
            />
            <div className="d-flex align-items-center">
              <p className="m-0">{props.matches.profile.username ? props.matches.profile.username : null}</p>
              <div className="ms-4 me-4 display-5">|</div>
              <p className="m-0" role="button" onClick={addOrRemoveFriend}><i className={`fa fa-${props.user.friends.includes(props.matches.profile._id) ? "check text-success" : "plus text-secondary"} `}></i> Friend</p>
            </div>
          </section> : null
        }
      </div>

      <section className="">
        <DirectMsg user={props.user} profile={props.matches.profile} />
      </section>
    </>
  )
}


const mapStateToProps = STATE => {
  return {
    ...STATE
  }
}

export default connect(mapStateToProps, { changeProfile, dismissMatchError, addRemoveFriend })(MatchedProfile);
