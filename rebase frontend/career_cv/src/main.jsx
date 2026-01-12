import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorPage from './pages/error.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
//router setup
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    index: true,
    errorElement: <ErrorPage />,
  },
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
