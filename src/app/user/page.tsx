/* eslint-disable @typescript-eslint/no-unused-vars */
import { getServerSession } from 'next-auth';
import { userProtectedPage } from '@/lib/page-protection'; // Import user protection
import { prisma } from '@/lib/prisma';
import { Col, Container, Row, Button } from 'react-bootstrap';
import authOptions from '@/lib/authOptions';
import Link from 'next/link';

const UserPage = async () => {
  const session = await getServerSession(authOptions);

  // Apply user protection to ensure this page is only for 'USER' role
  userProtectedPage(session);

  return (
    <main>
      <Container id="user-page" fluid className="py-3">
        <Row>
          <Col>
            <h1>User Dashboard</h1>
            <p className="text-muted">You&apos;re logged in as a Regular User</p>
            {/* Link to Profile */}
            <Link href="/profile">
              <Button variant="primary">Go to Profile</Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default UserPage;
