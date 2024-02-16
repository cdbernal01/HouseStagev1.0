import { useNavigate } from 'react-router-dom';
import {
  Nav,
  Navbar,
  Container,
  Badge,
  NavDropdown,
  Row,
  Col,
} from 'react-bootstrap';
import {
  FaShoppingCart,
  FaUserCircle,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import logo from '../assets/logo.png';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };
  

  return (
    <header>
      <Navbar bg="black" variant="dark" expant="lg" collapseOnSelect>
        <Container>
        <Row>
          <span style={{ fontSize: '20px', marginRight: '-15px' }}>
            <FaInstagram />
          </span>
          <span style={{ fontSize: '20px', marginRight: '-15px' }}>
            <FaTwitter />
          </span>
          <span>
            <FaFacebook
              style={{ fontSize: '20px', marginRight: '-15px' }}
            ></FaFacebook>
          </span>
        </Row>
          <LinkContainer to="/">
            <Navbar.Brand>
              <img src={logo} alt="HouseStage"></img>
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <LinkContainer to="/cart">
                <Nav.Link>
                  <FaShoppingCart /> Carro de Compras
                  {cartItems.length > 0 && (
                    <Badge pill bg="success" style={{ marginLeft: '5px' }}>
                      {cartItems.reduce((a, c) => a + c.qty, 0)}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <>
                  <NavDropdown title={userInfo.name} id="username">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Perfil</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Cerrar Sesión
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <FaUserCircle /> Iniciar Sesión
                  </Nav.Link>
                </LinkContainer>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Administrador" id="adminmenu">
                  <LinkContainer to="/admin/productlist">
                    <NavDropdown.Item>Gestión de Productos</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orderlist">
                    <NavDropdown.Item>Gestión de Pedidos</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/userlist">
                    <NavDropdown.Item>Gestión de Usuarios</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
