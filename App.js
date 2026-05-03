const { useState, useEffect, useRef, useMemo } = React;

const App = () => {
  // Tambahkan state loading internal
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    // Cek apakah RitusDB sudah tersedia di window
    const checkDb = setInterval(() => {
      if (window.RitusDB) {
        setIsDbReady(true);
        clearInterval(checkDb);
      }
    }, 100);
    return () => clearInterval(checkDb);
  }, []);

  if (!isDbReady) return null; // Jangan render apa pun sampai DB siap

  // ... sisa kode App Anda (handleLogin, useEffect auth, dll)
  // Ganti pemanggilan window.RitusDB menjadi variabel lokal agar lebih aman
  const { auth, db, onAuthStateChanged } = window.RitusDB;

// Icons & Components
const Icons = {
    Dashboard: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
    Input: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"></path></svg>,
    Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
    History: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 8v4l3 3"></path><circle cx="12" cy="12" r="9"></circle></svg>,
    Alert: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-rose-500"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>,
    Logout: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
    Lock: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>,
    Apparel: () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.62 1.96V7a2 2 0 002 2h2.62l.38 12a2 2 0 002 2h6a2 2 0 002-2l.38-12H20a2 2 0 002-2V5.42a2 2 0 00-1.62-1.96z"></path></svg>,
    Kaleng: () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="7" y="9" width="10" height="12" rx="2"></rect><path d="M9 9V6a3 3 0 016 0v3"></path><circle cx="12" cy="15" r="2"></circle></svg>,
    Aksesoris: () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 10a4 4 0 100-8 4 4 0 000 8zM12 10v12M9 16l3 3 3-3M8 22h8"></path></svg>
};

const PageHeader = memo(({ title, subtitle, icon }) => (
    <header className="mb-10 animate-content">
        <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">{icon}</div>
            <div>
                <h2 className="text-3xl font-black italic uppercase tracking-tighter heading-font">{title}</h2>
                <div className="flex items-center gap-2 mt-1">
                    <span className="w-6 h-[2px] bg-indigo-600"></span>
                    <p className="text-slate-400 font-bold italic uppercase text-[9px] tracking-widest">{subtitle}</p>
                </div>
            </div>
        </div>
    </header>
));

const StatPieChart = memo(({ data, title }) => {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        const labels = Object.keys(data);
        const values = Object.values(data);
        if (labels.length === 0) return;

        const ctx = canvasRef.current.getContext('2d');
        if (chartRef.current) chartRef.current.destroy();

        chartRef.current = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6'],
                    borderWidth: 5, borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                animation: { duration: 500 },
                plugins: {
                    legend: { position: 'bottom', labels: { font: { size: 9, weight: 'bold' }, padding: 15, usePointStyle: true } },
                    datalabels: {
                        color: '#fff', font: { weight: '900', size: 9 },
                        formatter: (val) => val,
                        backgroundColor: (ctx) => ctx.dataset.backgroundColor[ctx.dataIndex],
                        borderRadius: 4, padding: 4
                    }
                },
                cutout: '70%'
            }
        });
        return () => { if (chartRef.current) chartRef.current.destroy(); };
    }, [data]);

    return (
        <div className="card h-full flex flex-col items-center">
            <h4 className="text-[9px] font-black uppercase italic text-slate-400 mb-6 tracking-widest heading-font">{title}</h4>
            <div className="relative w-full h-[240px]">
                {Object.keys(data).length > 0 ? <canvas ref={canvasRef}></canvas> : <div className="h-full flex items-center justify-center text-[10px] text-slate-300 font-bold uppercase italic">No Activity</div>}
            </div>
        </div>
    );
});

function App() {
    const [user, setUser] = useState(null);
    const [isAuthenticating, setIsAuthenticating] = useState(true);
    const [inventory, setInventory] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [tab, setTab] = useState('dashboard');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [filterCategoryInv, setFilterCategoryInv] = useState('Semua');
    const [searchQuery, setSearchQuery] = useState('');
    const [toast, setToast] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState(null);
    const [outAmount, setOutAmount] = useState(""); 
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [loginError, setLoginError] = useState('');

    const appId = 'ritus-street-v1';

    useEffect(() => {
        const { onAuthStateChanged, auth } = window.RitusDB;
        return onAuthStateChanged(auth, (u) => {
            setUser(u);
            setIsAuthenticating(false);
        });
    }, []);

    useEffect(() => {
        if (!user) return;
        const { db, collection, onSnapshot } = window.RitusDB;
        
        const unsubInv = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'inventory'), 
            (s) => setInventory(s.docs.map(d => ({id: d.id, ...d.data()}))));
        
        const unsubTrans = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'transactions'), 
            (s) => setTransactions(s.docs.map(d => ({id: d.id, ...d.data()})).sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp))));

        return () => { unsubInv(); unsubTrans(); };
    }, [user]);

    const handleLogin = async (e) => {
        e.preventDefault();
        const { auth, signInWithEmailAndPassword } = window.RitusDB;
        try {
            await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
        } catch (error) {
            setLoginError('Kombinasi Email & Password Salah.');
        }
    };

    const handleLogout = async () => {
        const { auth, signOut } = window.RitusDB;
        await signOut(auth);
        setTab('dashboard');
    };

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 2500);
    };

    const groupedInventory = useMemo(() => {
        const apparelGroups = {};
        const otherItems = [];
        inventory.forEach(item => {
            if (item.category === 'Apparel') {
                if (!apparelGroups[item.name]) {
                    apparelGroups[item.name] = { name: item.name, category: 'Apparel', sizes: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 }, id: item.id };
                }
                if (apparelGroups[item.name].sizes.hasOwnProperty(item.size)) {
                    apparelGroups[item.name].sizes[item.size] = item.stock;
                }
            } else otherItems.push(item);
        });
        return [...Object.values(apparelGroups), ...otherItems];
    }, [inventory]);

    const filteredInventory = useMemo(() => {
        return groupedInventory.filter(item => {
            const matchesCategory = filterCategoryInv === 'Semua' || item.category === filterCategoryInv;
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [groupedInventory, filterCategoryInv, searchQuery]);

    const { inStats, outStats } = useMemo(() => {
        const i = {}; const o = {};
        transactions.forEach(t => {
            const cat = t.category || 'Lainnya';
            if (t.type === 'in') i[cat] = (i[cat] || 0) + t.amount;
            else o[cat] = (o[cat] || 0) + t.amount;
        });
        return { inStats: i, outStats: o };
    }, [transactions]);

    const saveItemToCloud = async (name, size, category, amount, type, date) => {
        const { db, doc, setDoc, addDoc, collection, getDoc } = window.RitusDB;
        const docId = `${name.toLowerCase().trim().replace(/\s+/g, '-')}-${size.toLowerCase().trim().replace(/\s+/g, '-')}`;
        try {
            const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'inventory', docId);
            const docSnap = await getDoc(docRef);
            let currentStock = docSnap.exists() ? (docSnap.data().stock || 0) : 0;
            const val = parseInt(amount);
            const isOut = type === 'out';
            const newStock = isOut ? currentStock - val : currentStock + val;
            
            if (newStock < 0) { showToast("Stok tidak mencukupi!"); return false; }
            
            await setDoc(docRef, { name, size, category, stock: Math.max(0, newStock), lastUpdated: new Date().toISOString() }, { merge: true });
            await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'transactions'), {
                itemName: `${name} (${size})`, type: isOut ? 'out' : 'in', category, amount: val, timestamp: date ? new Date(date).toISOString() : new Date().toISOString()
            });
            return true;
        } catch (e) { return false; }
    };

    if (isAuthenticating) return null;

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
                <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl animate-content">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl text-slate-900 logo-font mb-2">RITUS STREET</h1>
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">WAREHOUSE ACCESS</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-5">
                        <input type="email" required placeholder="EMAIL ADMIN" value={loginData.email} onChange={(e) => setLoginData({...loginData, email: e.target.value})} className="h-14" />
                        <input type="password" required placeholder="PASSWORD" value={loginData.password} onChange={(e) => setLoginData({...loginData, password: e.target.value})} className="h-14" />
                        {loginError && <p className="text-rose-500 text-[10px] font-black uppercase text-center">{loginError}</p>}
                        <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black italic uppercase text-xs tracking-widest shadow-lg flex items-center justify-center gap-3"><Icons.Lock /> MASUK SISTEM</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            {confirmDialog && (
                <div className="modal-overlay">
                    <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl animate-content text-center">
                        <h3 className="text-xl font-black italic uppercase mb-1 heading-font">PENGELUARAN</h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase mb-6 tracking-widest">{confirmDialog.name} ({confirmDialog.size})</p>
                        <input type="number" value={outAmount} placeholder="0" autoFocus onChange={(e) => setOutAmount(e.target.value)} className="text-center text-5xl font-black italic border-none bg-transparent heading-font mb-6 w-full" />
                        <div className="flex gap-4">
                            <button onClick={() => { setConfirmDialog(null); setOutAmount(""); }} className="flex-1 py-4 rounded-xl font-black uppercase text-[10px] bg-slate-100">BATAL</button>
                            <button onClick={() => { if(parseInt(outAmount) > 0) { confirmDialog.action(parseInt(outAmount)); setConfirmDialog(null); setOutAmount(""); } }} className="flex-1 py-4 rounded-xl font-black uppercase text-[10px] text-white bg-indigo-600">VERIFIKASI</button>
                        </div>
                    </div>
                </div>
            )}

            <aside className="sidebar w-full md:w-64 flex flex-col p-6 sticky top-0 h-auto md:h-screen">
                <div className="mb-10"><h1 className="text-2xl text-white logo-font">RITUS STREET</h1></div>
                <nav className="flex-1 space-y-1">
                    <div onClick={() => setTab('dashboard')} className={`nav-item ${tab === 'dashboard' ? 'nav-active' : 'nav-inactive'}`}><Icons.Dashboard /> Dash</div>
                    <div onClick={() => setTab('input')} className={`nav-item ${tab === 'input' ? 'nav-active' : 'nav-inactive'}`}><Icons.Input /> Input</div>
                    <div onClick={() => setTab('inventory')} className={`nav-item ${tab === 'inventory' ? 'nav-active' : 'nav-inactive'}`}><Icons.Search /> Stok</div>
                    <div onClick={() => setTab('history')} className={`nav-item ${tab === 'history' ? 'nav-active' : 'nav-inactive'}`}><Icons.History /> Log</div>
                </nav>
                <div onClick={handleLogout} className="mt-auto py-4 text-rose-400 font-black text-[10px] uppercase italic cursor-pointer flex items-center gap-3 border-t border-white/5"><Icons.Logout /> Logout</div>
            </aside>

            <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                {tab === 'dashboard' && (
                    <div className="max-w-6xl mx-auto">
                        <PageHeader title="DASHBOARD" subtitle="RINGKASAN REAL-TIME" icon={<Icons.Dashboard />} />
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                            <div className="card"><p className="text-[9px] font-black uppercase text-slate-400">VARIAN</p><h3 className="text-4xl font-black italic mt-1 heading-font text-indigo-600">{inventory.length}</h3></div>
                            <div className="card bg-slate-900 text-white"><p className="text-[9px] font-black uppercase opacity-40">TOTAL STOK</p><h3 className="text-4xl font-black italic mt-1 heading-font text-indigo-400">{inventory.reduce((a, b) => a + (b.stock || 0), 0)}</h3></div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <StatPieChart data={inStats} title="MASUK PER KATEGORI" />
                            <StatPieChart data={outStats} title="KELUAR PER KATEGORI" />
                        </div>
                    </div>
                )}

                {tab === 'input' && (
                    <div className="max-w-xl mx-auto">
                        <PageHeader title="INPUT" subtitle="TAMBAH DATA BARANG" icon={<Icons.Input />} />
                        {!selectedCategory ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {['Apparel', 'Kaleng', 'Aksesoris'].map(c => (
                                    <div key={c} onClick={() => setSelectedCategory(c)} className="card p-8 flex flex-col items-center cursor-pointer hover:border-indigo-500 border-2">
                                        <div className="mb-4 text-indigo-600">{Icons[c] ? Icons[c]() : <Icons.Input />}</div>
                                        <h3 className="font-black italic uppercase text-sm">{c}</h3>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <form onSubmit={async (e) => { 
                                e.preventDefault(); 
                                const fd = new FormData(e.target); 
                                if(selectedCategory === 'Apparel') { 
                                    for(let s of ['S','M','L','XL','XXL']) { 
                                        let q = fd.get(`qty_${s}`); 
                                        if(q > 0) await saveItemToCloud(fd.get('name'), s, 'Apparel', q, fd.get('type'), fd.get('date')); 
                                    } 
                                } else { 
                                    await saveItemToCloud(fd.get('name'), fd.get('size'), selectedCategory, fd.get('amount'), fd.get('type'), fd.get('date')); 
                                } 
                                showToast("BERHASIL DISIMPAN!"); 
                                setSelectedCategory(null);
                            }} className="card border-2 border-slate-900 p-8 space-y-4">
                                <button type="button" onClick={() => setSelectedCategory(null)} className="text-[10px] font-black text-indigo-600 italic">← KEMBALI</button>
                                <input name="name" required placeholder="NAMA ARTIKEL" className="h-14" />
                                <div className="grid grid-cols-2 gap-4">
                                    <select name="type" className="h-14"><option value="in">MASUK (+)</option><option value="out">KELUAR (-)</option></select>
                                    <input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="h-14" />
                                </div>
                                {selectedCategory === 'Apparel' ? (
                                    <div className="grid grid-cols-5 gap-2 bg-slate-50 p-4 rounded-xl">
                                        {['S','M','L','XL','XXL'].map(s => <div key={s} className="text-center"><label className="text-[9px] font-black mb-1 block">{s}</label><input name={`qty_${s}`} type="number" placeholder="0" className="!p-2 text-center text-xs" /></div>)}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                        <input name="size" required placeholder="WARNA/INFO" className="h-14" />
                                        <input name="amount" type="number" required placeholder="QTY" className="h-14" />
                                    </div>
                                )}
                                <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black italic uppercase text-xs shadow-lg">SIMPAN DATA</button>
                            </form>
                        )}
                    </div>
                )}

                {tab === 'inventory' && (
                    <div className="max-w-6xl mx-auto">
                        <PageHeader title="STOK" subtitle="DAFTAR PERSEDIAAN" icon={<Icons.Search />} />
                        <input type="text" placeholder="CARI PRODUK..." className="mb-8 h-14 w-full px-6 rounded-xl border" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredInventory.map(item => (
                                <div key={item.id} className="card group">
                                    <h3 className="text-xl font-black italic uppercase heading-font mb-4">{item.name}</h3>
                                    {item.category === 'Apparel' ? (
                                        <div className="grid grid-cols-5 gap-2 border-t pt-4">
                                            {Object.entries(item.sizes).map(([sz, stock]) => (
                                                <div key={sz} className="text-center">
                                                    <p className="text-[8px] font-black text-slate-400 mb-1">{sz}</p>
                                                    <div className="p-2 rounded-xl border bg-slate-50">
                                                        <p className="text-sm font-black italic">{stock}</p>
                                                    </div>
                                                    <button onClick={() => setConfirmDialog({ name: item.name, size: sz, action: (amt) => saveItemToCloud(item.name, sz, 'Apparel', amt, 'out')})} className="w-full mt-2 py-1 bg-slate-900 text-white rounded-lg font-black text-[9px] opacity-0 group-hover:opacity-100">-</button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-end border-t pt-4">
                                            <div><p className="text-[8px] font-black text-slate-400 uppercase">INFO: {item.size}</p><p className="text-4xl font-black italic">{item.stock}</p></div>
                                            <button onClick={() => setConfirmDialog({ name: item.name, size: item.size, action: (amt) => saveItemToCloud(item.name, item.size, item.category, amt, 'out')})} className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl">-</button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {tab === 'history' && (
                    <div className="max-w-6xl mx-auto">
                        <PageHeader title="LOG" subtitle="AKTIVITAS ARUS BARANG" icon={<Icons.History />} />
                        <div className="card p-0 overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-900 text-[9px] font-black text-slate-400 uppercase italic">
                                    <tr><th className="p-4">PRODUK</th><th className="p-4 text-center">TIPE</th><th className="p-4 text-right">JUMLAH</th></tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {transactions.slice(0, 50).map(t => (
                                        <tr key={t.id} className="text-[11px] font-bold uppercase italic">
                                            <td className="p-4"><p className="font-black text-slate-900">{t.itemName}</p><p className="text-[8px] text-slate-400">{new Date(t.timestamp).toLocaleString('id-ID')}</p></td>
                                            <td className="p-4 text-center"><span className={`px-2 py-0.5 rounded-lg text-[8px] ${t.type === 'in' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{t.type.toUpperCase()}</span></td>
                                            <td className={`p-4 text-right font-black text-base ${t.type === 'in' ? 'text-emerald-500' : 'text-rose-500'}`}>{t.type === 'in' ? '+' : '-'}{t.amount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
            {toast && <div className="fixed bottom-6 right-6 px-6 py-4 rounded-2xl bg-slate-900 text-white text-[9px] font-black uppercase italic z-[150] shadow-2xl">{toast}</div>}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
