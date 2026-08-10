import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { useEffect } from 'react';
import Home from '@/pages/home';
import About from '@/pages/about';
import Contact from '@/pages/contact';
import ServicePage from '@/pages/service';

const queryClient = new QueryClient();

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [location]);
  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <ScrollToTop />
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/services/:slug" component={ServicePage} />
          <Route>{() => { window.location.replace("/"); return null; }}</Route>
        </Switch>
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
