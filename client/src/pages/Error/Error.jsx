import { Row, Col, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PageTemplate from '../../components/PageTemplate/PageTemplate';
import Footer from '../../components/Footer/Footer';

function Error404() {
  return (
    <PageTemplate>
      <div className="container vh-100 d-flex flex-column justify-content-center">
        <Row className="g-0">
          <Col xs={12} md={6} className="text-center">
            <Image src="/whoops.svg" alt="whoops" width="250" fluid />
          </Col>

          <Col xs={12} md={{ offset: 1, span: 4 }} className="d-flex flex-column justify-content-center mt-5 mt-sm-5 text-center text-sm-center text-md-start">
            <h1 className="font-noteworthy-light">404</h1>
            <p>We could not find the page you requested.</p>
            <p>Try going back to <Link to="/user/SETTINGS_DASHBOARD" className="font-noteworthy-light text-decoration-none text-c-complementary">Dashboard</Link> or <Link to="/" className="font-noteworthy-light text-decoration-none text-c-complementary">Home</Link>.</p>

          </Col>
        </Row>
        <Footer />
      </div>
    </PageTemplate>
  )
}

export default Error404;
