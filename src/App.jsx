import logo from './logo.svg';
import './App.css';
import Question from './feature/question/Question';
import AddTechnology from './feature/admin/AddTechnology';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminDashboard from './feature/admin/AdminDashboard';
import Adminnavabar from './feature/navabars/adminnavabar';
import { useEffect } from 'react';
import { notifyInfo } from './components/Toast';

function App() {
  const navigate = useNavigate();
  useEffect(()=>{
    if(!window.localStorage.getItem("token")){
      notifyInfo("Please login")
      navigate("/login")
    }
    else if(window.localStorage.getItem("role") == "Admin"){
      navigate("/admin")
    }
  },[])
  return (
    <div className=' '>
          <Adminnavabar></Adminnavabar>
         <Outlet></Outlet>
    </div>
  );
}

export default App;
