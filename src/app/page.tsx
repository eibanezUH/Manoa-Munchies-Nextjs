'use client';

import { Container, Row, Col, Card, Button, Carousel, Image } from 'react-bootstrap';
import Link from 'next/link'; // Next.js Link for navigation
import './landingpage.css';
import { useSession } from 'next-auth/react'; // For session management

const LandingPage = () => {
  const { data: session } = useSession();
  return (
    <main>
      {/* Hero Section with Background Image */}
      <section
        className="hero-section"
        style={{
          background: "url('/landing.png') center/cover no-repeat",
          height: '400px',
          position: 'relative',
          color: '#fff',
        }}
      >
        {/* Dark overlay for text readability */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        />
        <Container
          style={{
            position: 'relative',
            zIndex: 2,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <Row>
            <Col>
              <h1>Welcome to Campus Cravings</h1>
              <p>Discover the best dining options on UH Campus</p>
              {/* Get Started Button linking to the sign in page */}
              {!session && (
                <Link href="/auth/signin" passHref>
                  <Button variant="primary">Login/Signup</Button>
                </Link>
              )}
            </Col>
          </Row>
        </Container>
      </section>

      {/* Tutorial / How-To Section */}
      <Container
        fluid
        className="py-5"
        style={{ backgroundColor: '#f1f2f4' }}
      >
        <Row className="mb-4">
          <Col>
            <h2>How to Access and Use the Website</h2>
          </Col>
        </Row>

        {/* Instruction Cards (with no hover effect) */}
        <Row className="mb-4">
          <Col xs={12} md={4}>
            <Card className="h-100 shadow-sm mb-3 no-hover">
              <Card.Body>
                <Card.Title>Step 1</Card.Title>
                <Card.Text>
                  <strong>Login to your account:</strong>
                  {' '}
                  Access the full website by logging in. If not registered, create an account.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={4}>
            <Card className="h-100 shadow-sm mb-3 no-hover">
              <Card.Body>
                <Card.Title>Step 2</Card.Title>
                <Card.Text>
                  <strong>Update your profile:</strong>
                  {' '}
                  After logging in, go to your user profile and add your favorite cuisine and dietary preferences.
                  This will recommend the best matching vendor to the user.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={4}>
            <Card className="h-100 shadow-sm mb-3 no-hover">
              <Card.Body>
                <Card.Title>Step 3</Card.Title>
                <Card.Text>
                  <strong>Browse open locations:</strong>
                  {' '}
                  In the home page, browse the currently open locations to see what is available right now.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Carousel Image Section */}
      <div style={{ backgroundColor: '#f1f2f4' }}>
        <Container className="px-5">
          <Carousel>
            <Carousel.Item interval={3000}>
              <Image
                className="d-block w-100"
                src="/carousel1.jpg"
                alt="Discover Local Eats"
              />
              <Carousel.Caption>
                <h3 style={{ color: 'white' }}>Discover Local Favorites</h3>
                <p>Explore a curated selection of the most-loved menu items around you.</p>
              </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item interval={3000}>
              <Image
                className="d-block w-100"
                src="/carousel2.jpg"
                alt="Personalized Menus"
              />
              <Carousel.Caption>
                <h3 style={{ color: 'white' }}>Hand-Picked For You</h3>
                <p>See menu options recommended just for you based on your preferences.</p>
              </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item interval={3000}>
              <Image
                className="d-block w-100"
                src="/carousel3.jpg"
                alt="Explore New Vendors"
              />
              <Carousel.Caption>
                <h3 style={{ color: 'white' }}>Explore New Vendors</h3>
                <p>Connect with hidden gems and local spots you haven’t tried yet.</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </Container>
      </div>

    </main>
  );
};

export default LandingPage;
