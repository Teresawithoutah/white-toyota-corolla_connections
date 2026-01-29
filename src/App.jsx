import { useState } from 'react'
import './App.css'
import pixelHeart from './assets/pixel-heart.gif'
import Game from './components/Game'
import { samplePuzzle } from './data/puzzles'

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
            src={pixelHeart}
            alt="Pixel heart"
            className="pixel-heart"
          />
          <h1 className='instructions-text'>What town did we meet in? 💌</h1>
          <p className='instructions-subtext'>*Enter the secret password to continue.</p>
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
      <div className="game-wrapper">
        <Game puzzle={samplePuzzle} />
      </div>
    </div>
  )
}

export default App