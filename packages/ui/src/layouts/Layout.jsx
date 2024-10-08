import { Outlet } from 'react-router-dom';
import './Layout.css';

function Layout() {
    const date = new Date();
    let year = date.getFullYear();
    return (
        <div>
            <header className='header'>
                <h1 className='title'>Rolytics</h1>
                <nav className='navbar'>
                    <a href="/">Home</a>
                    <a href="/login">Login</a>
                    <a href="/register">Register</a>
                </nav>
            </header>
            <main>
                <Outlet />
            </main>

            <footer className='footer'>
                <p>© {year} Rolytics</p>
            </footer>
        </div>
    );
}

export default Layout;
