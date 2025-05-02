// /* eslint-disable react/jsx-indent, @typescript-eslint/indent */

'use client';

import { useSession } from 'next-auth/react';
import {
  Container, Nav, Navbar, NavDropdown,
} from 'react-bootstrap';
import {
  BoxArrowRight, PersonFill, PersonPlusFill,
} from 'react-bootstrap-icons';
import '../app/navbar.css';

const NavBar: React.FC = () => {
  const { data: session } = useSession();
  const role = session?.user?.randomKey;
  const currentUser = session?.user?.email;

  return (
    <Navbar expand="lg" className="navbar-custom py-2 px-3" variant="dark" fixed="top">
      <Container fluid>
        {/* Left Brand Logo / Title */}
        <Navbar.Brand href="/" className="fw-bold fs-5 me-4">
          Manoa Munchies
        </Navbar.Brand>

        {/* Mobile Toggle Button */}
        <Navbar.Toggle aria-controls="main-navbar-nav" />

        {/* Collapsible Nav Section */}
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto">
            {role === 'ADMIN' && (
              <Nav.Link href="/admin" className="px-3">Dashboard</Nav.Link>
            )}

            {role === 'VENDOR' && (
              <Nav.Link href="/vendor" className="px-3">Dashboard</Nav.Link>
            )}

            {role === 'USER' && (
              <>
                <Nav.Link href="/user" className="px-3">Available Menu</Nav.Link>
                <Nav.Link href="/user/toppicks" className="px-3">Top Picks</Nav.Link>
                <Nav.Link href="/profile" className="px-3">Profile</Nav.Link>
              </>
            )}
          </Nav>

          <Nav className="ms-auto">
            {session ? (
              <NavDropdown title={currentUser} id="user-nav-dropdown" align="end">
                <NavDropdown.Item href="/api/auth/signout">
                  <BoxArrowRight className="me-2" />
                  Sign Out
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown title="Login" id="login-dropdown" align="end">
                <NavDropdown.Item href="/auth/signin">
                  <PersonFill className="me-2" />
                  Sign In
                </NavDropdown.Item>
                <NavDropdown.Item href="/auth/signup">
                  <PersonPlusFill className="me-2" />
                  Sign Up
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
