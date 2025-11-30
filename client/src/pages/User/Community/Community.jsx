import { useEffect } from 'react'
import { useNavigate, } from 'react-router-dom'
import { Row, Col, Spinner } from 'react-bootstrap'
import { connect } from 'react-redux'
import SearchBar from '../../../components/SearchBar/SearchBar'
import ToastAlert from '../../../components/Toast/Toast'
import { fetchCommunes, dismissAlert, searchBar } from './actions'
import { fetchOneCommune } from '../../Commune/actions/action'
import './Community.css'

function Community({ communes, user, getOneCommune, allCommunes, dismissAlertMsg, getSearchResults }) {
  const navigate = useNavigate()
  const showCommune = id => async () => {
    await getOneCommune(id)
    await navigate(`/user/SETTINGS_COMMUNE`)
  }

  useEffect(()=>{
    allCommunes('/api/communities/all')
  },[])

  return (
    <div className="fade-in">
      <Row className="g-0 px-2">
        <Col xs={{ span: 12, offset: 0 }} sm={{ span: 8, offset: 2 }} md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }} className="mt-1">
          <SearchBar communes={communes} getSearchResults={getSearchResults}/>
        </Col>
        <ToastAlert toast={communes.err} setToast={dismissAlertMsg} toastMsg={communes.errMsg} />
        <Col xs={{ span: 12, offset: 0 }} sm={{ span: 8, offset: 2 }} md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }} className="d-flex flex-column align-items-center">
          {communes.isLoading ? <><Spinner animation="border" variant="primary" /><span className="">Loading...</span></> : null}
        </Col>

      </Row>
      <Row className="g-0 p-2 justify-content-center align-items-center mb-5">
        {(Array.isArray(communes.all) && communes.all.length)
          ? communes.all.map((community, idx) => {
            return (
              <Col onClick={showCommune(community._id)} data-id={community._id} key={idx} sm={12} md={6} lg={3} className="Commune-box-shadow d-flex flex-column p-3 mb-2">
                <div>
                  <span className="fs-4">{community.name}{community.owner === user._id ? <><span className="fs-6 text-secondary">&nbsp;(Owner)</span></> : ""}</span>
                </div>
                <div>{community?.address?.city}</div>
              </Col>
            )
          })
          : <h3>No communities listed</h3>}
      </Row>
    </div>)
}

// Map cummune property to Community component so that it's available on updates
const mapStateToProps = STATE => {
  const { communes, user, loggedIn } = STATE;
  return {
    communes,
    loggedIn,
    user,
  }
}

const mapDispatchToProps = dispatch => ({
  allCommunes() {
    dispatch(fetchCommunes('/api/communities/all'))
  },
  dismissAlertMsg() {
    dispatch(dismissAlert())
  },
  getOneCommune(id) {
    dispatch(fetchOneCommune(id))
  },
  getSearchResults(url) {
    dispatch(searchBar(url))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Community);
