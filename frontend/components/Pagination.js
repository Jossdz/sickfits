import React from 'react'
import gql from 'graphql-tag'
import Head from 'next/head'
import Link from 'next/link'
import { Query } from 'react-apollo'
import PaginationStyles from './styles/PaginationStyles'
import { perPage } from '../config'

const PAGINATION_QUERY = gql`

  query PAGINATION_QUERY {
    itemsConnection{
      aggregate{
        count
      }
    }
  }
`

const Pagination = props => (
    <Query
      query={
        PAGINATION_QUERY
      }
    >
    {({data, loading, error})=>{
      if(loading)  return <p>Loading...</p>
      const count = data.itemsConnection.aggregate.count
      const pages = Math.ceil(count / perPage)
      const page = props.page
      return (
      <PaginationStyles>
        <Head>
          <title>Sick fits | Page {page} from {pages}</title>
        </Head>
        <Link 
          prefetch
          href={{
            pathname: 'items',
            query: {page: page - 1}
        }}>
          <a className="prev" aria-disabled={page <= 1}>Prev</a>
        </Link>
        <p>Pages {page} of {pages}</p>
        <Link 
          prefetch
          href={{
            pathname: 'items',
            query: {page: page + 1}
        }}>
          <a className='next' aria-disabled={page >= pages}>Next</a>
        </Link>
      </PaginationStyles>
      )}}
    </Query>
  
)

export default Pagination