import React from 'react'
import {Query, Mutation} from 'react-apollo'
import gql from 'graphql-tag'
import CartStyles from './styles/CartStyles'
import Supreme from './styles/Supreme'
import CloseButton from './styles/CloseButton'
import SickButton from './styles/SickButton'

export const LOCAL_STATE_QUERY = gql`
  query {
    cartOpen @client
  }
`

export const TOGGLE_CART_MUTATION = gql`
  mutation {
    toggleCart @client
  }
`

export default () => {
  return (
    <Mutation mutation={TOGGLE_CART_MUTATION}>
      {toggleCart => (
        <Query query={LOCAL_STATE_QUERY}>
          {({data: {cartOpen}}) =>
            console.log('dataa', cartOpen) || (
              <CartStyles open={cartOpen}>
                <header>
                  <CloseButton onClick={toggleCart} title='close'>
                    &times;
                  </CloseButton>
                  <Supreme>Your Cart</Supreme>
                  <p>You have __ items in your cart</p>
                </header>
                <footer>
                  <p>$10.10</p>
                  <SickButton>checkout</SickButton>
                </footer>
              </CartStyles>
            )
          }
        </Query>
      )}
    </Mutation>
  )
}
