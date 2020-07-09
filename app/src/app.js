import React, { lazy, Suspense } from 'react';
import { Router, Route, Switch } from 'wouter';
import { AuthenticatedRoute } from './components/AuthenticatedRoute';
import { Loader } from './components/Loader';

import { HomePage } from './pages/Home';

import './app.scss';
const destructModule = (name) => (module) => ({ default: module[name] });

const LoginPage = lazy(() => import('./pages/Login').then(destructModule('LoginPage')));
const DashboardPage = lazy(() => import('./pages/Dashboard').then(destructModule('DashboardPage')));
const AboutPage = lazy(() => import('./pages/About').then(destructModule('AboutPage')));
const PrivacyPage = lazy(() => import('./pages/Privacy').then(destructModule('PrivacyPage')));

const basePath = process.env.NODE_ENV === 'production' ? 'scholar' : '/';

export const AppRouter = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Router base={basePath}>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/privacy" component={PrivacyPage} />
          <Route />
          <AuthenticatedRoute path="/dashboard" component={DashboardPage} />
          <Route path="/*">404, not found!</Route>
        </Switch>
      </Router>
    </Suspense>
  );
};
