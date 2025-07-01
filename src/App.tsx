import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './screens/auth/login';
import Signup from './screens/auth/signup';
import ForgotPassword from './screens/auth/forgotPassword';
import TermsAndConditions from './screens/termsAndConditions';
import TestCentering from './screens/auth/TestCentering';
import Home from './screens/home';

const App: React.FC = () => {
  return (
    <Router basename="/Talktwirl_web/"> {/* Add basename prop */}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/termsAndConditions" element={<TermsAndConditions />} />
        <Route path="/test" element={<TestCentering />} />
        <Route path="/home" element={<Home />} />
        {/* Add more routes as you port more screens */}
      </Routes>
    </Router>
  );
};

export default App;
