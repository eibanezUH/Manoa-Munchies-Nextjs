'use client';

import React from 'react';
import { signOut } from 'next-auth/react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { FaSignOutAlt, FaTimesCircle } from 'react-icons/fa';

/**
 * Sign Out confirmation page with consistent styled UI.
 */
const SignOut: React.FC = () => {
  const handleSignOut = () => {
    signOut({ callbackUrl: '/', redirect: true });
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: '100vh',
        backgroundImage:
          "url('https://www.hawaii.edu/wp/wp-content/uploads/2021/04/Manoa4.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Card
        className="shadow-lg p-4 rounded text-center"
        style={{ maxWidth: '400px', width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
      >
        <Card.Body>
          <Card.Title style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>
            Are you sure you want to sign out?
          </Card.Title>
          <Row className="justify-content-center g-2">
            <Col xs="auto">
              <Button
                variant="danger"
                size="lg"
                onClick={handleSignOut}
              >
                <FaSignOutAlt className="me-2" />
                Sign Out
              </Button>
            </Col>
            <Col xs="auto">
              <Button
                variant="outline-secondary"
                size="lg"
                href="/"
              >
                <FaTimesCircle className="me-2" />
                Cancel
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SignOut;
