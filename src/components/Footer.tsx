import { Container, Row, Col, Image } from 'react-bootstrap';
import '../app/footer.css';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
  <footer className="mt-auto py-3 bg-dark">
    <Container>
      <Row className="text-white">
        <Col>
          <Image
            src="/uhm-white-seal-nameplate.png" // placeholder for Manoa Munchies Logo
            alt="University of Hawaii Logo"
            width={300}
            height={100}
          />
        </Col>
        <Col>
          <h5 style={{ color: 'white' }}>Address:</h5>
          <p>2500 Campus Road, Honolulu, HI 96822</p>
        </Col>
        <Col>
          <h5 style={{ color: 'white' }}>Contact Us:</h5>
          <p>
            email: admin@foo.com
            <br />
            phone: (808)111-1111
          </p>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
