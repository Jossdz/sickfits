import React from 'react'
import Reset from '../components/Reset'

const reset = ({query}) => {
  return <Reset resetToken={query.resetToken} />
}

export default reset
