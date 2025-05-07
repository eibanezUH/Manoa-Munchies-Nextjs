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
    <Container
      id="admin"
      fluid
      className="py-3"
      style={{
        backgroundColor: '#f1f2f4',
      }}
    >
      <Row>
        <Col className="mt-5 text-dark text-center">
          <h1><strong>Admin Dashboard</strong></h1>
          <p className="text-muted">View all registered users and vendors.</p>
          <Link href="/admin/add-vendor">
            <Button variant="primary" className="mb-3">
              Add Vendor
            </Button>
          </Link>
          <Table striped bordered hover className="shadow-sm">
            <thead>
              <tr>
                <th style={{ width: '50%' }}>Email</th>
                <th style={{ width: '25%' }}>Role</th>
                <th style={{ width: '25%' }}>Vendor ID</th>
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
  );
};

export default AdminPage;
