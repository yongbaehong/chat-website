import { useEffect } from 'react';
import { Image, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PageTemplate from '../../components/PageTemplate/PageTemplate'
import TestimonialCard from './TestimonialCard/TestimonialCard'
import Footer from '../../components/Footer/Footer'
import { fetchUser } from '../User/actions/actions'
import './Main.css'

function Main({ ...props }) {
  if (!props.user.loggedIn) {
    useEffect(() => {
      props.dispatch(fetchUser('/api/user'))
    }, [])
  }

  return (
    <>
      <PageTemplate {...props}>
        {/* HERO */}
        <Row className="Main-hero g-0">
          <Col xs={12} md={{ span: 2, offset: 1 }} className="text-light d-flex flex-column align-items-center">
            <Image
              className="pt-5 Main-hero-logo"
              src="/commune5.svg"
              alt="logo"
            />
          </Col>
          <Col xs={12} md={9} className="d-flex flex-column align-items-center">
            <div className="p-5 text-center">
              <h1 className="display-1 text-md-start">Meet. Chat. Be a Community.</h1>
              <h2 className="text-md-start">Be a community with anyone in the world!</h2>
            </div>

            <div className="w-100 d-flex flex-row justify-content-evenly">
              <Link to="/login" className="Main-link text-decoration-none my-btn my-btn--primary me-2">Login</Link>
              <Link to="/signup" className="Main-link text-decoration-none my-btn my-btn--complementary-400 ms-2">Join</Link>
            </div>
          </Col>
        </Row>

        {/* FEATURES */}
        <section className="feature-section py-5 py-sm-0 border-top border-bottom">
        <h1 className="text-center mt-5"><span className="font-noteworthy-light">Features</span></h1>
          <Row className="mb-4 pb-3 g-0 pt-5">
            <Col md={{ span: 6, offset: 1 }} className="align-self-center">
              <Row className="g-0 justify-content-center">
                <Col md={{ span: 5 }} className="">
                  <Image
                    src="#"
                    className="feature-imgs"
                  />
                </Col>
                <Col md={{ span: 6 }} className="d-flex justify-content-center justify-content-md-start align-items-center text-sm-center order-first order-md-1 order-lg-1">
                  <span className="text-md-start text-c-complementary font-noteworthy-light fs-2">Join Chat Rooms.</span>
                </Col>
              </Row>
            </Col>
            <Col md={4} className="p-3 fs-4 align-self-center text-center text-sm-center text-md-start">Chat with a community with common interests.</Col>

          </Row>
          {/* <div className="text-center d-flex justify-content-center">
            <hr className="w-25 text-center"/>
          </div> */}
          <Row className="mb-4 pb-3 g-0 pt-3 ">
            <Col md={{ span: 4, offset: 1 }} className="fs-4 p-3 text-center text-sm-center text-md-end order-last align-self-center">
              Chat with individuals you meet in a community, or search for someone.
            </Col>
            <Col md={{ span: 6, offset: 0 }} className="align-self-center order-md-last">
              <Row className="g-0 justify-content-center">
                <Col md={{ span: 6 }} className="d-flex justify-content-center justify-content-md-end align-items-center order-sm-first order-md-first order-lg-first Blurb-word">
                  <span className="text-md-end text-c-complementary font-noteworthy-light fs-2">Chat One on One</span>
                </Col>
                <Col md={{ span: 5 }} className="Blurb-img1" >
                  <Image
                    src="./Dm.svg"
                    className="feature-imgs"
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </section>

        {/* TESTIMONIALS */}
        <section className="Testimonials">
          <h1 className="text-center mt-5"><span className="font-noteworthy-light">Testimonials</span></h1>
          {/* Row-1 */}
          <Row className="g-0 justify-content-evenly pt-5">
            <TestimonialCard text="The entreprenuer community have inspired me to go out there and be my own BOSS." title="Eva" src="#"/>
            <TestimonialCard text="Ahoy! I found my ship-mates and we chat about sailing the amazing Greek islands." title="Jack" src="#"/>
            <TestimonialCard text="I can chat with people who have the same interests as me, and share our thoughts." title="Nicole" src="#"/>
          </Row>

          {/* Row 2 */}
          <Row className="g-0 justify-content-evenly pt-md-5 pt-sm-0">
            <TestimonialCard text="I was able to find people who understood some of the things that I was going through." title="Brian" src="#"/>
            <TestimonialCard text="There are so many people who enjoy fashion and style like I do." title="Jasmina" src="#"/>
            <TestimonialCard text="I like to make custom art with my hands, and collaborate with others." title="Big Mike" src="#"/>
          </Row>

        </section>

        <Footer/>
      </PageTemplate>
    </>
  )
}

function mapStateToProps(STATE) {
  /**
   * `This is where component gets ALL its STATE connected from react-redux`
   * `Any required state must be destructured to use`const { subComponent, user } = STATE
   * `{...STATE}` or spread the whole thing
   */

  return {
    ...STATE
  }
}

export default connect(mapStateToProps)(Main);
