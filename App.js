const { useState, useEffect } = React;

const App = () => {
    const [isDbReady, setIsDbReady] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            if (window.RitusDB) {
                setIsDbReady(true);
                clearInterval(interval);
            }
        }, 100);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!isDbReady) return;
        const { auth, onAuthStateChanged } = window.RitusDB;
        return onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
    }, [isDbReady]);

    if (!isDbReady) return null;

    return (
        <div class="min-h-screen text-white p-8">
            {user ? (
                <div>
                    <h1 class="text-2xl font-bold">Dashboard Ritus Street</h1>
                    <p>Selamat datang, {user.email}</p>
                    <button onClick={() => window.RitusDB.signOut(window.RitusDB.auth)} class="mt-4 bg-red-500 px-4 py-2 rounded">Keluar</button>
                </div>
            ) : (
                <div class="max-w-md mx-auto bg-slate-800 p-6 rounded-lg shadow-xl">
                    <h2 class="text-xl mb-4">Admin Login</h2>
                    <p class="text-sm text-slate-400">Silakan masuk untuk mengelola inventaris.</p>
                    {/* Form Login Anda di sini */}
                </div>
            )}
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
