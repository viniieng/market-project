import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { router } from './app/router';
import { AuthProvider } from './modules/auth/context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            background: '#ffffff',
            color: '#0f172a',
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;
