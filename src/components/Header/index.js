import './index.css'

import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {FiLogOut} from 'react-icons/fi'
import {BsBriefcaseFill} from 'react-icons/bs'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <div className="nav-header">
      <div className="nav-content">
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
        </Link>
        <ul className="nav-menu">
          <Link to="/" className="nav-link">
            <li>Home</li>
          </Link>
          <Link to="/jobs" className="nav-link">
            <li>Jobs</li>
          </Link>
        </ul>
        <button
          type="button"
          className="logout-desktop-button"
          onClick={onClickLogout}
        >
          Logout
        </button>

        <ul className="nav-mobile-menu">
          <Link to="/" className="nav-link">
            <li>
              <AiFillHome className="home-logo" />
            </li>
          </Link>
          <Link to="/jobs" className="nav-link">
            <li>
              <BsBriefcaseFill className="job-icon" />
            </li>
          </Link>
        </ul>
        <button
          type="button"
          className="logout-mobile-button"
          onClick={onClickLogout}
        >
          <FiLogOut className="logout-logo" />
        </button>
      </div>
    </div>
  )
}

export default withRouter(Header)
