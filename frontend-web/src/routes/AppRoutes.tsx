import { Route, Routes } from 'react-router-dom'
import HomePage from '../pages/Home'
import RegisterPage from '../pages/Register'
import LoginPage from '../pages/Login'

const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
    </Routes>
  )
}

export default AppRoutes