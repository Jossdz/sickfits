import React from 'react'
import PleaseSignIn from '../components/PleaseSignIn'
import Permissions from '../components/permissions'
const permissionsPage = () => {
  return (
    <PleaseSignIn>
      <Permissions />
    </PleaseSignIn>
  )
}

export default permissionsPage
