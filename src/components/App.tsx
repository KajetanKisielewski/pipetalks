import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from './Dashboard/Dashboard';

import SignIn from './SignIn/SignIn';
import SignUp from './SignUp/SignUp'



import { path } from "helpers/configs";

import './App.css';

const App = (): JSX.Element => {
  const { homePage, dashboard, signUp } = path;

  return (
    <Router>
      <Routes>
        <Route path={homePage} element={<SignIn />} />
        <Route path={dashboard} element={<Dashboard />} />
        <Route path={signUp} element={<SignUp />} />
      </Routes>
    </Router>
  );
};

export default App;