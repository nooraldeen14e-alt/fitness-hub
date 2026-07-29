import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import Home from '@/pages/home';
import About from '@/pages/about';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route>
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground font-sans">
              <div className="text-center">
                <h1 className="text-9xl font-display font-bold text-stroke">404</h1>
                <p className="mt-4 font-mono uppercase tracking-widest text-muted-foreground">Void Reached.</p>
                <a href="/" className="mt-8 inline-block px-8 py-3 bg-primary text-primary-foreground font-mono uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-colors">
                  Return
                </a>
              </div>
            </div>
          </Route>
        </Switch>
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
