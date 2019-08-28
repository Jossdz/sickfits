import React, {useState} from 'react';
import {Query, Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import propTypes from 'prop-types';
import Error from './ErrorMessage';
import Table from './styles/Table';
import SickButton from './styles/SickButton';

const possiblePermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE'
];

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation updatedPermissions($permissions: [Permission], $userId: ID!) {
    updatedPermissions(permissions: $permissions, userId: $userId) {
      id
      permissions
      name
      email
    }
  }
`;

const ALL_USERS_QUERY = gql`
  query {
    users {
      id
      name
      email
      permissions
    }
  }
`;

const permissions = props => {
  return (
    <Query query={ALL_USERS_QUERY}>
      {({data, loading, error}) =>
        console.log(data) || (
          <div>
            <Error error={error} />
            <div>
              <h1>Manage possiblePermissions</h1>
              <Table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    {possiblePermissions.map((per, i) => (
                      <th key={i}>{per}</th>
                    ))}
                    <th>👇🏻</th>
                  </tr>
                </thead>
                <tbody>
                  {data.users.map((user, id) => (
                    <UserPermissions user={user} key={id} />
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        )
      }
    </Query>
  );
};

const UserPermissions = ({user}) => {
  const [permissions, setPermissions] = useState([...user.permissions]);
  const handlePermissionChange = e => {
    const checkbox = e.target;
    let updatedPermissions = [...permissions];

    if (checkbox.checked) {
      updatedPermissions.push(checkbox.value);
    } else {
      updatedPermissions = updatedPermissions.filter(
        permission => permission !== checkbox.value
      );
    }
    setPermissions(updatedPermissions);
  };
  return (
    <Mutation
      mutation={UPDATE_PERMISSIONS_MUTATION}
      variables={{permissions: permissions, userId: user.id}}
    >
      {(updatedPermissions, {loading, error}) => (
        <>
          {error && (
            <tr>
              <td colSpan='8'>
                <Error error={error} />
              </td>
            </tr>
          )}
          <tr>
            <td>{user.name}</td>
            <td>{user.email}</td>
            {possiblePermissions.map(permission => (
              <td key={permission}>
                <label htmlFor={`${user.id}-permission-${permission}`}>
                  <input
                    type='checkbox'
                    name={`${user.id}-permission-${permission}`}
                    id={`${user.id}-permission-${permission}`}
                    checked={permissions.includes(permission)}
                    value={permission}
                    onChange={handlePermissionChange}
                  />
                </label>
              </td>
            ))}
            <td>
              <SickButton
                type='button'
                disabled={loading}
                onClick={updatedPermissions}
              >
                Updat{loading ? 'ing' : 'e'}
              </SickButton>
            </td>
          </tr>
        </>
      )}
    </Mutation>
  );
};

UserPermissions.propTypes = {
  user: propTypes.shape({
    name: propTypes.string,
    email: propTypes.string,
    id: propTypes.string,
    permissions: propTypes.array
  }).isRequired
};

export default permissions;
