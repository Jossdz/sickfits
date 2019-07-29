import React, {Component} from 'react'
import {Mutation} from 'react-apollo'
import gql from 'graphql-tag'
import Form from './styles/Form'
import Error from './ErrorMessage'

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`

export default class Signin extends Component {
  state = {
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
      <Mutation mutation={REQUEST_RESET_MUTATION} variables={this.state}>
        {(reset, {error, loading, called}) => {
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
                <h2>Request a password reset</h2>
                <Error error={error} />
                {!error && !loading && called && (
                  <p>Sucess, check your email</p>
                )}
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
                <input type='submit' value='Request Reset' />
              </fieldset>
            </Form>
          )
        }}
      </Mutation>
    )
  }
}
