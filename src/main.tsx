
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { UserProvider } from './contexts/UserContext' // <-- IMPORTE

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>  {/* <-- ENVOLVA O APP */}
      <App />
    </UserProvider>
  </StrictMode>,
)