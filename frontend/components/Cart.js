import React from 'react'
import {Query, Mutation} from 'react-apollo'
import gql from 'graphql-tag'
import CartStyles from './styles/CartStyles'
import Supreme from './styles/Supreme'
import CloseButton from './styles/CloseButton'
import CartItem from './CartItem'
import SickButton from './styles/SickButton'
import User from './User'
import calcTotalPrice from '../lib/calcTotalPrice'
import formatMoney from '../lib/formatMoney'

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
    <User>
      {({data: {me}}) => {
        if (!me) return null
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
                        <Supreme>{me.name}'s Cart</Supreme>
                        <p>
                          You have {me.cart.length} item
                          {me.cart.length === 1 ? '' : 's'} in your cart
                        </p>
                      </header>
                      <ul>
                        {me.cart.map(cartItem => (
                          <CartItem key={cartItem.id} cartItem={cartItem} />
                        ))}
                      </ul>
                      <footer>
                        <p>{formatMoney(calcTotalPrice(me.cart))}</p>
                        <SickButton>checkout</SickButton>
                      </footer>
                    </CartStyles>
                  )
                }
              </Query>
            )}
          </Mutation>
        )
      }}
    </User>
  )
}
