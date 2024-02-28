import './menu.css';
import { Link, Outlet } from 'react-router-dom';

export function Menu() {
    return (
        <>
        <div id="menu-container">
            <div id="left">
                <Link to="/"><img src='/images/logo.png' alt='logo'></img></Link>
                <Link to="/piano"><button>Piano</button></Link>
                <Link to="/lessons" onClick={() => {localStorage.setItem('practiceMode', "false")}}><button>Lessons</button></Link>
            </div>
            <Link to="/account"><button>Account</button></Link>
        </div>
        <Outlet />
        </>
    )
}