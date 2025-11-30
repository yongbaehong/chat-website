import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col, Image } from 'react-bootstrap';
import ToastAlert from '../../../components/Toast/Toast'
import { updateUser } from '../actions/actions'
import { status, responseParser } from '../../../util/fetchHandler'
import { connect } from 'react-redux'
import './Profile.css'

function Profile({ ...props }) {
  const navigate = useNavigate()
  const [alert, setAlert] = useState(false)
  const [alertMsg, setAlertMsg] = useState('')
  const [showConfirmInput, setShowConfirmInput] = useState(false)

  const updateAvatar = (evt) => {
    evt.preventDefault()
    const body = new FormData();
    body.append('photo', evt.currentTarget.avatar.files[0])
    // turn this fetch into an action.
    fetch(`/api/user/${props.user._id}/avatar`, {
      method: 'PUT',
      body
    })
      .then(status)
      .then(responseParser)
      .then((data) => {
        props.dispatch(updateUser(data))
      })
      .catch((err) => {
        setAlertMsg(err.message)
        setAlert(true)
      })
  }

  const showConfirmForm = (evt) => {
    setShowConfirmInput(curr => !curr)
  }

  const confirmDeleteAccount = (evt) => {
    evt.preventDefault();
    const password1 = evt.target.password1.value
    const password2 = evt.target.password2.value
    if (password1 !== password2) {
      setAlertMsg("Your passwords did not match up or is incorrect. Please try again.")
      setAlert(true)
    }
    if (password1 === password2) {
      let payload = {
        username: props.user.username,
        password: password1
      }

      fetch(`/delete-user`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(status)
        .then(responseParser)
        .then((data) => {
          navigate('/')
        }).catch(err => {
          setAlertMsg(err.message)
          setAlert(true)
        })

    }
  }


  return (
    <div className="fade-in Profile-container">
    <h1 className="text-center font-noteworthy-light">Profile</h1>
      <ToastAlert toast={alert} setToast={() => setAlert(false)} toastMsg={alertMsg} />
      <Row className="text-center justify-content-center align-items-center g-0">
        <Col xs={12} sm={11} md={11} lg={3}>
          <h1>{props.user.username}</h1>
          <h2 className="font-noteworthy-light">Public Avatar</h2>
          <p>You can change your photo here.</p>
        </Col>
        <Col xs={11} sm={11} md={11} lg={3}>
          <Image
            className="img-clip-circle"
            src={`/user-photos/${props.user._id}/${props.user.avatar}`}
            alt="avatar-photo"
            width="200"
          />
        </Col>
        <Col xs={11} sm={6} md={5} lg={3} >
          <Form className="text-center" onSubmit={updateAvatar}>
            <Form.Group>
              <Form.Control type="file" name="avatar" id="avatar" label="Example file input" accept="image/*" />
            </Form.Group>
            <Button className="mt-2" type="submit">Set New Avatar Photo</Button>
          </Form>
        </Col>
      </Row>

      <Row className="g-0 text-center border-top mt-5">
        <Col xs={12}>
          <h2 className="mt-3 font-noteworthy-light">Delete Account</h2>
          {!showConfirmInput
            ? <Button variant="danger" onClick={showConfirmForm}>Delete Account</Button>
            : null}
          {showConfirmInput ?
            <div className="fade-in text-center d-flex flex-column justify-content-center align-items-center">
              <h2>Confirm password</h2>
              <Form className="d-flex flex-column" onSubmit={confirmDeleteAccount}>
                <Form.Group className="">
                  <Form.Control className="my-3" type="text" placeholder="Enter password" name="password1" />
                  <Form.Control className="my-3" type="password" placeholder="Confirm password" name="password2" />
                </Form.Group>
                <div>
                  <input type="submit" className="btn btn-sm btn-success me-2" value="Confirm" />
                  <input type="button" className="btn btn-sm btn-warning ms-2" value="Cancel" onClick={showConfirmForm} />
                </div>
              </Form>
            </div>
            : null}
        </Col>
      </Row>

    </div>
  )
}

const mapStateToProps = STATE => {
  return {
    ...STATE
  }
}
export default connect(mapStateToProps)(Profile);