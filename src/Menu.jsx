import { Link } from 'react-router-dom'

const Menu = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ marginTop: 0 }}>Helsingin asemat</h1>
      <p>Kuinka monta Helsingin juna- ja metroasemaa osaat nimetä?</p>
      <Link to='/junat'>Aloita</Link>{" "}
      <Link to='/ratikat'>Aloita ratikat</Link>
    </div>
  )
}

export default Menu
