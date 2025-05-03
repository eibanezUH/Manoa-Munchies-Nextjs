/* eslint-disable max-len */

'use client';

import React from 'react';
import { signIn } from 'next-auth/react';
import {
  Container,
  Card,
  Form,
  Button,
  InputGroup,
} from 'react-bootstrap';
import { FaEnvelope, FaLock } from 'react-icons/fa';

/**
 * Redesigned Sign In page with a fun, modern UI and custom background image.
 */
const SignIn: React.FC = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    const email = target.email.value;
    const password = target.password.value;

    // Attempt sign-in
    const result = await signIn('credentials', {
      callbackUrl: '/list',
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      console.error('Sign in failed: ', result.error);
    } else {
      const sessionRes = await fetch('/api/auth/session');
      const sessionData = await sessionRes.json();

      const role = sessionData?.user?.randomKey;
      if (role === 'ADMIN') window.location.href = '/admin';
      else if (role === 'VENDOR') window.location.href = '/vendor';
      else if (role === 'USER') window.location.href = '/user';
      else window.location.href = '/list';
    }
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: '100vh',
        backgroundImage: "url('https://www.hawaii.edu/wp/wp-content/uploads/2021/04/Manoa4.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Card className="shadow-lg p-4 rounded" style={{ maxWidth: '400px', width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
        <Card.Body>
          <Card.Title className="text-center mb-4" style={{ fontSize: '1.75rem' }}>
            Welcome Back!
          </Card.Title>

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail" className="mb-3">
              <InputGroup>
                <InputGroup.Text>
                  <FaEnvelope />
                </InputGroup.Text>
                <Form.Control
                  name="email"
                  type="email"
                  placeholder="Email address"
                  required
                />
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-4">
              <InputGroup>
                <InputGroup.Text>
                  <FaLock />
                </InputGroup.Text>
                <Form.Control
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                />
              </InputGroup>
            </Form.Group>

            <Button type="submit" size="lg" className="w-100 mb-3">
              Sign In
            </Button>
          </Form>

          <div className="text-center">
            <span className="text-muted">Don&apos;t have an account? </span>
            <a href="/auth/signup">Sign up</a>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SignIn;
