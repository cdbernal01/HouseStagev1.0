import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  // Obtener el año actual
  const currentYear = new Date().getFullYear();

  const footerStyle = {
    backgroundColor: "#AB9D85", color:'black' 
  };

  return (
    <footer style={footerStyle}>
      <Container>
        <Row>
          <Col className="text-center py-2" fontColor='black'>
            <p>HouseStage &copy; Todos los derechos reservados {currentYear}</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;