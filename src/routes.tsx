import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './container/Login';

const AppRouter = () => {
  return (
    <Router>
      <Route path="/" component={Login} />
    </Router>
  );
};

export default AppRouter;