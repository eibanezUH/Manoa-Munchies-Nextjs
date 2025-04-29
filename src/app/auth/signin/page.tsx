/* eslint-disable no-promise-executor-return */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-else-return */

'use client';

import { signIn } from 'next-auth/react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useState } from 'react';

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const target = e.target as typeof e.target & {
        email: { value: string };
        password: { value: string };
      };
      const email = target.email.value.toLowerCase();
      const password = target.password.value;

      console.log('Submitting credentials:', { email, password });

      const result = await signIn('credentials', {
        callbackUrl: '/list',
        email,
        password,
        redirect: false,
      });

      console.log('Sign-in result:', result);

      if (result?.error) {
        console.error('Sign-in failed:', result.error);
        setError(result.error);
        return;
      }

      let attempts = 0;
      const maxAttempts = 20;
      const pollInterval = 200;

      const waitForSession = async () => {
        while (attempts < maxAttempts) {
          const sessionResponse = await fetch('/api/auth/session');
          const sessionData = await sessionResponse.json();
          console.log('Session poll attempt', attempts + 1, ':', sessionData);

          if (sessionData?.user?.randomKey) { // Revert to randomKey
            console.log('User randomKey:', sessionData.user.randomKey);
            if (sessionData.user.randomKey === 'ADMIN') {
              console.log('Redirecting to admin page...');
              window.location.href = '/admin';
            } else if (sessionData.user.randomKey === 'VENDOR') {
              console.log('Redirecting to vendor page...');
              window.location.href = '/vendor';
            } else if (sessionData.user.randomKey === 'USER') {
              console.log('Redirecting to user page...');
              window.location.href = '/user';
            } else {
              console.log('Unknown role, redirecting to list...');
              window.location.href = '/list';
            }
            return;
          } else {
            console.log('Session data missing user randomKey:', sessionData);
          }

          attempts++;
          await new Promise((resolve) => setTimeout(resolve, pollInterval));
        }

        console.error('Session not available after', maxAttempts, 'attempts');
        setError('Failed to establish session. Please try again.');
      };

      await waitForSession();
    } catch (err) {
      console.error('Sign-in error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <Container>
        <Row className="justify-content-center">
          <Col xs={5}>
            <h1 className="text-center">Sign In</h1>
            <Card>
              <Card.Body>
                {error && <div className="alert alert-danger">{error}</div>}
                <Form method="post" onSubmit={handleSubmit}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control name="email" type="email" placeholder="Enter email" />
                  </Form.Group>
                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control name="password" type="password" placeholder="Password" />
                  </Form.Group>
                  <Button type="submit" className="mt-3" disabled={isSubmitting}>
                    {isSubmitting ? 'Signing in...' : 'Signin'}
                  </Button>
                </Form>
              </Card.Body>
              <Card.Footer>
                Don&apos;t have an account?
                <a href="/auth/signup">Sign up</a>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default SignIn;
