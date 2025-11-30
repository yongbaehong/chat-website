import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Form, Button, Row, Col } from 'react-bootstrap'
import Select from 'react-select'
import PageTemplate from '../../components/PageTemplate/PageTemplate'
import ToastAlert from '../../components/Toast/Toast'
import { status, responseParser } from '../../util/fetchHandler'
import { loggedInStatus } from '../User/actions/actions'
import './SignupLogin.css'

function SignupLogin({ loggedIn, setLoginStatus }) {
  const [alert, setAlert] = useState(false)
  const [alertMsg, setAlertMsg] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ]
  const ageChange = (evt) => {
    const numbersOnly = /[0-9]/g
    if (!numbersOnly.test(evt.currentTarget.value)) {
      evt.currentTarget.value = ""
      setAlertMsg('Only numbers for age please.');
      setAlert(true)
    }
  }

  const submitHandler = (evt) => {
    evt.preventDefault();
    if (location.pathname === '/signup') {
      const body = new FormData()
      body.append('username', evt.currentTarget.username.value)
      body.append('password', evt.currentTarget.password.value)
      body.append('gender', evt.currentTarget.gender.value)
      body.append('age', evt.currentTarget.age.value)
      body.append('photo', evt.currentTarget.avatar.files[0])
      fetch('/signup', {
        method: 'POST',
        body
      }).then(status)
        .then(responseParser)
        .then((data) => {
          setLoginStatus(true)
          navigate(`/user/SETTINGS_DASHBOARD`)
        })
        .catch(err => {
          setAlert(true)
          setAlertMsg(err.message)
        })
    }
    if (location.pathname === '/login') {
      fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: evt.currentTarget.username.value,
          password: evt.currentTarget.password.value
        })
      }).then(status)
        .then(responseParser)
        .then((data) => {
          setLoginStatus(true)
          navigate(`/user/SETTINGS_DASHBOARD`)
        })
        .catch(err => {
          setAlert(true)
          setAlertMsg(err.message)
        })
    }
  }
  return (
    <PageTemplate user={{ loggedIn }}>
      <ToastAlert toast={alert} setToast={() => setAlert(false)} toastMsg={alertMsg} />
      <div className="d-flex justify-content-center align-items-center SignupLogin-wrapper bg-gradient">
        <Form id="Signup-Login-form" className="bg-light px-2 py-3 mx-2 border rounded overflow-hidden" onSubmit={submitHandler} encType="multipart/form-data">
          <h2 className="text-center">{(location.pathname === '/signup') ? 'Signup' : 'Login'}</h2>
          <div className="Signup-Group-container">
            <Form.Group controlId="username">
              <Form.Label className="fs-6">Username</Form.Label>
              <Form.Control type="text" placeholder="Username" name="username" required />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label className="fs-6">Password</Form.Label>
              <Form.Control type="password" placeholder="Password" name="password" required />
            </Form.Group>

            {location.pathname === '/signup' &&
              <>
                <Row>
                  <Col xs={6}>
                    <Form.Group controlId="gender">
                      <Form.Label className="fs-6">Gender</Form.Label>
                      <Select
                        name="gender"
                        defaultValue={genderOptions[2]}
                        placeholder="Male/Female"
                        options={genderOptions}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={6}>
                    <Form.Group controlId="age">
                      <Form.Label className="fs-6">Age</Form.Label>
                      <Form.Control onChange={ageChange} type="number" min="18" max="130" name="age" placeholder="18+" required />
                    </Form.Group>
                  </Col>

                </Row>

                <Form.Group>
                  <Form.Label className="fs-6">Choose a photo for Profile</Form.Label>
                  <Form.Control type="file" name="avatar" id="avatar" label="Example file input" accept="image/*" />
                </Form.Group>
              </>
            }
            <Button variant="secondary" type="submit" className="lh-base mt-2 w-100 px-3" size="sm">
              <span className="mb-2">{(location.pathname === '/signup') ? 'Join Now' : 'Login'}</span> <i className="fa fa-chevron-right"></i>
            </Button>
            <section className="d-flex justify-content-evenly">
              <Link className="btn border mt-2" to={(location.pathname === '/signup') ? '/login' : '/signup'}>{(location.pathname === '/signup') ? 'Login' : 'Signup'}</Link>
              <Link className="btn border mt-2" to="/">Home</Link>
            </section>
          </div>
        </Form>
      </div>
    </PageTemplate>
  )
}

const mapStateToProps = STATE => {
  const { loggedIn } = STATE
  return {
    loggedIn
  }
}
// passing single action must be wrapped in an Object
export default connect(mapStateToProps, { setLoginStatus: loggedInStatus })(SignupLogin);
