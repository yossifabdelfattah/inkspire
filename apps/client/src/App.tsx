import AppRouter from './routes/AppRouter';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import * as S from './styles/AppShell.styled';

function App() {
  return (
    <S.AppShell>
      <Navbar />
      <S.MainContent>
        <AppRouter />
      </S.MainContent>
      <Footer />
    </S.AppShell>
  );
}

export default App;
