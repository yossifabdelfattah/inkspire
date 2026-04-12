import AppRouter from './routes/AppRouter';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { AppShell, MainContent } from './styles/AppShell';

function App() {
  return (
    <AppShell>
      <Navbar />
      <MainContent>
        <AppRouter />
      </MainContent>
      <Footer />
    </AppShell>
  );
}

export default App;
