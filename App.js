const { useState, useEffect } = React;

const App = () => {
    const [isDbReady, setIsDbReady] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Cek database setiap 100ms sampai ketemu
        const checkDB = setInterval(() => {
            if (window.RitusDB) {
                setIsDbReady(true);
                const { auth, onAuthStateChanged } = window.RitusDB;
                onAuthStateChanged(auth, (currentUser) => {
                    setUser(currentUser);
                });
                clearInterval(checkDB);
            }
        }, 100);
        return () => clearInterval(checkDB);
    }, []);

    // Jika DB belum siap, kita beri indikator kecil di layar gelap
    if (!isDbReady) return <div className="text-white p-4">Initializing System...</div>;

    return (
        <div className="min-h-screen text-white p-8">
            {user ? (
                <div className="max-w-4xl mx-auto bg-slate-800 p-6 rounded-lg border border-slate-700">
                    <h1 className="text-2xl font-bold mb-4">Dashboard Ritus Street</h1>
                    <p className="mb-4 text-slate-300">Selamat datang, {user.email}</p>
                    <button 
                        onClick={() => window.RitusDB.signOut(window.RitusDB.auth)} 
                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
                    >
                        Log Out
                    </button>
                </div>
            ) : (
                <div className="max-w-md mx-auto mt-20 bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
                    <h2 className="text-2xl font-bold mb-2 text-center">Admin Login</h2>
                    <p className="text-slate-400 text-sm text-center mb-6 font-mono">INVENTORY SYSTEM V1.0</p>
                    
                    <div className="space-y-4">
                        <input type="email" id="login-email" placeholder="Email" className="w-full bg-slate-900 border border-slate-700 p-3 rounded focus:outline-none focus:border-blue-500 text-white" />
                        <input type="password" id="login-password" placeholder="Password" className="w-full bg-slate-900 border border-slate-700 p-3 rounded focus:outline-none focus:border-blue-500 text-white" />
                        <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-bold transition shadow-lg shadow-blue-900/20">
                            Masuk Ke Sistem
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// BAGIAN PALING PENTING: Render ke div #root
const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
}
