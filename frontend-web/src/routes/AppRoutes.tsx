import { Route, Routes } from 'react-router-dom'
import HomePage from '../pages/Home'
import RegisterPage from '../pages/Register'

const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/register' element={<RegisterPage />} />
    </Routes>
  )
}

export default AppRoutes