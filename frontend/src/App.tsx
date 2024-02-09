import './App.css'
import DefaultLayout from './layout/DefaultLayout'
import { useAuth } from './auth/AuthProvider';

function App() {
  const auth = useAuth();

  return (
    <DefaultLayout>
     {auth.isAuth?'WELCOME':'HOME'}
    </DefaultLayout>
  )
}

export default App
