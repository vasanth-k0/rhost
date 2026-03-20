import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import CodeEditor from './components/CodeEditor'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{textAlign: 'left', height: '100%', overflow: 'hidden'}}>
          <CodeEditor />
    </div>
  )
}

export default App
