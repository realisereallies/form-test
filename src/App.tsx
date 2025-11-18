import { useEffect } from 'react';
import { useStore } from './store/store';
import AuthForm from './components/AuthForm';
import OrderForm from './components/OrderForm';

function App() {
  const { token, isAuthenticated, setAuthenticated } = useStore();

  useEffect(() => {
    if (token && !isAuthenticated) {
      setAuthenticated(true);
    }
  }, [token, isAuthenticated, setAuthenticated]);

  if (!isAuthenticated || !token) {
    return <AuthForm />;
  }

  return <OrderForm />;
}

export default App;



