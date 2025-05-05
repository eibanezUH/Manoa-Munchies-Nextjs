'use client';

import { Card, Col, Container, Row, Button, Table } from 'react-bootstrap';
import { useState } from 'react';

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
  description: string | null;
  price: number
  ingredients: string[];
  isSpecial: boolean;
  specialDays?: string[];
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

  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set()); // Track expanded rows
  const [expandAll] = useState(false); // Track whether all rows are expanded

  const toggleRow = (id: number) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id); // Collapse the row if it's already expanded
      } else {
        newSet.add(id); // Expand the row if it's not already expanded
      }
      return newSet;
    });
  };

  const handleShowAll = () => {
    setExpandedRows(new Set(menuItems.map((item) => item.id))); // Add all row IDs to the expanded set
  };

  const handleHideAll = () => {
    setExpandedRows(new Set()); // Clear expanded set
  };

  return (
    <Container
      id="vendor-page"
      fluid
      className="py-3"
      style={{
        backgroundColor: '#f1f2f4',
      }}
    >
      <Row className="mt-5 text-dark text-center">
        <h1><strong>Vendor Dashboard</strong></h1>
        <p className="text-dark ">You&apos;re logged in as a Vendor</p>
      </Row>
      <Row className="mb-4">
        <Col xs={12} md={3} className="d-flex justify-content-center">
          <Card
            className="shadow-sm p-4 rounded text-center align-items-center"
            style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
          >
            <Card.Body>
              <Card.Title className="pb-1"><h4><strong>Vendor Profile</strong></h4></Card.Title>
              <p>
                <strong>Name: </strong>
                {vendor.name}
              </p>
              <p>
                <strong>Location: </strong>
                {vendor.location || 'Not set'}
              </p>
              <p>
                <strong>Cuisines: </strong>
                {vendor.cuisine.join(', ') || 'None'}
              </p>
              <Card.Subtitle className="mt-3 mb-2"><strong>Operating Hours</strong></Card.Subtitle>
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
        <Col xs={12} md={9}>
          <Card>
            <Card.Body
              className="shadow-sm p-4 rounded text-center align-items-center"
              style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
            >
              <Card.Title className="mt-2 pb-2 text-dark text-center">
                <h4>
                  <strong>
                    Menu Items (
                    {menuItems.length}
                    )
                  </strong>
                </h4>
              </Card.Title>
              {menuItems.length > 0 ? (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>
                        <Row>
                          <Col className="mt-1">
                            <h5>Item</h5>
                          </Col>
                          <Col md={3} className="d-flex align-items-right justify-content-end gap-2">
                            <Button
                              variant="link"
                              href="#"
                              className="me-0"
                              onClick={(e) => {
                                e.preventDefault();
                                handleShowAll();
                              }}
                            >
                              Show all
                            </Button>
                            <Button
                              variant="link"
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handleHideAll();
                              }}
                            >
                              Hide all
                            </Button>
                          </Col>
                        </Row>
                      </th>
                      <th style={{ width: '250px' }}><h5>Actions</h5></th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems.map((item) => (
                      <tr key={item.id} onClick={() => toggleRow(item.id)} style={{ cursor: 'pointer' }}>
                        <td style={{ textAlign: 'left' }}>
                          <h5>{item.name}</h5>
                          {(expandAll || expandedRows.has(item.id)) && (
                            <div style={{ marginLeft: '20px' }}>
                              <strong>Description:</strong>
                              {' '}
                              {item.description || 'No description provided'}
                              <br />
                              <strong>Price:</strong>
                              {' '}
                              $
                              {item.price}
                              <br />
                              <strong>Ingredients:</strong>
                              {' '}
                              {item.ingredients.join(', ') || 'No ingredients provided'}
                              <br />
                              <strong>Special:</strong>
                              {' '}
                              {item.isSpecial ? 'Yes' : 'No'}
                              {item.isSpecial && item.specialDays && (
                                <div>
                                  <strong>Available Days:</strong>
                                  {' '}
                                  {item.specialDays.join(', ')}
                                </div>
                              )}
                            </div>
                          )}
                        </td>
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
