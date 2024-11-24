import { useNavigate } from 'react-router-dom'

const Menu = () => {
  const navigate = useNavigate()

  /** @type {React.CSSProperties} */
  const containerStyle = {
    textAlign: 'center',
    maxWidth: 500,
    margin: '0 auto',
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
  }

  /** @type {React.CSSProperties} */
  const trainStyle = {
    background: 'linear-gradient(100deg, #8C4799 0% 48%, #CA4000 52% 100%)',
  }

  /** @type {React.CSSProperties} */
  const tramStyle = {
    background: '#008151',
  }

  return (
    <div style={containerStyle}>
      <h1 style={{ marginTop: 0 }}>Helsingin asemat</h1>
      <p>Kuinka monta pääkaupunkiseudun asemaa osaat nimetä?</p>
      <p>
        Kirjoita asemien nimiä vapaassa järjestyksessä.
        Kirjankoolla ei ole merkitystä ja järjestelmä hyväksyy myös pieniä kirjoitusvirheitä.
      </p>
      <button className='menu-start' style={trainStyle} onClick={() => navigate('/junat')}>Lähijunat + Metro</button>
      <button className='menu-start' style={tramStyle} onClick={() => navigate('/ratikat')}>Raitiovaunut</button>
      <span className='copyright-label'>
        &copy; 2024 Pyry Lahtinen.
        Katso <a href='https://github.com/PyryL/helsinki-stations#readme'>lisenssit</a>.
      </span>
    </div>
  )
}

export default Menu
