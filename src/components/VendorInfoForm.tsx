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
    <Container
      fluid
      className="align-items-center justify-content-center py-3"
      style={{
        minHeight: '100vh',
        backgroundImage:
          "url('https://www.hawaii.edu/wp/wp-content/uploads/2021/04/Manoa4.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Row className="mt-4 pb-4 justify-content-center">
        <Col xs={8}>
          <Card className="p-4 shadow-sm rounded" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
            <Card.Body>
              <h2 className="text-center">Update Vendor Profile</h2>
              <Form action={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label><strong>Name</strong></Form.Label>
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
                  <Form.Control
                    type="text"
                    name="location"
                    defaultValue={vendor.location || ''}
                    placeholder="Enter location"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label><strong>Cuisines (comma-separated)</strong></Form.Label>
                  <Form.Control
                    type="text"
                    name="cuisine"
                    defaultValue={vendor.cuisine.join(', ')}
                    placeholder="e.g., Italian, Mexican"
                  />
                </Form.Group>

                <Form.Group className="mb-1">
                  <Form.Label><strong>Operating Hours</strong></Form.Label>
                  <Row className="mb-0">
                    <Col xs={2}>
                      <Form.Label className="text-center"> </Form.Label>
                    </Col>
                    <Col xs={4}>
                      <Form.Label className="text-center">Start Time</Form.Label>
                    </Col>
                    <Col xs={4}>
                      <Form.Label className="text-center">End Time</Form.Label>
                    </Col>
                  </Row>
                  {days.map((day) => (
                    <Row key={day} className="mb-2">
                      <Col xs={2} className="mt-2">
                        <Form.Label className="text-center">{day.charAt(0).toUpperCase() + day.slice(1)}</Form.Label>
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

                <div className="d-flex justify-content-center mx-auto mt-5 gap-5">
                  <Button
                    type="submit"
                    variant="primary"
                    style={{ width: '150px' }}
                  >
                    Update Profile
                  </Button>
                  <Button
                    href="/vendor"
                    variant="secondary"
                    style={{ width: '150px' }}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
