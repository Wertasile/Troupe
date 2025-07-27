import './App.css';
import { Route } from 'react-router-dom';
import Homepage from './Pages/Homepage';
import ChatPage from './Pages/ChatPage';
import LogonPage from './Pages/LogonPage';
import RegisterPage from './Pages/RegisterPage';

function App() {
  return (
    <div className="App">
      <Route path="/" component={Homepage} exact/>
      <Route path="/login" component={LogonPage} exact/>
      <Route path="/register" component={RegisterPage} exact/>
      <Route path="/chats" component={ChatPage}/>
    </div>
  );
}

export default App;
