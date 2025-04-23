// src/app/admin/page.tsx
import { getServerSession } from 'next-auth';
import { Col, Container, Row, Table, Button } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import { adminProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';
import Link from 'next/link';

const AdminPage = async () => {
  const session = await getServerSession(authOptions);
  adminProtectedPage(session);

  // Fetch users with vendorId included
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      vendorId: true, // Include vendorId
    },
  });

  return (
    <main>
      <Container id="list" fluid className="py-3">
        <Row>
          <Col>
            <h1>Admin Dashboard</h1>
            <Link href="/admin/add-vendor">
              <Button variant="primary" className="mb-3">
                Add Vendor
              </Button>
            </Link>
            <h2>List Users Admin</h2>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Vendor ID</th>
                  {/* New column */}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.vendorId ?? 'N/A'}</td>
                    {/* Display vendorId or N/A */}
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default AdminPage;
