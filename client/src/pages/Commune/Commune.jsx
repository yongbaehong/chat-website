import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { Row, Col, Spinner } from 'react-bootstrap'
import ChatRoom from '../../components/ChatRoom/ChatRoom'
import Userlist from '../../components/Userlist/Userlist'
import ToastAlert from '../../components/Toast/Toast'
import { errorCommune, dismissCommuneError } from './actions/action'

function Commune({ commune, ...props }) {
  const nav = useNavigate();
  useEffect(() => {
    if (commune.isRequesting === false) {
      nav('/user/SETTINGS_DASHBOARD')
    }
  }, [])

  return (
    <>
      <ToastAlert toast={commune.err} toastMsg={commune.errMsg} setToast={props.dismissCommuneError} />
      {(props.loggedIn && commune.isRequesting)
        ? <><Spinner animation="border" variant="primary" /><span className="">Loading...</span></>
        : (props.loggedIn && ('address' in commune) && (commune.isRequesting === false))
          ? <>
            <header className="d-flex flex-column align-items-center border-bottom">
              <h1 className="Commune-name text-center mb-0">{commune.name}{commune.ownder === props.user._id ? <><span className="text-secondary fs-6 fst-italic">&nbsp;(owner)</span></> : null}</h1>
              <div className="text-center">{commune.address.city}, {commune.address.stateAbbr}</div>
            </header>

            <Row className="g-0">

              <Col sm={12} md={12} lg={12} id="Chatroom-col" className="d-flex">
                <Userlist />
                <ChatRoom errorCommune={props.errorCommune} />
              </Col>
            </Row>
          </>
          : <><h2>No Commune in redux branch</h2></>
      }
    </>
  )
}

const mapStateToProps = STATE => {
  const { user, commune, loggedIn } = STATE;
  return {
    commune,
    loggedIn,
    user,
  }
}

export default connect(mapStateToProps, { errorCommune, dismissCommuneError })(Commune);
