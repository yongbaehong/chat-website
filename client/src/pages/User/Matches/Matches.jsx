import { useNavigate } from 'react-router-dom'
import { connect } from 'react-redux';
import { Row, Col, Spinner, Image, Badge } from 'react-bootstrap';
import { dismissMatchError, showPreferenceModal, prefFilter, changeProfile, fetchMatches } from './actions';
import ToastAlert from '../../../components/Toast/Toast';
import Preferences from '../../../components/Preferences/Preferences'
import './Matches.css';
import { useEffect } from 'react';

function Matches({ dismissMatchError, matches, showPreferenceModal, prefFilter, changeProfile, ...props }) {
  const navigate = useNavigate()
  const showProfile = (person) => async function () {
    await changeProfile({ type: 'PROFILE', profile: person })
    await navigate(`/user/SETTINGS_MATCHEDPROFILE`)
  }

  useEffect(() => {
    if (matches.all.length === 0) {
      props.fetchMatches(`/api/matched/users/${props.user._id}`)
    }
  }, [])

  return (
    <>
      <Preferences showPrefs={matches.showPreferenceModal} showPreferenceModal={showPreferenceModal} prefFilter={prefFilter} user={props.user} />
      <div id="Matches-Container" className="fade-in">
        <h1 className="text-center font-noteworthy-light">Matches</h1>
        <Row className="g-0 p-1">
          <ToastAlert toast={matches.err} setToast={dismissMatchError} toastMsg={matches.errMsg} />
          <Col xs={{ span: 12, offset: 0 }} sm={{ span: 8, offset: 2 }} md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }} className="d-flex flex-column align-items-center">
            {matches.isLoading ? <><Spinner animation="border" variant="primary" /><span className="">Loading...</span></> : null}
          </Col>
        </Row>
        <Row className="g-0" id="Matches-row">
          {(!!matches.all.length) ?
            matches.all.map((person, idx) => {
              if (person._id === props.user._id) return
              return (
                <Col key={idx} sm={12} md={6} lg={3} className="d-flex align-items-center border"
                  onClick={showProfile(person)}>
                  <Image
                    className="img-clip-circle"
                    src={`/user-photos/${person._id}/${person.avatar}`}
                    alt="avatar-photo"
                    width="200"
                    height="200"
                  />
                  <div className="me-1">
                    <div>{person.username}</div>
                    <div>{person?.age}</div>
                    <div>{person?.gender}</div>
                    {('unseen' in person) ?
                      <div>
                        <Badge className="bg-c-analogous-1 text-white opacity-75">
                          <Badge className="rounded-pill text-dark bg-light">{person.unseen}</Badge>
                          {' '}
                          <i className="fa fa-envelope-square fs-7 text-white opacity-75"></i>
                        </Badge>
                      </div>
                      : null
                    }
                    {(('lastMsg' in person) && person.unseen > 0) ?
                      <div> <em id="Matches-lastMsg">{(person.lastMsg.type === 'msg') ? `"${person.lastMsg.message.substring(0, 44)}"` : <i className="fa fa-image fa-3x text-c-complementary"></i>}</em> </div>
                      : null
                    }
                  </div>
                </Col>
              )
            })
            : 'No Matches Found'}
        </Row>
      </div>
    </>
  )
}

const mapStateToProps = STATE => {
  return {
    ...STATE
  }
}

export default connect(mapStateToProps,
  {
    dismissMatchError,
    showPreferenceModal,
    prefFilter, changeProfile,
    fetchMatches
  })(Matches);
