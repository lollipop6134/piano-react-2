import './App.css';
import { Menu } from './components/menu/menu';
import { Main } from './pages/main/main';
import { Lessons } from './pages/lessons/lessons';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PianoPage } from './pages/pianoPage/pianoPage';
import { LessonPage } from './pages/lessonPage/lessonPage';
import Auth from './pages/auth/auth';
import Account from './pages/account/account';
import { isAuthenticated } from './AuthService';
import { LessonConstructor } from './pages/lessonConstructor/lessonConstructor';

function App() {

  return (
    <>
      <div className='wrapper'>
        <Menu />
        <div className='content'>
          <Routes>
            <Route path='/' element={<Main />} />
            <Route path='/piano' element={<PianoPage />} />
            <Route path='/lessons' element={<Lessons/>} />
            <Route path='/lesson/:id' element={<LessonPage/>} />
            <Route
              path='/account'
              element={isAuthenticated() ? <Account /> : <Auth />}
            />
            <Route path='/lesson/:id/constructor' element={<LessonConstructor/>} />
            <Route path='/*' element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;