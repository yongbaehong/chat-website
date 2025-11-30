import { Card } from 'react-bootstrap'
import './TestimonialCard.css';

function TestimonialCard({ text, title, src }) {
  return (
    <Card className="Main-testimonial-cards my-3" >
      <Card.Img variant="top" src={src} />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>
          {text}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

export default TestimonialCard;