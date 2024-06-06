import React, { lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ReactTooltip from 'react-tooltip';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { AuthProvider } from './context/AuthContext';
import { UnderDevelopmentProvider } from './context/UnderDevelopmentContext';

import SuspenseContainer from './components/SuspenseContainer';
import RequireAuth from './components/RequireAuth';

import './styles/app.sass';
import { Page } from './components';

const PageContent = lazy(() => import('./components/PageContent'));

const HomePage = lazy(() => import('./screens/HomePage'));

const UsersAndSettingsPage = lazy(() => import('./screens/Users&Settings'));
const UsersPage = lazy(() => import('./screens/Users&Settings/Users'));
const RolesPage = lazy(() => import('./screens/Users&Settings/Roles'));
const ServerPage = lazy(() => import('./screens/ServersPage'));

const SignIn = lazy(() => import('./screens/Authentication/SignIn'));
const ResetPassword = lazy(() =>
  import('./screens/Authentication/ResetPassword'),
);
const ForgotPassword = lazy(() =>
  import('./screens/Authentication/ForgotPassword'),
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
    },
  },
});

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <UnderDevelopmentProvider>
              <Routes>
                <Route exact path="/" element={<Navigate to="/home" />} />
                <Route
                  exact
                  path="/*"
                  element={
                    <RequireAuth redirectTo="/sign-in">
                      <Page />
                    </RequireAuth>
                  }
                >
                  <Route
                    index
                    path="home/*"
                    element={
                      <SuspenseContainer>
                        <PageContent
                          title="VCS - Server Management System"
                          wide
                        >
                          <HomePage />
                        </PageContent>
                      </SuspenseContainer>
                    }
                  />
                  <Route
                    path="servers/*"
                    element={
                      <SuspenseContainer>
                        <PageContent title="Servers" wide>
                          <ServerPage />
                        </PageContent>
                      </SuspenseContainer>
                    }
                  />
                  <Route
                    exact
                    path="setting/*"
                    element={
                      <SuspenseContainer>
                        <PageContent title="Users & Roles" wide>
                          <UsersAndSettingsPage />
                        </PageContent>
                      </SuspenseContainer>
                    }
                  >
                    <Route index element={<Navigate to="/setting/users" />} />
                    <Route path="users/*" element={<UsersPage />}></Route>
                    <Route path="roles/*" element={<RolesPage />}></Route>
                  </Route>
                </Route>

                {/* Authentication */}
                <Route
                  exact
                  path="/sign-in"
                  element={
                    <SuspenseContainer isFullScreen>
                      <SignIn />
                    </SuspenseContainer>
                  }
                />
                <Route
                  exact
                  path="/reset-password"
                  element={
                    <SuspenseContainer isFullScreen>
                      <ResetPassword />
                    </SuspenseContainer>
                  }
                />
                <Route
                  exact
                  path="/forgot-password"
                  element={
                    <SuspenseContainer isFullScreen>
                      <ForgotPassword />
                    </SuspenseContainer>
                  }
                />
              </Routes>
            </UnderDevelopmentProvider>
          </AuthProvider>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>

      <ToastContainer autoClose={1000} />
      <ReactTooltip />
    </>
  );
}

export default App;
