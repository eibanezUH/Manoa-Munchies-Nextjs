'use client';

import { useState } from 'react';
import { Card, Col, Container, Form, Row, Modal, Button } from 'react-bootstrap';
import Image from 'next/image';

type MenuItemCardData = {
  id: number;
  name: string;
  description?: string | null;
  cuisine: string;
  ingredients: string[];
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
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItemCardData | null>(null); // New state for selected item

  const filteredItems = menuItems.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query)
      || item.vendor.name.toLowerCase().includes(query)
      || item.cuisine.toLowerCase().includes(query)
      || item.ingredients.some((ingredient) => ingredient.toLowerCase().includes(query))
    );
  });

  const handleOpen = (item: MenuItemCardData) => {
    setSelectedItem(item); // Set the clicked item as the selected item
    setShowModal(true);
  };
  const handleClose = () => {
    setShowModal(false);
    setSelectedItem(null); // Clear the selected item when closing the modal
  };

  return (
    <Container id="user-dashboard" fluid className="py-4">
      {/* Centered Title and Subtitle */}
      <Row className="text-center mb-4">
        <Col>
          <h1>User Dashboard</h1>
          <p className="text-muted">Explore available menu items</p>
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
                  <Card.Title>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a href="#" onClick={() => handleOpen(item)}>
                      {item.name}
                    </a>
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {item.vendor.name}
                    •
                    {item.cuisine}
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

      {/* Modal */}
      {selectedItem && (
        <Modal show={showModal} onHide={handleClose} centered size="xl">
          <Modal.Header closeButton>
            <Modal.Title>{selectedItem.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h3>Location</h3>
            <Image
              src="/UHmap-campuscenter.png"
              alt="Campus Center"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: '100%', height: 'auto' }} // optional
            />
          </Modal.Body>
        </Modal>
      )}
    </Container>
  );
}
