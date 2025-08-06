import React, { useState, useEffect, useContext, createContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('basti_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData) => {
        localStorage.setItem('basti_user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('basti_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};



// Navbar Component 
function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/'); 
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">Basti Ki Pathshala</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center">
                        {user ? (
                            <>
                                <li className="nav-item">
                                    <span className="navbar-text me-3">
                                        Welcome, {user.name}!
                                    </span>
                                </li>
                                <li className="nav-item">
                                    <button onClick={handleLogout} className="btn btn-outline-light">Logout</button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link to="/volunteer-login" className="nav-link">Volunteer Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/admin-login" className="nav-link">Admin Login</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

// Home Component
function Home() {
    const { user } = useContext(AuthContext);
    return (
        <div className="container text-center mt-5">
            <header className="p-5 mb-4 bg-info bg-opacity-10 rounded-3">
                <div className="container-fluid py-5">
                    <h1 className="display-4 fw-bold">Welcome to Basti Ki Pathshala Foundation</h1>
                    <p className="fs-4">Empowering through education. Join us in making a difference.</p>
                     {user && user.role === 'admin' && (
                        <Link className="btn btn-info btn-lg" to="/admin/dashboard">View Dashboard</Link>
                    )}
                    {!user && (
                         <Link className="btn btn-primary btn-lg mt-3" to="/volunteer-register" role="button">Become a Volunteer</Link>
                    )}
                </div>
            </header>
        </div>
    );
}

// AdminLogin Component (Now uses AuthContext)
function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault();
        setError('');

        axios.post('http://localhost:5000/api/admin/login', { username, password })
            .then(res => {
                if (res.data.success) {
                    login({ name: 'Admin', role: 'admin' });
                    navigate('/admin/dashboard');
                }
            })
            .catch(err => {
                setError('Invalid credentials. Please try again.');
                console.error(err);
            });
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '500px' }}>
            <h3>Admin Login</h3>
            {error && <div className="alert alert-danger mt-3">{error}</div>}
            <form onSubmit={onSubmit} className="mt-3">
                <div className="form-group mb-3"><label>Username:</label><input type="text" required className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} /></div>
                <div className="form-group mb-3"><label>Password:</label><input type="password" required className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                <div className="form-group"><input type="submit" value="Login" className="btn btn-primary" /></div>
            </form>
        </div>
    );
}

// VolunteerLogin Component (Now uses AuthContext)
function VolunteerLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault();
        setError('');

        axios.post('http://localhost:5000/api/volunteer/login', { email, password })
            .then(res => {
                if (res.data.success) {
                    login({ name: res.data.volunteer.fullName, role: 'volunteer' });
                    navigate('/');
                }
            })
            .catch(err => {
                setError('Invalid credentials. Please try again.');
                console.error(err);
            });
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '500px' }}>
            <h3>Volunteer Login</h3>
            {error && <div className="alert alert-danger mt-3">{error}</div>}
            <form onSubmit={onSubmit} className="mt-3">
                <div className="form-group mb-3"><label>Email:</label><input type="email" required className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                <div className="form-group mb-3"><label>Password:</label><input type="password" required className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                <div className="form-group"><input type="submit" value="Login" className="btn btn-primary" /></div>
            </form>
            <p className="mt-3">Don't have an account? <Link to="/volunteer-register">Register here</Link></p>
        </div>
    );
}


// VolunteerRegister Component
function VolunteerRegister() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [occupation, setOccupation] = useState('');
    const [whyJoin, setWhyJoin] = useState('');
    const navigate = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault();
        const newVolunteer = { fullName, email, phone, password, address, occupation, whyJoin };
        axios.post('http://localhost:5000/api/volunteer/register', newVolunteer)
            .then(res => {
                console.log(res.data);
                alert('Registration successful! Please login.');
                navigate('/volunteer-login');
            })
            .catch(err => {
                console.error(err);
                alert('Registration failed. Please check the console for errors.');
            });
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '600px' }}>
            <h3>Register as a Volunteer</h3>
            <form onSubmit={onSubmit} className="mt-3">
                <div className="form-group mb-2"><label>Full Name:</label><input type="text" required className="form-control" value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
                <div className="form-group mb-2"><label>Email:</label><input type="email" required className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                <div className="form-group mb-2"><label>Phone:</label><input type="text" required className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
                <div className="form-group mb-2"><label>Password:</label><input type="password" required className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                <div className="form-group mb-2"><label>Address:</label><input type="text" required className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} /></div>
                <div className="form-group mb-2"><label>Occupation:</label><input type="text" required className="form-control" value={occupation} onChange={(e) => setOccupation(e.target.value)} /></div>
                <div className="form-group mb-3"><label>Why do you want to join?</label><textarea required className="form-control" value={whyJoin} onChange={(e) => setWhyJoin(e.target.value)} /></div>
                <div className="form-group"><input type="submit" value="Register" className="btn btn-primary" /></div>
            </form>
        </div>
    );
}

// AdminDashboard Component
function AdminDashboard() {
    const [volunteers, setVolunteers] = useState([]);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Protect this route
        if (!user || user.role !== 'admin') {
            navigate('/admin-login');
            return;
        }

        axios.get('http://localhost:5000/api/admin/volunteers')
            .then(response => {
                setVolunteers(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the volunteers!", error);
            });
    }, [user, navigate]);

    return (
        <div className="container mt-5">
            <h3>Registered Volunteers</h3>
            <div className="table-responsive">
                <table className="table table-striped mt-3">
                    <thead className="thead-light">
                        <tr>
                            <th>Full Name</th><th>Email</th><th>Phone</th><th>Address</th><th>Occupation</th><th>Reason to Join</th>
                        </tr>
                    </thead>
                    <tbody>
                        {volunteers.length > 0 ? volunteers.map(volunteer => (
                            <tr key={volunteer._id}>
                                <td>{volunteer.fullName}</td><td>{volunteer.email}</td><td>{volunteer.phone}</td><td>{volunteer.address}</td><td>{volunteer.occupation}</td><td>{volunteer.whyJoin}</td>
                            </tr>
                        )) : (
                            <tr><td colSpan="6" className="text-center">No volunteers have registered yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// --- Main App Component ---
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="container-fluid p-0">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/volunteer-login" element={<VolunteerLogin />} />
              <Route path="/volunteer-register" element={<VolunteerRegister />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
