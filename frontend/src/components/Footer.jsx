import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <Container>
        <Row>
          <Col className="text-center py-3">
            <p>HouseStage &copy; Todos los derechos reservados {currentYear}</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
