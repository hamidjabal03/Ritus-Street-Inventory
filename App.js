const { useState, useEffect } = React;

const App = () => {
    const [isDbReady, setIsDbReady] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Cek ketersediaan database
        if (window.RitusDB) {
            setIsDbReady(true);
            const { auth, onAuthStateChanged } = window.RitusDB;
            onAuthStateChanged(auth, (currentUser) => {
                setUser(currentUser);
            });
        }
    }, []);

    if (!isDbReady) return null;

    return (
        <div className="min-h-screen text-white p-8">
            {user ? (
                <div className="max-w-4xl mx-auto bg-slate-800 p-6 rounded-lg">
                    <h1 className="text-2xl font-bold mb-4">Dashboard Ritus Street</h1>
                    <p className="mb-4">Logged in as: <span className="text-blue-400">{user.email}</span></p>
                    <button 
                        onClick={() => window.RitusDB.signOut(window.RitusDB.auth)} 
                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
                    >
                        Keluar
                    </button>
                </div>
            ) : (
                <div className="max-w-md mx-auto mt-20 bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
                    <h2 className="text-2xl font-bold mb-2 text-center">Admin Login</h2>
                    <p className="text-slate-400 text-sm text-center mb-6">Inventory Management System</p>
                    
                    <div className="space-y-4">
                        <input type="email" placeholder="Email" className="w-full bg-slate-900 border border-slate-700 p-3 rounded focus:outline-none focus:border-blue-500" />
                        <input type="password" placeholder="Password" className="w-full bg-slate-900 border border-slate-700 p-3 rounded focus:outline-none focus:border-blue-500" />
                        <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-bold transition">Masuk</button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Pastikan proses render dilakukan setelah App didefinisikan
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
