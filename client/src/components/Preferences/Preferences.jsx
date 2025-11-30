import { useRef, useState } from 'react'
import { Modal, Button, Form, Row, Col } from 'react-bootstrap'
import Select from 'react-select'
import { popoverMin, popoverMax, IconButtonOverLay } from '../../components/Popover/Popover'
import './Preferences.css'

function Preferences({ showPrefs, showPreferenceModal, user, prefFilter }) {
  const rangeMin = useRef(null)
  const rangeMax = useRef(null)
  const [rangeMinPopover, setRangeMinPopover] = useState(false)
  const [rangeMaxPopover, setRangeMaxPopover] = useState(false)
  const handleShow = (bool) => () => showPreferenceModal(bool)
  const handleMinRange = () => {
    if ((Number(rangeMin.current.value) + 1) >= Number(rangeMax.current.value)) {
      rangeMin.current.value = `${Number(rangeMax.current.value) - 1}`
    }
    if (Number(rangeMin.current.value) <= 18) {
      setRangeMinPopover(true)
      setTimeout(() => {
        setRangeMinPopover(false)
      }, 2000)
    }
    if (Number(rangeMin.current.value) > 18) {
      setRangeMinPopover(false)
    }
  }
  const handleMaxRange = () => {
    if ((Number(rangeMax.current.value) - 1) <= Number(rangeMin.current.value)) {
      rangeMax.current.value = `${Number(rangeMin.current.value) + 1}`
    }
    if (Number(rangeMax.current.value) >= 130) {
      setRangeMaxPopover(true)
      setTimeout(() => {
        setRangeMaxPopover(false)
      }, 2000)
    }
    if (Number(rangeMax.current.value) < 130) {
      setRangeMaxPopover(false)
    }
  }

  const filterChanges = (evt) => {
    evt.preventDefault()
    const genderOptions = Object.values(evt.currentTarget.gender)
    const filter = {
      age: { min: Number(rangeMin.current.value), max: Number(rangeMax.current.value) },
      gender: (evt.currentTarget.gender.length) > 1
        ? genderOptions.map((a) => a.value)
        : [evt.currentTarget.gender.value],
      user_id: user._id
    }

    prefFilter(`/api/preference/filter`, filter)
    showPreferenceModal(false)
  }
  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ]
  return (
    <>
      <Modal show={showPrefs} onHide={handleShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Preferences</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={filterChanges}>
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>Gender</Form.Label>
              <Select
                defaultValue={genderOptions}
                name="gender"
                options={genderOptions}
                isMulti
              />
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlSelect2" className="mt-3">
              <Form.Label className="fs-6">Age range:</Form.Label>
              <Row>
                <Col xs={4}>
                  <Form.Label className="fs-6">Min:</Form.Label>
                  <IconButtonOverLay
                    icon="fa fa-cube"
                    popover={popoverMin}
                    show={rangeMinPopover}
                  >
                    <Form.Control ref={rangeMin} type="number" min="18" max="129" defaultValue="18" onChange={handleMinRange} required step="1" />
                  </IconButtonOverLay>
                </Col>
                <Col xs={5}>
                  <Form.Label className="fs-6">Max:</Form.Label>
                  <IconButtonOverLay
                    icon="fa fa-cube"
                    popover={popoverMax}
                    show={rangeMaxPopover}
                  >
                    <Form.Control ref={rangeMax} type="number" min="19" max="130" defaultValue="30" onChange={handleMaxRange} required step="1" />
                  </IconButtonOverLay>
                </Col>
              </Row>

            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              Filter Changes
          </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Preferences