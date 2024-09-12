import React from 'react';
import './index.css';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import Register from './pages/Register';
import Admin from './pages/Admin';
import AdminLayout from './Layout/AdminLayout';
import UserLayout from './Layout/UserLayout';
import PublicLayouts from './Layout/PublicLayout';
import ProblemDetail from './components/problems/problemdetails';
import AllContests from './components/contest/AllContest';



const App = () => {
  
  return (
      <Routes>
        <Route path='/' element={<UserLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<Admin />} />
        </Route>
        <Route path='/' element={<PublicLayouts />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Route>
        <Route path='/*' element={<Home />} />
        <Route path='/api/get-problem/:id' element={<ProblemDetail />} />
        <Route path="/all-contests" element={<AllContests/>} />
       
      </Routes>
  );
};

export default App;