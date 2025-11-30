import { useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { Row, Col, Image } from 'react-bootstrap'
import { fetchUser } from './actions/actions'
import PageTemplate from '../../components/PageTemplate/PageTemplate'
import Dashboard from './Dashboard/Dashboard'
import Profile from './Profile/Profile'
import Community from './Community/Community'
import Commune from '../Commune/Commune'
import Matches from './Matches/Matches'
import Footer from '../../components/Footer/Footer'

import Nav from '../../components/Nav/Nav/Nav'
import './User.css'
import MatchedProfile from './Matches/MatchedProfile/MatchedProfile';

function User({ ...props }) {
  const nav = useNavigate()
  const filter = useParams()
  const { subcomponent } = filter
  const displayComponent = {
    SETTINGS_DASHBOARD: <Dashboard {...props} />,
    SETTINGS_PROFILE: <Profile />,
    SETTINGS_COMMUNITY: <Community />,
    SETTINGS_MATCHES: <Matches />,
    SETTINGS_COMMUNE: <Commune />,
    SETTINGS_MATCHEDPROFILE: <MatchedProfile />
  }
  useEffect(() => {
    props.dispatch(fetchUser('/api/user'))
    nav(`/user/SETTINGS_DASHBOARD`)
  }, [])

  return (
    <>
      {(props.loggedIn && typeof props.user === 'object') ?
        <PageTemplate {...props}>
          {displayComponent[subcomponent]}
          <Nav />
        </PageTemplate>
        : <PageTemplate>
          <div className="container vh-100 d-flex flex-column justify-content-center">
            <Row className="g-0">
              <Col xs={12} md={6} className="text-center mt-5">
                <Image src="/whoops.svg" alt="whoops" width="250" fluid />
              </Col>

              <Col xs={12} md={{ offset: 1, span: 4 }} className="d-flex flex-column justify-content-center mt-5 mt-sm-5 text-center text-sm-center text-md-start">
                <h1 className="font-noteworthy-light">401 - unauthorized</h1>
                <p>It seems like you are not currently logged in as a user.</p>
                <p>Try logging at <Link to="/login" className="font-noteworthy-bold text-decoration-none text-c-complementary">Login</Link>.</p>
                <p>Not a member yet? Please <Link to="/signup" className="font-noteworthy-bold text-decoration-none text-c-complementary">Signup</Link>.</p>

              </Col>
            </Row>
            <Footer />
          </div>
        </PageTemplate>
      }
    </>
  )
}

function mapStateToProps(STATE) {
  /**
   * `This is where component gets ALL its STATE connected from react-redux`
   * `Any required state must be destructured to use`const { subComponent, user } = STATE
   * `{...STATE}` or spread the whole thing
   */
  const { user, loggedIn, navigation, matches } = STATE
  return {
    loggedIn,
    user,
    navigation,
    matches
  }
}

export default connect(mapStateToProps)(User);
