'use client';

import { useState } from 'react';
import { Card, Col, Container, Form, Row, Button } from 'react-bootstrap';
import Link from 'next/link';

type MenuItemCardData = {
  id: number;
  name: string;
  description?: string | null;
  cuisine: string;
  ingredients: string[];
  isSpecial: boolean;
  specialDays?: string[];
  vendor: {
    id: number;
    name: string;
  };
};

type UserDashboardProps = {
  menuItems: MenuItemCardData[];
};

export default function UserDashboard({ menuItems }: UserDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = menuItems.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query)
      || item.vendor.name.toLowerCase().includes(query)
      || item.cuisine.toLowerCase().includes(query)
      || item.ingredients.some((ingredient) => ingredient.toLowerCase().includes(query))
    );
  });

  return (
    <Container id="user-dashboard" fluid className="py-4">
      {/* Centered Title and Subtitle */}
      <Row className="text-center mb-4">
        <Col>
          <h1>Food Available Right Now!</h1>
          <p className="text-muted">Explore available menu items</p>
          <Link href="/user/toppicks" passHref>
            <Button variant="success">View Top Picks</Button>
          </Link>
        </Col>
      </Row>

      {/* Centered Search Bar */}
      <Row className="mb-4 justify-content-center">
        <Col xs={12} md={6}>
          <Form.Control
            type="text"
            placeholder="Search by name, vendor, cuisine, or ingredient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
      </Row>
      {/* Left-aligned Responsive Cards */}
      <Row className="g-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <Col key={item.id} md={4}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {item.vendor.name}
                    •
                    {item.cuisine}
                    {item.isSpecial && (
                    <span className="badge bg-warning text-dark ms-2">Special</span>
                    )}
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>Description:</strong>
                    <br />
                    {item.description || 'No description provided.'}
                  </Card.Text>
                  <Card.Text>
                    <strong>Ingredients:</strong>
                    <br />
                    {item.ingredients.join(', ')}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <p>No matching menu items found.</p>
          </Col>
        )}
      </Row>
    </Container>
  );
}
