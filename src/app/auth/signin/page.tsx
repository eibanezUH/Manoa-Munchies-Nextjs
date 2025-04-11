'use client';

import { signIn } from 'next-auth/react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';

/** The sign in page. */
const SignIn = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    const email = target.email.value;
    const password = target.password.value;

    // Attempt sign-in
    console.log('Signing in with:', { email, password });
    const result = await signIn('credentials', {
      callbackUrl: '/list', // This can be overridden after we get the role from the session
      email,
      password,
      redirect: false, // Prevent automatic redirect
    });

    if (result?.error) {
      console.error('Sign in failed: ', result.error);
    } else {
      // Fetch session data to determine the role of the logged-in user
      const session = await fetch('/api/auth/session');
      const sessionData = await session.json();

      console.log('Session data:', sessionData);

      if (sessionData?.user?.randomKey) {
        // Debugging the user role
        console.log('User role (randomKey):', sessionData.user.randomKey);

        // Role-based redirection after login
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
      } else {
        console.error('Session data does not contain a valid user role.');
      }
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
                <Form method="post" onSubmit={handleSubmit}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <input name="email" type="text" className="form-control" />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <input name="password" type="password" className="form-control" />
                  </Form.Group>
                  <Button type="submit" className="mt-3">
                    Signin
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
