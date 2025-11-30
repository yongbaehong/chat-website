import { Container } from 'react-bootstrap'
import './PageTemplate.css'

function PageTemplate({ children,  ...props}) {
  return (
    <Container fluid={true} className="g-0 PageTemplate fade-in">
      {children}
    </Container>
  )
}

export default PageTemplate
