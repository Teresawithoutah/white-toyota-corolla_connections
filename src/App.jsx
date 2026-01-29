import { useState } from 'react'
import './App.css'

const CORRECT_PASSWORD = 'Passaic' // change this to whatever you want

function App() {
  const [passwordInput, setPasswordInput] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (passwordInput === CORRECT_PASSWORD) {
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('try again bacon!')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="App">
        <header className="App-header">
          <img
            src="../images/pixel-heart.gif"
            alt="Pixel heart"
            className="pixel-heart"
          />
          <p className='instructions-text'>Enter the secret password to continue 💌</p>
          <form onSubmit={handleSubmit} className="password-form">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter password"
              className="password-input"
            />
            <button type="submit" className="password-button">
              Unlock
            </button>
          </form>
          {error && <p className="error-text">{error}</p>}
        </header>
      </div>
    )
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>H + T's Valentine's Day </h1>
        <p>Connection based vday gift!</p>
        {/* Put the rest of your actual app content here */}
      </header>
    </div>
  )
}

export default App