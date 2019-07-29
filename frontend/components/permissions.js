import React from 'react'
import {Query} from 'react-apollo'
import Error from './ErrorMessage'
import gql from 'graphql-tag'
import Table from './styles/Table'
import SickButton from './styles/SickButton'

const possiblePermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE'
]

const ALL_USERS_QUERY = gql`
  query {
    users {
      id
      name
      email
      permissions
    }
  }
`

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
                  <th>Name</th>
                  <th>Email</th>
                  {possiblePermissions.map((per, i) => (
                    <th key={i}>{per}</th>
                  ))}
                  <th>👇🏻</th>
                </thead>
                <tbody>
                  {data.users.map((user, id) => (
                    <User user={user} key={id} />
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        )
      }
    </Query>
  )
}

const User = ({user}) => (
  <tr>
    <td>{user.name}</td>
    <td>{user.email}</td>
    {possiblePermissions.map(permission => (
      <td>
        <label htmlFor={`${user.id}-permission-${permission}`}>
          <input type='checkbox' name='' id='' />
        </label>
      </td>
    ))}
    <td>
      <SickButton>Update</SickButton>
    </td>
  </tr>
)
export default permissions
