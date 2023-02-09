import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from './Dashboard/Dashboard';

import SignIn from './SignIn/SignIn';
import SignUp from './SignUp/SignUp'



import { path } from "helpers/configs";

import './app.css';

const App = (): JSX.Element => {
  const { homePage, signIn, signUp } = path;

  return (
    <Router>
      <Routes>
        <Route path={homePage} element={<Dashboard />} />
        <Route path={signIn} element={<SignIn />} />
        <Route path={signUp} element={<SignUp />} />
      </Routes>
    </Router>
  );
};

export default App;