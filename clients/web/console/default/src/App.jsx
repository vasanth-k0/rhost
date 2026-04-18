import './App.css'

function App() {
  return (
        <app id="rhost" style={fit}>
          <ComposeProviders providers={[SystemContextProvider, AppContextProvider, UserContextProvider, ThemeContextProvider]}>
            <Console />
          </ComposeProviders>
        </app>    
  )
}

export default App
