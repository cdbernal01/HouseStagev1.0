import { LinkContainer } from 'react-router-bootstrap';
import {
  Table,
  Button,
  Row,
  Col,
} from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash  } from 'react-icons/fa';
import { MdOutlineInventory } from "react-icons/md";
import { useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation
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

  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Esta seguro de eliminar el producto ?')) {
      try {
        await deleteProduct(id);
        toast.success('Producto Eliminado');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Productos <MdOutlineInventory /></h1>
        </Col>
        <Col className="text-end">
          <Button className="my-3" onClick={createProductHandler}>
            <FaPlus /> Crear Producto
          </Button>
        </Col>
      </Row>
      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error.data.message}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th  style={{
                  backgroundColor: '#192134',
                  color: 'white',
                  border: '1px solid white',
                }}
              >
                  ID PRODUCTO
                </th>
                <th style={{
                  backgroundColor: '#192134',
                  color: 'white',
                  border: '1px solid white',
                }}
              >
                  NOMBRE
                </th>
                <th  style={{
                  backgroundColor: '#192134',
                  color: 'white',
                  border: '1px solid white',
                }}
              >
                  PRECIO
                </th>
                <th  style={{
                  backgroundColor: '#192134',
                  color: 'white',
                  border: '1px solid white',
                }}
              >
                  CATEGORIA
                </th>
                <th style={{
                  backgroundColor: '#192134',
                  color: 'white',
                  border: '1px solid white',
                }}
              >
                  MARCA
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td style={{ backgroundColor: '#F6FDFF', color: 'black' }}>
                    {product._id}
                  </td>
                  <td style={{ backgroundColor: '#F6FDFF', color: 'black' }}>
                    {product.name}
                  </td>
                  <td style={{ backgroundColor: '#F6FDFF', color: 'black' }}>
                    ${product.price.toLocaleString()}
                  </td>
                  <td style={{ backgroundColor: '#F6FDFF', color: 'black' }}>
                    {product.category}
                  </td>
                  <td style={{ backgroundColor: '#F6FDFF', color: 'black' }}>
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
