import { getServerSession } from 'next-auth';
import { userProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';
import { Container, Card, Row, Col } from 'react-bootstrap';

import authOptions from '@/lib/authOptions';

const UserPage = async () => {
  const session = await getServerSession(authOptions);

  // Ensure user has the correct role to view the page
  userProtectedPage(session);

  // Get menu items for this user (rename 'stuff' if your table is actually 'menuItems')
  const menuItems = await prisma.menuItem.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      category: true,
      cuisine: true,
      ingredients: true,
    },
  });

  return (
    <main>
      <Container id="user-page" fluid className="py-3 text-center">
        <h1>Today's Hot Picks</h1>
        <p className="text-muted">Select from what's trending today!</p>

        <Row className="justify-content-center">
          {menuItems.length > 0 ? (
            menuItems.map((item, index) => (
              <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {item.cuisine} • {item.category}
                    </Card.Subtitle>
                    <Card.Text>
                      {item.description || 'No description available.'}
                    </Card.Text>
                    <Card.Text>
                      <strong>Price:</strong> ${item.price.toFixed(2)}
                    </Card.Text>
                    <div>
                      <strong>Ingredients:</strong>
                      <ul className="mb-0">
                        {item.ingredients?.split(',').map((ingredient: string, i: number) => (
                          <li key={i}>{ingredient.trim()}</li>
                        ))}
                      </ul>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p>No menu items added yet.</p>
          )}
        </Row>
      </Container>
    </main>
  );
};

export default UserPage;