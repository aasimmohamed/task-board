import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Board from './pages/Board';
import AdminUsers from './pages/AdminUsers';
import AdminAssignments from './pages/AdminAssignments';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { fontFamily: 'Inter, sans-serif', fontSize: '14px', borderRadius: '8px' },
            success: { iconTheme: { primary: '#2F5D50', secondary: '#fff' } },
            error: { iconTheme: { primary: '#B4472F', secondary: '#fff' } },
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/board" element={<Board />} />
            <Route
              path="/admin/users"
              element={<AdminRoute><AdminUsers /></AdminRoute>}
            />
            <Route
              path="/admin/assignments"
              element={<AdminRoute><AdminAssignments /></AdminRoute>}
            />
          </Route>

          <Route path="*" element={<Navigate to="/board" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;