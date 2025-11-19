import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate, NavLink } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import './Navbar.css'

const Navbar = () => {
  const navigate = useNavigate()
  const { userData, backendUrl, setUserData, setIsLoggedIn } = useContext(AppContext)

  const sendVerificationOtp = async () => {
    try {
      navigate('/enter-email')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.post(backendUrl + '/api/auth/logout')
      if (data.success) {
        setIsLoggedIn(false)
        setUserData(false)
        navigate('/')
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="navbar">
      <div className="brand" onClick={() => navigate('/')}>
        <img src={assets.logo} alt="Logo" className="navbar-logo" />
        <span className="brand-name">Recipedia</span>
      </div>
      <div className="right-group">
        <div className="nav-links">
          <NavLink to="/" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} end>Home</NavLink>
          <NavLink to="/about" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>About</NavLink>
          <NavLink to="/contact" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Contact</NavLink>
          <NavLink to="/recipes" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Recipes</NavLink>
          <NavLink to="/meal-planner" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Meal Planner</NavLink>
          {userData && (
            <NavLink to="/my-recipes" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Your Recipes</NavLink>
          )}
        </div>
      {userData ? (
        <div className="user-avatar">
          {userData.name[0].toUpperCase()}
          <div className="dropdown">
            <ul>
              {!userData.isAccountVerified && (
                <li onClick={sendVerificationOtp}>Verify email</li>
              )}
              <li onClick={logout}>Logout</li>
            </ul>
          </div>
        </div>
      ) : (
        <button onClick={() => navigate('/login')} className="login-btn">
          Login <img src={assets.arrow_icon} alt="" />
        </button>
      )}
      </div>
    </div>
  )
}

export default Navbar
