import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from './pages/auth/Auth';
import LoginPage from './pages/auth/LoginPage';
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path='/home' element={<div>Hello Everyone!</div>}/>
    </Routes>
  </BrowserRouter>
  )
}

export default App