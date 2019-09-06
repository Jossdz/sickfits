import Link from 'next/link'
import NavStyles from './styles/NavStyles'
import User from './User'
import Signout from './Signout'
import {Mutation} from 'react-apollo'
import {TOGGLE_CART_MUTATION} from './Cart'

export default () => (
  <User>
    {({data}) => {
      const me = data ? data.me : null
      return (
        <NavStyles data-test='nav'>
          {me && <a>{me.name}</a>}
          <Link href='/items'>
            <a>Shop</a>
          </Link>
          {me && (
            <>
              <Link href='/sell'>
                <a>Sell</a>
              </Link>
              <Link href='/orders'>
                <a>Orders</a>
              </Link>
              <Link href='/me'>
                <a>Account</a>
              </Link>
              <Signout />
              <Mutation mutation={TOGGLE_CART_MUTATION}>
                {toggleCart => <button onClick={toggleCart}>My Cart</button>}
              </Mutation>
            </>
          )}
          {!me && (
            <Link href='/signup'>
              <a>Sign In</a>
            </Link>
          )}
        </NavStyles>
      )
    }}
  </User>
)
