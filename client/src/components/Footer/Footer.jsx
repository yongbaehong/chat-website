import { Row, Col } from 'react-bootstrap'
import './Footer.css';

function Footer() {
  return (
    <footer className="border-top pt-5 mb-5 mt-5">
      <Row className="g-0 h-100">
        <Col className="d-flex flex-column">
          <h3 className="font-noteworthy-light text-center socials-header mb-4"><span>Socials</span></h3>
          <div className="d-flex justify-content-evenly">
            <div className="text-center">
              <i role="button" className="fab fs-2 fa-facebook-square"></i>
              <p className="text-center"><span role="button">Facebook</span></p>
            </div>
            <div className="text-center">
              <i role="button" className="fab fs-2 fa-linkedin"></i>
              <p className="text-center"><span role="button">LinkedIn</span></p>
            </div>
            <div className="text-center">
              <i role="button" className="fab fs-2 fa-twitter-square"></i>
              <p className="text-center"><span role="button">Twitter</span></p>
            </div>
            <div className="text-center">
              <i role="button" className="fab fs-2 fa-instagram-square"></i>
              <p className="text-center"><span role="button">Instagram</span></p>
            </div>
          </div>
        </Col>
      </Row>
      <div className="text-center">Copyright 2023</div>
    </footer>
  )
}

export default Footer;