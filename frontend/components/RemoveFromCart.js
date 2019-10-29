import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {Mutation} from 'react-apollo'
import gql from 'graphql-tag'
import {CURRENT_USER_QUERY} from './User'

const REMOVE_FROM_CART_MUTATION = gql`
  mutation removeFromCart($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${props => props.theme.red};
    cursor: pointer;
  }
`

class RemoveFromCart extends React.Component {
  // this is called as soon we receive the response
  update = (cache, payload) => {
    // 1. first read the cache
    const data = cache.readQuery({query: CURRENT_USER_QUERY})
    console.log('running remove item')
    // 2. remove that item from the cart
    const cartItemId = payload.data.removeFromCart.id
    data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== cartItemId)
    // 3. write it back to the cache

    cache.writeQuery({query: CURRENT_USER_QUERY, data})
  }
  render() {
    return (
      <Mutation
        mutation={REMOVE_FROM_CART_MUTATION}
        variables={{id: this.props.id}}
        update={this.update}
        optimisticResponse={{
          __typename: 'Mutation',
          removeFromCart: {
            __typename: 'CartItem',
            id: this.props.id
          }
        }}
      >
        {(removeFromCart, {loading, error}) => (
          <BigButton
            disabled={loading}
            onClick={() =>
              removeFromCart().catch(error => alert(error.message))
            }
            title='Delete Item'
          >
            &times;
          </BigButton>
        )}
      </Mutation>
    )
  }
}

export default RemoveFromCart
