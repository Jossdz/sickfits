import React, {Component} from 'react'
import {Mutation} from 'react-apollo'
import gql from 'graphql-tag'
import Form from './styles/Form'
import Error from './ErrorMessage'
import propTypes from 'prop-types'
import {CURRENT_USER_QUERY} from './User'

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      email
      name
    }
  }
`

export default class Reset extends Component {
  static propTypes = {
    resetToken: propTypes.string.isRequired
  }

  state = {
    password: '',
    confirmPassword: ''
  }

  saveToState = e => {
    const {
      target: {name, value}
    } = e
    this.setState({
      [name]: value
    })
  }

  render() {
    return (
      <Mutation
        mutation={RESET_MUTATION}
        variables={{
          resetToken: this.props.resetToken,
          password: this.state.password,
          confirmPassword: this.state.confirmPassword
        }}
        refetchQueries={[{query: CURRENT_USER_QUERY}]}
      >
        {(reset, {error, loading}) => {
          return (
            <Form
              method='post'
              onSubmit={async e => {
                e.preventDefault()
                await reset()
                this.setState({email: ''})
              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Reset your password</h2>
                <Error error={error} />
                <label hrmlfor='password'>
                  password
                  <input
                    type='password'
                    name='password'
                    placeholder='password'
                    value={this.state.password}
                    onChange={this.saveToState}
                  />
                </label>
                <label hrmlfor='confirmPassword'>
                  Confirm your password
                  <input
                    type='password'
                    name='confirmPassword'
                    placeholder='confirm password'
                    value={this.state.confirmPassword}
                    onChange={this.saveToState}
                  />
                </label>
                <input type='submit' value='Reset' />
              </fieldset>
            </Form>
          )
        }}
      </Mutation>
    )
  }
}
