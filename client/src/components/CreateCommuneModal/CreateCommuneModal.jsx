import { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import NavBottom_Icon from '../Nav/Icons/NavBottom_Icons'
function CreateCommuneModal({ createOneCommune, user }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function submitHandler(evt) {
    evt.preventDefault()
    let communeInfo = {
      owner: user._id,
      name: evt.currentTarget.name.value,
      address: {
        street: evt.currentTarget.street.value,
        city: evt.currentTarget.city.value,
        stateAbbr: evt.currentTarget.state.value,
        zipCode: evt.currentTarget.zip.value,
      },
    }
    createOneCommune('/api/communities', communeInfo)
    handleClose()
  }
  return (
    <>
      <NavBottom_Icon click={handleShow} defaultClass="Icon-box">
        <i className="Nav-icons bg-white rounded-pill fa fa-plus fs-5 NavMatches-Msg-comment" role="button" >
        </i>
        <span className="text-secondary">create</span>
      </NavBottom_Icon>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create your community</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter name" name="name" required />
            </Form.Group>

            <Form.Group controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control className="mb-2" type="text" name="street" placeholder="555 Gleichner Plain" required />
              <Form.Control className="mb-2" name="city" placeholder="city" required />
              <Row>
                <Col sm={12} md={6} lg={6}>
                  <Form.Control className="mb-2" name="state" placeholder="state" required />
                </Col>
                <Col sm={12} md={6} lg={6}>
                  <Form.Control className="mb-2" name="zip" placeholder="zip-code" required />
                </Col>
              </Row>
            </Form.Group>
            <Form.Group controlId="">
              <Form.Label>Main Portal</Form.Label>
              <Form.Control className="mb-2" name="portal" placeholder="www.your-portal.com (not required)" />
            </Form.Group>
            <Button variant="outline-dark" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );

}

export default CreateCommuneModal