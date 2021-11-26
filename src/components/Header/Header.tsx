import './Header.css'

export const Header = () => {
    return (
        <header className="header">
            <nav className="navigation">
                <img className="userLogo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Employee.svg/1200px-Employee.svg.png" alt="...loading" />
                <div className="dashboard">
                    <a href="/">
                        Overview
                    </a>
                    <a href="/">
                        Details
                    </a>
                    <a href="/">
                        Recommendations
                    </a>
                    <a href="/">
                        Contacts
                    </a>
                </div>
                <a href="/" className="userSettings">
                    Profile settings
                </a>
            </nav>
        </header>
    )
}