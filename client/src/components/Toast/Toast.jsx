import { Col, Toast } from 'react-bootstrap'
import './Toast.css'
function ToastAlert({ toast, setToast, toastMsg }) {

  return (
    <Col xs={{ span: 12, offset: 0 }} sm={{ span: 8, offset: 2 }} md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }} className="bg-warning bg-gradient mt-1 fixed-top">
      <Toast show={toast} onClose={() => setToast()} className="ToastAlert">
        <Toast.Header className="d-flex justify-content-between">
          <strong className="mr-auto fs-6"><i className="fa fa-exclamation-triangle"></i>&nbsp; What went wrong?</strong>
        </Toast.Header>
        <Toast.Body className="fs-6">{toastMsg}</Toast.Body>
      </Toast>
    </Col>
  )
}

export default ToastAlert
