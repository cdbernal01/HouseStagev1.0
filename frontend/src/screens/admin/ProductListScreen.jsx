import { LinkContainer } from 'react-router-bootstrap';
import {
  Table,
  Button,
  Row,
  Col,
} from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {
  useGetProductsQuery,
  useCreateProductMutation,
} from '../../slices/productsApiSlice';
import { toast } from 'react-toastify';

const ProductListScreen = () => {
  const { data: products, isLoading, error, refetch } = useGetProductsQuery();

  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const createProductHandler = async () => {
    if (window.confirm('Estas seguro de crear un nuevo producto?')) {
      try {
        await createProduct();
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const deleteHandler = () => {};

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Gestión de Productos</h1>
        </Col>
        <Col className="text-end">
          <Button className="my-3" onClick={createProductHandler}>
            <FaPlus /> Crear Producto
          </Button>
        </Col>
      </Row>
      {loadingCreate && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error.data.message}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th style={{ backgroundColor: 'lightgreen', color: 'black' }}>
                  ID PRODUCTO
                </th>
                <th style={{ backgroundColor: 'lightgreen', color: 'black' }}>
                  NOMBRE
                </th>
                <th style={{ backgroundColor: 'lightgreen', color: 'black' }}>
                  PRECIO
                </th>
                <th style={{ backgroundColor: 'lightgreen', color: 'black' }}>
                  CATEGORIA
                </th>
                <th style={{ backgroundColor: 'lightgreen', color: 'black' }}>
                  MARCA
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td style={{ backgroundColor: 'gray', color: 'white' }}>
                    {product._id}
                  </td>
                  <td style={{ backgroundColor: 'gray', color: 'white' }}>
                    {product.name}
                  </td>
                  <td style={{ backgroundColor: 'gray', color: 'white' }}>
                    ${product.price.toLocaleString()}
                  </td>
                  <td style={{ backgroundColor: 'gray', color: 'white' }}>
                    {product.category}
                  </td>
                  <td style={{ backgroundColor: 'gray', color: 'white' }}>
                    {product.brand}
                  </td>
                  <td>
                  <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant='light' className='btn-sm mx-2'>
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(product._id)}
                    >
                      <FaTrash style={{ color: 'white' }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default ProductListScreen;
