import { getServerSession } from 'next-auth';
import { userProtectedPage } from '@/lib/page-protection'; // Import user protection
import { prisma } from '@/lib/prisma';
import { Col, Container, Row, Table, Button } from 'react-bootstrap';
import StuffItemAdmin from '@/components/StuffItemAdmin';
import authOptions from '@/lib/authOptions';
import Link from 'next/link';

const UserPage = async () => {
  const session = await getServerSession(authOptions);

  // Apply user protection to ensure this page is only for 'USER' role
  userProtectedPage(session);

  const stuff = await prisma.stuff.findMany({
    where: {
      owner: session?.user?.id,
    },
  });

  return (
    <main>
      <Container id="user-page" fluid className="py-3">
        <Row>
          <Col>
            <h1>User Dashboard</h1>
            <p className="text-muted">You're logged in as a Regular User</p>
            
            {/* Link to Profile */}
            <Link href="/profile">
              <Button variant="primary">Go to Profile</Button>
            </Link>

            <Table striped bordered hover className="mt-4">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Condition</th>
                  <th>Owner</th>
                </tr>
              </thead>
              <tbody>
                {stuff.map((item) => (
                  <StuffItemAdmin key={item.id} {...item} />
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default UserPage;
