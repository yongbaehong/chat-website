import { Link, useParams } from 'react-router-dom'
import { Row, Col, Image } from 'react-bootstrap'
import './Dashboard.css'
function Dashboard({ ...props }) {
  return (
    <div className="fade-in">
      <h1 id="Dashboard-title" className="text-center font-noteworthy-light">Dashboard</h1>

      <Row className="g-0 p-2 justify-content-center">
        <Col sm={12} md={6} lg={4} className="box-shadow my-1">
          <Link to={`/user/SETTINGS_COMMUNITY`} className="w-100 d-flex align-items-center text-decoration-none">
            <Image
              className="Dashboard-image m-2 Dashboard-image-normalize rounded"
              src="#"
              alt="concert"
              fluid
            />
            <div className="Dashboard-text">
              <h3 className="text-uppercase text-dark">Community</h3>
              <p className="text-secondary text-capitalize">Commune with your people today!</p>
            </div>
          </Link>
        </Col>
        <Col sm={12} md={6} lg={4} className="box-shadow my-1">
          <Link to={`/user/SETTINGS_MATCHES`} className="w-100 d-flex align-items-center text-decoration-none">
            <Image
              className="Dashboard-image m-2 Dashboard-image-normalize rounded"
              src="/Dm.svg"
              alt="matches"
              fluid
            />
            <div className="Dashboard-text">
              <h3 className="text-uppercase text-dark">Matches</h3>
              <p className="text-secondary text-capitalize">Find someone with common interest and chat.</p>
            </div>
          </Link>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard