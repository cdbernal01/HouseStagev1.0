import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { WhatsAppWidget } from 'react-whatsapp-widget';
import 'react-whatsapp-widget/dist/index.css';

const App = () => {
  return (
    <>
      <Header />
      <main className="py-3">
        <Container>
          <Outlet />
          <div className="App">
            <WhatsAppWidget
              phoneNumber="+573152005882" // número de teléfono
              message="Hola, ¿en qué puedo ayudarte?" // Mensaje predeterminado
              sendButtonText="Enviar"
              inputPlaceHolder="Escribe tu mensaje"
              companyName="HouseStage"
              replyTimeText="Te responderemos en el menor tiempo posible"
            />
          </div>
        </Container>
      </main>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default App;
