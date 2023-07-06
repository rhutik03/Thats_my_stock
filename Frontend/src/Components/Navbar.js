import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Profile } from "./Profile";

export const NavBar = () => {
  return (
    <Navbar fixed="top" collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container className="nav-container">
        <Navbar.Brand href="/">🚀 That's My Stock</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>
            {/* <Nav.Link href="https://share.streamlit.io/zappy0/stock-predictor/main/predictor.py"> */}
            <Nav.Link href="/predict">
                Predict
            </Nav.Link>
            {/* <Nav.Link href="#deets">More deets</Nav.Link> */}
            {/* <Nav.Link eventKey={2} href="#news">
              <Link to="/#news">News</Link>
            </Nav.Link> */}
            <Profile />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
