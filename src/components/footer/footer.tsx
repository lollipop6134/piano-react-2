import './footer.css';
import { Link } from 'react-router-dom';

export function Footer() {
    return (
        <div id="footer">
            <img src='/images/logo.png' alt="logo" />
            <div>2024 Kirill Tarochkin</div>
            <div id="socials">
                <Link to={"https://www.instagram.com/kirilltarochkin/"}><img src='/images/Instagram.png' alt="instagram" /></Link>
                <Link to={"https://t.me/krkrkrrkin"}><img src='/images/Telegram.png' alt="telegram" /></Link>
                <Link to={"https://www.linkedin.com/in/kirill-tarochkin-6332a328b/"}><img src='/images/Linkedin.png' alt="linkedin" /></Link>
            </div>
        </div>
    )
}