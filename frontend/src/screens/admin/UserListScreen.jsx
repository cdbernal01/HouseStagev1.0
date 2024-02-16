import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { FaTrash, FaEdit, FaCheck, FaTimes, FaUserCircle } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from '../../slices/usersApiSlice';
import { toast } from 'react-toastify';

const UserListScreen = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Esta seguro de eliminar el usuario ?')) {
      try {
        await deleteUser(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <h1>
        Usuarios <FaUserCircle  />
      </h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th
                style={{
                  backgroundColor: '#192134',
                  color: 'white',
                  border: '1px solid white',
                }}
              >
                ID
              </th>
              <th
                style={{
                  backgroundColor: '#192134',
                  color: 'white',
                  border: '1px solid white',
                }}
              >
                NOMBRE
              </th>
              <th
                style={{
                  backgroundColor: '#192134',
                  color: 'white',
                  border: '1px solid white',
                }}
              >
                EMAIL
              </th>
              <th
                style={{
                  backgroundColor: '#192134',
                  color: 'white',
                  border: '1px solid white',
                }}
              >
                ADMIN
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td style={{ backgroundColor: '#F6FDFF', color: 'black' }}>
                  {' '}
                  {user._id}
                </td>
                <td style={{ backgroundColor: '#F6FDFF', color: 'black' }}>
                  {' '}
                  {user.name}
                </td>
                <td style={{ backgroundColor: '#F6FDFF', color: 'black' }}>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td style={{ backgroundColor: '#F6FDFF', color: 'black' }}>
                  {user.isAdmin ? (
                    <FaCheck style={{ color: 'green' }} />
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  {!user.isAdmin && (
                    <>
                      <LinkContainer
                        to={`/admin/user/${user._id}/edit`}
                        style={{ marginRight: '10px' }}
                      >
                        <Button variant="light" className="btn-sm">
                          <FaEdit />
                        </Button>
                      </LinkContainer>
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => deleteHandler(user._id)}
                      >
                        <FaTrash style={{ color: 'white' }} />
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default UserListScreen;
