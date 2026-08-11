import React, { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { useEffect } from 'react';
import Home from '@/pages/home';

// Lazy-load all non-landing pages — they're never needed on first paint
const About       = lazy(() => import('@/pages/about'));
const Contact     = lazy(() => import('@/pages/contact'));
const ServicePage = lazy(() => import('@/pages/service'));
const IndustryPage = lazy(() => import('@/pages/industry'));

const queryClient = new QueryClient();

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [location]);
  return null;
}

// Minimal dark fallback while chunk loads
const PageFallback = () => (
  <div style={{ minHeight: '100vh', background: '#050505' }} />
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <ScrollToTop />
        <Suspense fallback={<PageFallback />}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
            <Route path="/services/:slug" component={ServicePage} />
            <Route path="/industries/:slug" component={IndustryPage} />
            <Route>{() => { window.location.replace("/"); return null; }}</Route>
          </Switch>
        </Suspense>
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
