import "./App.css"
import { AuthProvider } from "./context/AuthContext"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { ThemeProvider } from "./context/ThemeContextProvider"
import  RouteConfig  from "./configs/routeConfig"
import { Suspense } from "react"
import Loading from "./components/Loading/Loading"

const App = ()=> {

  const router = createBrowserRouter(RouteConfig)
  return (
    <AuthProvider>
      <ThemeProvider>
        <Suspense fallback={<Loading/>}>
          <RouterProvider router={router} />
        </Suspense>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App

