// src/components/AddVendorForm.tsx
"use client";

import React from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';

type User = {
  id: number;
  email: string;
};

type AddVendorFormProps = {
  users: User[];
  handleSubmit: (formData: FormData) => Promise<void>;
};

export default function AddVendorForm({ users, handleSubmit }: AddVendorFormProps) {
  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Card>
            <Card.Body>
              <h2>Add Vendor</h2>
              <Form action={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Select User</Form.Label>
                  <Form.Select name="userEmail" required>
                    <option value="">Select a user</option>
                    {users.map(user => (
                      <option key={user.id} value={user.email}>
                        {user.email}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Vendor Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter vendor name"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone Number (Optional)</Form.Label>
                  <Form.Control
                    type="text"
                    name="phoneNumber"
                    placeholder="Enter phone number"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Address (Optional)</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    placeholder="Enter address"
                  />
                </Form.Group>

                <Button type="submit" variant="primary">
                  Create Vendor
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}