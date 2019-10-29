import Items from '../components/Items'

export default props => (
  <div>
    <Items page={parseFloat(props.query.page) || 1} />
  </div>
)
