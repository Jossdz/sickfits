import Link from 'next/link'
import NavStyles from './styles/NavStyles'
import User from './User'
import Signout from './Signout'

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
