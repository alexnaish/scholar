import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'wouter';
import { AuthenticatedRoute } from './components/AuthenticatedRoute';
import { Loader } from './components/Loader';
import { AuthProvider } from './contexts/Auth';
import { HomePage } from './pages/Home';

import './app.scss';

const destructModule = (name) => (module) => ({ default: module[name] });
const LoginPage = lazy(() => import('./pages/Login').then(destructModule('LoginPage')));
const LogoutPage = lazy(() => import('./pages/Logout').then(destructModule('LogoutPage')));
const DashboardPage = lazy(() => import('./pages/Dashboard').then(destructModule('DashboardPage')));
const AboutPage = lazy(() => import('./pages/About').then(destructModule('AboutPage')));
const PrivacyPage = lazy(() => import('./pages/Privacy').then(destructModule('PrivacyPage')));
const ErrorPage = lazy(() => import('./pages/Error').then(destructModule('ErrorPage')));

export const AppRouter = () => {
	return (
		<AuthProvider>
			<Suspense fallback={<Loader />}>
				<Switch>
					<Route path="/" component={HomePage} />
					<Route path="/login" component={LoginPage} />
					<Route path="/logout" component={LogoutPage} />
					<Route path="/about" component={AboutPage} />
					<Route path="/privacy" component={PrivacyPage} />
					<AuthenticatedRoute path="/dashboard" component={DashboardPage} />
					<Route path="/:rest*" component={() => <ErrorPage statusCode="404" />} />
				</Switch>
			</Suspense>
		</AuthProvider>
	);
};
