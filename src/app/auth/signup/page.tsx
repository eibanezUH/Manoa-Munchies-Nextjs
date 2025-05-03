'use client';

import React from 'react';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {
  Container,
  Card,
  Form,
  Button,
  InputGroup,
} from 'react-bootstrap';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { createUser } from '@/lib/dbActions';

type SignUpForm = {
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUpPage: React.FC = () => {
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email is required')
      .email('Email is invalid'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(40, 'Password must not exceed 40 characters'),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password')], 'Passwords must match'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: SignUpForm) => {
    try {
      await createUser(data);
      await signIn('credentials', {
        callbackUrl: '/user',
        email: data.email,
        password: data.password,
      });
    } catch (err) {
      console.error('Signup error:', err);
    }
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
        className="shadow-lg p-4 rounded"
        style={{
          maxWidth: '450px',
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
        }}
      >
        <Card.Body>
          <Card.Title
            className="text-center mb-4"
            style={{ fontSize: '1.75rem' }}
          >
            Welcome!
          </Card.Title>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="formEmail" className="mb-3">
              <InputGroup>
                <InputGroup.Text>
                  <FaEnvelope />
                </InputGroup.Text>
                <Form.Control
                  type="email"
                  placeholder="Email address"
                  {...register('email')}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email?.message}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
              <InputGroup>
                <InputGroup.Text>
                  <FaLock />
                </InputGroup.Text>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  {...register('password')}
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password?.message}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="formConfirmPassword" className="mb-4">
              <InputGroup>
                <InputGroup.Text>
                  <FaLock />
                </InputGroup.Text>
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  {...register('confirmPassword')}
                  isInvalid={!!errors.confirmPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword?.message}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <div className="d-grid gap-2 mb-3">
              <Button type="submit" size="lg">
                Register
              </Button>
              <Button
                variant="outline-secondary"
                size="lg"
                onClick={() => reset()}
              >
                Reset
              </Button>
            </div>
          </Form>
        </Card.Body>
        <Card.Footer className="text-center">
          <span className="text-muted">Already have an account? </span>
          <a href="/auth/signin">Sign in</a>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default SignUpPage;
