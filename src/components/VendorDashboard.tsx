'use client';

import { Card, Col, Container, Row, Button, Table } from 'react-bootstrap';

type Vendor = {
  id: number;
  name: string;
  location: string | null;
  cuisine: string[];
  operatingHours: { [key: string]: { open: string; close: string } | null } | null;
};

type MenuItem = {
  id: number;
  name: string;
};

type VendorDashboardProps = {
  vendor: Vendor;
  menuItems: MenuItem[];
};

export default function VendorDashboard({ vendor, menuItems }: VendorDashboardProps) {
  const formatOperatingHours = (hours: any) => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return days.map((day) => {
      const dayFormatted = day.charAt(0).toUpperCase() + day.slice(1);
      if (!hours?.[day]) {
        return `${dayFormatted}: Closed`;
      }
      const { open, close } = hours[day];
      const formatTime = (time: string) => {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const [hours, minutes] = time.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;
        return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
      };
      return `${dayFormatted}: ${formatTime(open)} - ${formatTime(close)}`;
    });
  };

  const operatingHoursFormatted = formatOperatingHours(vendor.operatingHours);

  return (
    <Container id="vendor-page" fluid className="py-3">
      <Row>
        <Col>
          <h1>Vendor Dashboard</h1>
          <p className="text-muted">You&apos;re logged in as a Vendor</p>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Vendor Profile</Card.Title>
              <p>
                <strong>Name:</strong>
                {vendor.name}
              </p>
              <p>
                <strong>Location:</strong>
                {vendor.location || 'Not set'}
              </p>
              <p>
                <strong>Cuisines:</strong>
                {vendor.cuisine.join(', ') || 'None'}
              </p>
              <Card.Subtitle className="mt-3 mb-2">Operating Hours</Card.Subtitle>
              {operatingHoursFormatted.map((line, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <p key={index} className="mb-1">{line}</p>
              ))}
              <div className="mt-3">
                <a href="/vendor/update-info">
                  <Button variant="primary" className="me-2">
                    Update Profile
                  </Button>
                </a>
                <a href="/vendor/add-menu-item">
                  <Button variant="success">
                    Add Menu Item
                  </Button>
                </a>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>
                Menu Items (
                {menuItems.length}
                )
              </Card.Title>
              {menuItems.length > 0 ? (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>
                          <a href={`/vendor/edit/${item.id}`}>
                            <Button variant="outline-primary" size="sm">Edit</Button>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>No menu items yet. Add some to get started!</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
