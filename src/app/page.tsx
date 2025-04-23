// import { Col, Container, Image, Row } from 'react-bootstrap';

// /** The Home page. */
// const Home = () => (
//   <main>
//     <Container id="landing-page" fluid className="py-3">
//       <Row className="align-middle text-center">
//         <Col xs={4}>
//           <Image src="next.svg" width="150px" alt="" />
//         </Col>

//         <Col xs={8} className="d-flex flex-column justify-content-center">
//           <h1>Welcome to this template</h1>
//           <p>Now get to work and modify this app!</p>
//         </Col>
//       </Row>
//     </Container>
//   </main>
// );

// export default Home;

'use client';

import { Container, Row, Col, Card, Button, Carousel, Image } from 'react-bootstrap';
import Link from 'next/link'; // Next.js Link for navigation
import './landingpage.css';
import { useSession } from 'next-auth/react'; // For session management

const LandingPage = () => {
  const { data: session } = useSession();
  const currentUser = session?.user?.email;

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
              <h1>Welcome to Manoa Munchies</h1>
              <p>Discover the best dining options on UH Campus</p>
              {/* Get Started Button linking to the sign in page */}
              {session ? (
                (() => {
                  if (currentUser === 'USER') {
                    return (
                      <Link href="/user" passHref>
                        <Button variant="primary">View Menu</Button>
                      </Link>
                    );
                  } if (currentUser === 'ADMIN') {
                    return (
                      <Link href="/admin" passHref>
                        <Button variant="primary">Go to Dashboard</Button>
                      </Link>
                    );
                  }
                  return (
                    <Link href="/vendor" passHref>
                      <Button variant="primary">Go to Dashboard</Button>
                    </Link>
                  );
                })()
              ) : (
                <Link href="/auth/signin" passHref>
                  <Button variant="primary">Login/Signup</Button>
                </Link>
              )}
            </Col>
          </Row>
        </Container>
      </section>

      {/* Carousel Image Section */}
      <Container>
        <Carousel>
          <Carousel.Item interval={3000}>
            <Image
              className="d-block w-100"
              src="/hotdog.jpg"
              alt="First slide"
            />
            <Carousel.Caption>
              <h3 style={{ color: 'white' }}>First slide label</h3>
              <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item interval={3000}>
            <Image
              className="d-block w-100"
              src="/curry.jpg"
              alt="Second slide"
            />
            <Carousel.Caption>
              <h3 style={{ color: 'white' }}>Second slide label</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item interval={3000}>
            <Image
              className="d-block w-100"
              src="/lasagna.jpg"
              alt="Third slide"
            />
            <Carousel.Caption>
              <h3 style={{ color: 'white' }}>Third slide label</h3>
              <p>
                Praesent commodo cursus magna, vel scelerisque nisl consectetur.
              </p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </Container>

      {/* Tutorial / How-To Section */}
      <Container fluid className="py-5">
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
    </main>
  );
};

export default LandingPage;
