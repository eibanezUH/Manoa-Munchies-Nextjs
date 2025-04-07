import { getServerSession } from 'next-auth';
import { Col, Container, Row, Table } from 'react-bootstrap';
import StuffItemAdmin from '@/components/StuffItemAdmin';
import { prisma } from '@/lib/prisma';
import { vendorProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';

const VendorPage = async () => {
  const session = await getServerSession(authOptions);
  vendorProtectedPage(session);

  const stuff = await prisma.stuff.findMany({
    where: {
      ownerId: session?.user?.id,
    },
  });

  return (
    <main>
      <Container id="vendor-page" fluid className="py-3">
        <Row>
          <Col>
            <h1>Vendor Dashboard</h1>
            <p className="text-muted">You're logged in as a Vendor</p>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Condition</th>
                  <th>Owner</th>
                  <th>Actions</th>
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

export default VendorPage;
