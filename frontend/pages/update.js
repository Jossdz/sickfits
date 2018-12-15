import UpdateItem from '../components/updateItem'

export default ({query}) => {
  return (
    <div>
      <UpdateItem id={query.id}/> {/* -> undefined*/}
    </div>
  )
}

