import React, {Component} from 'react'
import {Mutation} from 'react-apollo'
import gql from 'graphql-tag'
import Form from './styles/Form'
import Error from './ErrorMessage'
import {CURRENT_USER_QUERY} from './User'

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
    }
  }
`

export default class Signin extends Component {
  state = {
    name: '',
    password: '',
    email: ''
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
        mutation={SIGNIN_MUTATION}
        variables={this.state}
        refetchQueries={[{query: CURRENT_USER_QUERY}]}
      >
        {(signin, {error, loading}) => {
          return (
            <Form
              method='post'
              onSubmit={async e => {
                e.preventDefault()
                await signin()
                this.setState({email: '', password: ''})
              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Sign into your account</h2>
                <Error error={error} />
                <label hrmlfor='email'>
                  email
                  <input
                    type='text'
                    name='email'
                    placeholder='email'
                    value={this.state.email}
                    onChange={this.saveToState}
                  />
                </label>

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
                <input type='submit' value='Sign In' />
              </fieldset>
            </Form>
          )
        }}
      </Mutation>
    )
  }
}
