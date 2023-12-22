import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);

  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err?.error);
    }
  };

  return (
    <FormContainer>
      <h1>Iniciar Sesión</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email" className="my-2">
          <Form.Label> Correo electrónico</Form.Label>
          <Form.Control
            type="email"
            placeholder="introduzca su correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="password" className="my-2">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Introduzca su contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button
          type="submit"
          variant="primary"
          className="mt-2"
          disabled={isLoading}
        >
          Iniciar Sesión
        </Button>

        {isLoading && <Loader />}
      </Form>
      <Row className="py-3">
        <Col>
          ¿No eres cliente nuestro? Ven Regístrate !{" "}
          <Link to={redirect ? `/register?redirect=${redirect}` : "register"}>
            Registrarse{" "}
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
