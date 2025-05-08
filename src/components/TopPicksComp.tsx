'use client';

import { useState } from 'react';
import { Card, Col, Container, Form, Row, Button, Collapse, Modal } from 'react-bootstrap';

type TopPicksData = {
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
    email?: string;
    phoneNumber?: string;
    location?: string;
    operatingHours?: Record<string, string>;
  };
};

type TopPicksProps = {
  menuItems: TopPicksData[];
  userPreferences: string[];
  userAversions: string[];
};

export default function TopPicksBoard({
  menuItems,
  userPreferences = [],
  userAversions = [],
}: TopPicksProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openCardId, setOpenCardId] = useState<number | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<TopPicksData['vendor'] | null>(null);

  const normalizedPrefs = userPreferences.map((p) => p.toLowerCase());
  const normalizedAversions = userAversions.map((a) => a.toLowerCase());

  const today = new Date();
  const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = weekdayNames[today.getDay()];

  const topPickItems = menuItems.filter((item) => {
    const itemCuisines = item.cuisine.split(',').map((c) => c.trim().toLowerCase());
    const matchesPreference = itemCuisines.some((cuisine) => normalizedPrefs.includes(cuisine));
    const { isSpecial } = item;
    const isSpecialToday = isSpecial
    && item.specialDays?.map((day) => day.toLowerCase()).includes(todayName.toLowerCase());

    const hasAvertedIngredient = item.ingredients.some((ingredient) =>
      // eslint-disable-next-line implicit-arrow-linebreak
      normalizedAversions.includes(ingredient.toLowerCase()));

    if (isSpecial) {
      return matchesPreference && isSpecialToday && !hasAvertedIngredient;
    }

    return matchesPreference && !hasAvertedIngredient;
  });

  const filteredItems = topPickItems.filter((item) => {
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

  const openVendorModal = (vendor: TopPicksData['vendor']) => {
    setSelectedVendor(vendor);
    setShowModal(true);
  };
  return (
    <>
      <Container id="user-toppicks" fluid className="py-4">
        <Row className="text-center mb-4">
          <Col>
            <h1>Top Picks For You!</h1>
            <p className="text-muted">Explore hand-picked menu items</p>
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
              <Col key={item.id} xs={12} sm={6} md={4}>
                <Card className="h-100">
                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      <Button
                        variant="link"
                        className="p-0 m-0 align-baseline"
                        style={{ textDecoration: 'underline', color: '#198754' }}
                        onClick={() => openVendorModal(item.vendor)}
                      >
                        {item.vendor.name}
                      </Button>
                      {' • '}
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
              <p>No top picks available based on your preferences and aversions.</p>
            </Col>
          )}
        </Row>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedVendor?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedVendor?.email && (
            <p>
              <strong>Email:</strong>
              {selectedVendor.email}
            </p>
          )}
          {selectedVendor?.phoneNumber && (
          <p>
            <strong>Phone:</strong>
            {selectedVendor.phoneNumber}
          </p>
          )}
          {selectedVendor?.operatingHours && (
            <>
              <strong>Operating Hours:</strong>
              <br />
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => {
                const raw = selectedVendor.operatingHours?.[day.toLowerCase()];

                if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;

                const { open, close } = raw as { open: string; close: string };
                if (!open || !close) return null;

                const format12Hour = (t: string) => {
                  const [hour, min] = t.split(':');
                  let h = parseInt(hour, 10);
                  const ampm = h >= 12 ? 'PM' : 'AM';
                  h = h % 12 || 12;
                  return `${h}:${min} ${ampm}`;
                };

                return (
                  <div key={day}>
                    {day}
                    :
                    {format12Hour(open)}
                    -
                    {format12Hour(close)}
                  </div>
                );
              })}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
