import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './routes/Login.tsx';
import Dashboard from './routes/Dashboard.tsx';
import Register from './routes/Register.tsx';
import RouteError from './routes/HandleError.tsx';
import RouteProtector from './routes/RouteProtector.tsx';
import AuthProvider from './auth/AuthProvider.tsx';

const router = createBrowserRouter([
  {
    path:'/',
    element:<App/>,
    errorElement: <RouteError />
  },
  {
    path:'/login',
    element:<Login/>,
    
  },
  {
    //requiere autenticacion para acceder
    path:'/',
    element:<RouteProtector/>,
    children:[
      {
        path:'/dashboard',
        element:<Dashboard/>,
        errorElement:<RouteError/>
      }
    ]
  },
  {
    path:'/register',
    element:<Register/>
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
)
