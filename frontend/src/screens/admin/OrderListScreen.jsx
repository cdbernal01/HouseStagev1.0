import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <>
      <h1>Pedidos</h1>
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
            <th style={{ backgroundColor: 'lightgreen', color: 'black' }}>
              ID DE PEDIDO
            </th>
            <th style={{ backgroundColor: 'lightcyan', color: 'black' }}>
              FECHA
            </th>
            <th style={{ backgroundColor: 'lightcyan', color: 'black' }}>
              TOTAL
            </th>
            <th style={{ backgroundColor: 'lightcyan', color: 'black' }}>
              PAGO
            </th>
            <th style={{ backgroundColor: 'lightcyan', color: 'black' }}>
              ENTREGADO
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td style={{ backgroundColor: 'gray', color: 'white' }}>
                {order._id}
              </td>
              <td style={{ backgroundColor: 'gray', color: 'white' }}>
                {order.createdAt.substring(0, 10)}
              </td>
              <td style={{ backgroundColor: 'gray', color: 'white' }}>
                $ {order.totalPrice.toLocaleString()}
              </td>
              <td style={{ backgroundColor: 'gray', color: 'white' }}>
                {order.isPaid ? (
                  order.paidAt.substring(0, 10)
                ) : (
                  <FaTimes style={{ color: 'red' }} />
                )}
              </td>
              <td style={{ backgroundColor: 'gray', color: 'white' }}>
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
