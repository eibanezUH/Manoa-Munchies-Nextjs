'use client';

import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';

type Vendor = {
  id: number;
  name: string;
  location: string | null;
  cuisine: string[];
  operatingHours: { [key: string]: { open: string; close: string } | null } | null;
};

type VendorInfoFormProps = {
  vendor: Vendor;
  handleSubmit: (formData: FormData) => Promise<void>;
};

export default function VendorInfoForm({ vendor, handleSubmit }: VendorInfoFormProps) {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={8}>
          <Card>
            <Card.Body>
              <h2>Update Vendor Profile</h2>
              <Form action={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    defaultValue={vendor.name}
                    placeholder="Enter vendor name"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Select
                    name="location"
                    defaultValue={vendor.location || ''}
                    required
                  >
                    <option>Select a location</option>
                    <option value="Campus Center">Campus Center</option>
                    <option value="Paradise Palms Cafe">Paradise Palms Cafe</option>
                    <option value="Food Truck Row">Food Truck Row</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Cuisines (comma-separated)</Form.Label>
                  <Form.Control
                    type="text"
                    name="cuisine"
                    defaultValue={vendor.cuisine.join(', ')}
                    placeholder="e.g., Italian, Mexican"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Operating Hours</Form.Label>
                  {days.map((day) => (
                    <Row key={day} className="mb-2">
                      <Col xs={4}>
                        <Form.Label>{day.charAt(0).toUpperCase() + day.slice(1)}</Form.Label>
                      </Col>
                      <Col xs={4}>
                        <Form.Control
                          type="time"
                          name={`${day}-open`}
                          defaultValue={vendor.operatingHours?.[day]?.open || ''}
                        />
                      </Col>
                      <Col xs={4}>
                        <Form.Control
                          type="time"
                          name={`${day}-close`}
                          defaultValue={vendor.operatingHours?.[day]?.close || ''}
                        />
                      </Col>
                    </Row>
                  ))}
                </Form.Group>

                <Button type="submit" variant="primary">
                  Update Profile
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
