import {Query} from 'react-apollo'
import {CURRENT_USER_QUERY} from './User'
import Signin from './Signin'

export default props => {
  return (
    <Query query={CURRENT_USER_QUERY}>
      {({data, loading}) =>
        loading ? (
          <p>Loading...</p>
        ) : !data.me ? (
          <div>
            <p>Please Sign in before</p>
            <Signin />
          </div>
        ) : (
          props.children
        )
      }
    </Query>
  )
}
