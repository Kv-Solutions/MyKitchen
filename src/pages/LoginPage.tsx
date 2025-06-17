import React, { useState } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';

export const LoginPage: React.FC = () => {
  const [showRegister, setShowRegister] = useState(false);
  
  return (
    <>
      {showRegister ? (
        <RegisterForm onBackToLogin={() => setShowRegister(false)} />
      ) : (
        <LoginForm onShowRegister={() => setShowRegister(true)} />
      )}
    </>
  );
};