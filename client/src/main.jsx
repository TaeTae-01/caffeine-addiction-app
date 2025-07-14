import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import SignIn from './SignIn.jsx'
import SignUp from './SignUp.jsx'
import Status from './Status.jsx'
import Logout from './Logout.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Logout />
    <Status />
    <SignIn />
    <SignUp />
  </StrictMode>,
)
