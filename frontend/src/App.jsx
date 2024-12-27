import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'

export const App = () => {

  return (
    <div className="w-screen min-h-screen flex flex-col ">
      <Routes>
        <Route path="/" element={<Home />} />


      </Routes>
    </div>
  )
}

