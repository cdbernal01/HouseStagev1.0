import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { FaTimes, FaShoppingCart } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <>
      <h1>
        Pedidos <FaShoppingCart></FaShoppingCart>
      </h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Table striped hover responsive className="table-sm">
          <thead>
            <tr>
              <th style={{
                  backgroundColor: '#192134',
                  color: 'white',
                  border: '1px solid white',
                }}
              >
                ID DE PEDIDO
              </th>
              <th style={{
                  backgroundColor: '#192134',
                  color: 'white',
                  border: '1px solid white',
                }}
              >
                FECHA
              </th>
              <th style={{
                  backgroundColor: '#192134',
                  color: 'white',
                  border: '1px solid white',
                }}
              >
                TOTAL
              </th>
              <th style={{
                  backgroundColor: '#192134',
                  color: 'white',
                  border: '1px solid white',
                }}
              >
                PAGO
              </th>
              <th style={{
                  backgroundColor: '#192134',
                  color: 'white',
                  border: '1px solid white',
                }}
              >
                ENTREGADO
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td style={{ backgroundColor: '#F6FDFF', color: 'black' }}>
                  {order._id}
                </td>
                <td style={{ backgroundColor: '#F6FDFF', color: 'black' }}>
                  {order.createdAt.substring(0, 10)}
                </td>
                <td style={{ backgroundColor: '#F6FDFF', color: 'black' }}>
                  $ {order.totalPrice.toLocaleString()}
                </td>
                <td style={{ backgroundColor: '#F6FDFF', color: 'black' }}>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td style={{ backgroundColor: '#F6FDFF', color: 'black' }}>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button className="btn-sm" variant="light">
                      Detalles
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderListScreen;
