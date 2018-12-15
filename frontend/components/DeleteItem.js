import React, { Component } from 'react'
import {Mutation} from 'react-apollo'
import gql from 'graphql-tag'

import { ALL_ITEMS_QUERY } from './Items'

const DELETE_ITEM = gql`
  mutation DELETE_ITEM($id: ID!){
    deleteItem(id: $id){
      id
    }
  }
`

class DeleteItem extends Component {
  //this update method will upload the cache after mutation
  //it recieve 2 params, one it's the actual cache (without mutation), the other it's the payload of the mutation
  update = (cache, payload) => {
    const data = cache.readQuery({query: ALL_ITEMS_QUERY})
    data.items = data.items.filter(item => item.id !== payload.data.deleteItem.id)
    cache.writeQuery({query:ALL_ITEMS_QUERY, data})
  }
  render() {
    return <Mutation 
      mutation={DELETE_ITEM} 
      variables={{id: this.props.id}}
      update={this.update}
      >
      {(deleteItem, {error})=>(
        <button onClick={()=>{
          if(confirm('you really want to delete this?')){
            deleteItem()
          }
      }}>{this.props.children}</button>
      )}
    </Mutation>
  }
}

export default DeleteItem
export { DELETE_ITEM }