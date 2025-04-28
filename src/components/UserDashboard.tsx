'use client';

import { useState } from 'react';
import { Card, Col, Container, Form, Row, Button, Collapse } from 'react-bootstrap';

type MenuItemData = {
  id: number;
  name: string;
  description?: string | null;
  cuisine: string;
  category: string;
  price: number;
  ingredients: string[];
  isSpecial: boolean;
  specialDays?: string[];
  vendor: {
    id: number;
    name: string;
  };
};

type AllFoodsProps = {
  menuItems: MenuItemData[];
};

export default function AllFoodsBoard({ menuItems }: AllFoodsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openCardId, setOpenCardId] = useState<number | null>(null);

  const today = new Date();
  const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = weekdayNames[today.getDay()];

  const visibleItems = menuItems.filter((item) => {
    if (item.isSpecial) {
      return item.specialDays?.map((day) => day.toLowerCase()).includes(todayName.toLowerCase());
    }
    return true; // Regular items always visible
  });

  const filteredItems = visibleItems.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query)
      || item.vendor.name.toLowerCase().includes(query)
      || item.cuisine.toLowerCase().includes(query)
      || item.category.toLowerCase().includes(query)
      || item.ingredients.some((ing) => ing.toLowerCase().includes(query))
    );
  });

  const toggleCollapse = (id: number) => {
    setOpenCardId(openCardId === id ? null : id);
  };

  return (
    <Container id="user-available" fluid className="py-4">
      <Row className="text-center mb-4">
        <Col>
          <h1>Foods Available Right Now</h1>
          <p className="text-muted">Discover all dishes served today!</p>
        </Col>
      </Row>

      <Row className="mb-4 justify-content-center">
        <Col xs={12} md={6}>
          <Form.Control
            type="text"
            placeholder="Search by name, vendor, cuisine, category, or ingredient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
      </Row>

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
                      <span className="badge bg-warning text-dark ms-2">
                        Special
                      </span>
                    )}
                  </Card.Subtitle>
                  <Card.Text className="mb-2">
                    <strong>Category:</strong>
                    {item.category}
                  </Card.Text>
                  <Card.Text className="mb-2">
                    <strong>Price:</strong>
                    $
                    {item.price.toFixed(2)}
                  </Card.Text>

                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => toggleCollapse(item.id)}
                    aria-controls={`collapse-${item.id}`}
                    aria-expanded={openCardId === item.id}
                    className="mt-2"
                  >
                    {openCardId === item.id ? 'Hide Details' : 'View Details'}
                  </Button>

                  <Collapse in={openCardId === item.id}>
                    <div id={`collapse-${item.id}`} className="pt-3">
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
                    </div>
                  </Collapse>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <p>No menu items found matching your search today.</p>
          </Col>
        )}
      </Row>
    </Container>
  );
}
