import Link from 'next/link'
import NavStyles from './styles/NavStyles'

export default () => (
    <NavStyles>
      <Link href='/'><a>Shop</a></Link>
      <Link href='/sell'><a>Sell</a></Link>
      <Link href='/signup'><a>Signup</a></Link>
      <Link href='/orders'><a>Orders</a></Link>
      <Link href='/me'><a>Me</a></Link>
    </NavStyles>
  )

