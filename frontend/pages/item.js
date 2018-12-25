import SingleItem from '../components/SingleItem'

const Item = ({query: {id}}) => (
    <div>
      <SingleItem id={id}/>
    </div>
  )

export default Item
