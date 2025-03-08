
import { Navigate, Route,Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import Navbar from './components/Navbar'
import { Toaster } from 'react-hot-toast'
import { useUserStore } from './stores/useUserStore'
import { useEffect } from 'react'
function App() {
  const {user,checkAuth} = useUserStore();
  useEffect (()=>{
    checkAuth();
  },[checkAuth]);
 return(
  <div className='min-h-screen bg-gray-900 text-white relative overflow-hidden'>
    <Navbar/>
    <Routes>
      <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />}></Route>
      <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/" />}></Route>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />}></Route>
    </Routes>
    <Toaster />
  </div>
 )
}

export default App
