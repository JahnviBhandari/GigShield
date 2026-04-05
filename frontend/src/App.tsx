import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Shield, 
  ChevronRight, 
  MapPin, 
  Smartphone, 
  CloudRain, 
  Wind, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  User as UserIcon, 
  LogOut,
  Settings,
  LayoutDashboard,
  Coins,
  ArrowRight,
  Bike,
  Utensils,
  Car,
  Zap,
  Lock,
  Search,
  Users,
  BarChart3,
  Calendar,
  AlertCircle,
  Truck,
  Phone,
  Star,
  Edit2,
  CreditCard,
  Activity,
  RefreshCw
} from 'lucide-react';
import { Button, Input, Card, Badge } from './components/ui';
import { Platform, Vehicle, Shift, User } from './types';
import { sendOtp, verifyOtp, adminLogin, detectLiveLocation, getCurrentCoords, fetchLiveWeather, WeatherData, registerUserDB, getUserByPhone, updateUserDB, createClaimDB, getUserClaimsDB } from './services/api';

// --- APP COMPONENT ---
export default function App() {
  const [view, setView] = useState<'landing' | 'signup' | 'onboarding' | 'dashboard' | 'admin-login' | 'admin'>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [demoOtp, setDemoOtp] = useState('');

  // Restore session — check localStorage then silently sync from DB
  useEffect(() => {
    const savedUsers = localStorage.getItem('gigshield_registered_users');
    if (savedUsers) setRegisteredUsers(JSON.parse(savedUsers));
    const savedUser = localStorage.getItem('gigshield_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setCurrentUser(parsed);
      setView('dashboard');
      getUserByPhone(parsed.phone).then(res => {
        if (res.success && res.data) {
          setCurrentUser(res.data as any);
          localStorage.setItem('gigshield_user', JSON.stringify(res.data));
        }
      }).catch(() => {});
    }
  }, []);

  const handleLogin = async (mobile: string) => {
    if (mobile.length !== 10) {
      toast.error('Enter a valid 10-digit number');
      return;
    }
    // Try DB first, fall back to localStorage
    try {
      const res = await getUserByPhone(mobile);
      if (res.success && res.data) {
        const user = res.data as any;
        setCurrentUser(user);
        localStorage.setItem('gigshield_user', JSON.stringify(user));
        setView('dashboard');
        toast.success('Login Successful!');
        return;
      }
    } catch {}
    const existingUser = registeredUsers.find(u => u.phone === mobile);
    if (existingUser) {
      setCurrentUser(existingUser);
      localStorage.setItem('gigshield_user', JSON.stringify(existingUser));
      setView('dashboard');
      toast.success('Login Successful!');
    } else {
      toast.error('Number not registered. Please Sign Up.');
    }
  };

  const saveNewUser = async (user: User) => {
    // Save to localStorage immediately for fast UX
    const updatedUsers = [...registeredUsers, user];
    setRegisteredUsers(updatedUsers);
    localStorage.setItem('gigshield_registered_users', JSON.stringify(updatedUsers));
    setCurrentUser(user);
    localStorage.setItem('gigshield_user', JSON.stringify(user));
    setView('dashboard');
    toast.success('Account Created Successfully!');
    // Persist to PostgreSQL in background
    try {
      await registerUserDB(user);
    } catch (e) {
      console.warn('DB save failed (offline?), data in localStorage:', e);
    }
  };

  // Handle Auth — Demo OTP (OTP shown in UI, no SMS needed)
  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      toast.error('Please enter a valid 10-digit number');
      return;
    }
    setOtpLoading(true);
    try {
      const result = await sendOtp(phone);
      if (result.success) {
        setOtpSent(true);
        toast.success(result.message || 'OTP sent to your mobile!');
        // Dev mode: show OTP in toast if backend returns it
        if (result.devOtp) {
          setDemoOtp(result.devOtp);
        }
      } else {
        toast.error(result.error || 'Failed to send OTP. Try again.');
      }
    } catch {
      toast.error('Cannot reach server. Please check your connection.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }
    setOtpLoading(true);
    try {
      const result = await verifyOtp(phone, otp);
      if (result.success) {
        const existingUser = registeredUsers.find(u => u.phone === phone);
        if (existingUser) {
          setCurrentUser(existingUser);
          localStorage.setItem('gigshield_user', JSON.stringify(existingUser));
          setView('dashboard');
          toast.success('Welcome back!');
        } else {
          setView('onboarding');
        }
      } else {
        toast.error(result.error || 'Invalid OTP. Please try again.');
      }
    } catch {
      toast.error('Cannot reach server. Please check your connection.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('gigshield_user');
    setCurrentUser(null);
    setView('landing');
  };

  const handleAdminLogin = async () => {
    try {
      const result = await adminLogin(adminPassword);
      if (result.success) {
        setView('admin');
        toast.success('Admin access granted');
      } else {
        toast.error(result.error || 'Invalid admin password');
      }
    } catch {
      toast.error('Cannot reach server.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <Toaster position="top-center" 
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
      
      <AnimatePresence mode="wait">
        {view === 'landing' && <LandingView 
          onPhoneChange={setPhone} 
          phone={phone} 
          otpSent={otpSent} 
          setOtpSent={setOtpSent}
          onSendOtp={handleSendOtp} 
          onVerifyOtp={handleVerifyOtp}
          otp={otp}
          setOtp={setOtp}
          setView={setView}
          onLogin={handleLogin}
          otpLoading={otpLoading}
          demoOtp={demoOtp}
        />}
        
        {view === 'onboarding' && <OnboardingView 
          phone={phone} 
          onComplete={saveNewUser} 
        />}

        {view === 'dashboard' && currentUser && <DashboardView 
          user={currentUser} 
          onLogout={handleLogout}
        />}

        {view === 'admin-login' && <AdminLoginView 
          password={adminPassword} 
          setPassword={setAdminPassword} 
          onLogin={handleAdminLogin}
          onBack={() => setView('landing')}
        />}

        {view === 'admin' && <AdminDashboardView onLogout={() => setView('landing')} users={registeredUsers} />}
      </AnimatePresence>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function LandingView({ 
  phone, 
  onPhoneChange, 
  otpSent, 
  setOtpSent, 
  onSendOtp, 
  onVerifyOtp, 
  otp, 
  setOtp, 
  setView,
  onLogin,
  otpLoading,
  demoOtp
}: any) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex flex-col items-center justify-center min-h-screen p-6 bg-[#0a0f1e]"
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-md z-10">
        <div className="flex flex-col items-center mb-8">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative mb-6"
          >
            <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-40 animate-pulse" />
            <div className="relative w-20 h-20 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <Shield size={40} className="text-white" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#0a0f1e] flex items-center justify-center">
                <Zap size={8} className="text-[#0a0f1e] fill-current" />
              </div>
            </div>
          </motion.div>
          
          <motion.h1 
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.1 }}
             className="text-5xl font-black tracking-tighter mb-2 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent"
          >
            GigShield
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-blue-200/50 text-center font-medium"
          >
            Secure Your Work. Stay Protected.
          </motion.p>
        </div>

        <div className="flex gap-2 mb-8 justify-center scale-90">
            <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white/60 flex items-center gap-2">
              <Zap size={10} className="text-yellow-400" /> Instant Claims
            </div>
            <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white/60 flex items-center gap-2">
              <Shield size={10} className="text-blue-400" /> Smart Coverage
            </div>
            <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white/60 flex items-center gap-2">
              <Coins size={10} className="text-emerald-400" /> ₹29/week
            </div>
        </div>

        {/* Auth Toggle */}
        <div className="flex p-1.5 bg-white/5 border border-white/10 rounded-2xl mb-6 relative">
          <motion.div 
            layoutId="activeTab"
            className="absolute inset-y-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl"
            initial={false}
            animate={{ 
              x: activeTab === 'login' ? 0 : '100%',
              width: 'calc(50% - 6px)'
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <button 
            onClick={() => { setActiveTab('login'); setOtpSent(false); }}
            className={`relative z-10 flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'login' ? 'text-white' : 'text-white/40'}`}
          >
            <div className="flex items-center justify-center gap-2">
              <ArrowRight size={16} className={activeTab === 'login' ? 'opacity-100' : 'opacity-0'} /> Login
            </div>
          </button>
          <button 
            onClick={() => { setActiveTab('signup'); setOtpSent(false); }}
            className={`relative z-10 flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'signup' ? 'text-white' : 'text-white/40'}`}
          >
            <div className="flex items-center justify-center gap-2">
              <UserIcon size={16} className={activeTab === 'signup' ? 'opacity-100' : 'opacity-0'} /> Sign Up
            </div>
          </button>
        </div>

        <Card className="bg-white/5 backdrop-blur-3xl border-white/10 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === 'login' ? (
              <motion.div 
                key="login"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-1">Welcome Back 👋</h2>
                  <p className="text-sm text-white/40">Enter your registered mobile number</p>
                </div>
                
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                      <Smartphone size={18} />
                    </div>
                    <Input 
                      type="tel" 
                      placeholder="Enter mobile number" 
                      className="pl-12 text-lg tracking-wider bg-white/5 border-white/10 h-14"
                      value={phone}
                      onChange={(e) => onPhoneChange(e.target.value)}
                      maxLength={10}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/20 font-bold">
                      +91
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => onLogin(phone)} 
                    className="w-full text-lg h-14 bg-gradient-to-r from-cyan-500 to-blue-600 border-0 shadow-lg shadow-blue-500/20 group"
                  >
                    Login Now <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>

                <p className="text-center text-[10px] text-white/20 uppercase tracking-[0.2em]">Secure Session Guaranteed</p>
              </motion.div>
            ) : (
              <motion.div 
                key="signup"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                {!otpSent ? (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold mb-1">Join GigShield 🛡️</h2>
                      <p className="text-sm text-white/40">Get protected in less than 2 minutes</p>
                    </div>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                        <Smartphone size={18} />
                      </div>
                      <Input 
                        type="tel" 
                        placeholder="Enter mobile number" 
                        className="pl-12 text-lg tracking-wider bg-white/5 border-white/10 h-14"
                        value={phone}
                        onChange={(e) => onPhoneChange(e.target.value)}
                        maxLength={10}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/20 font-bold">
                        +91
                      </div>
                    </div>
                    <Button 
                      onClick={onSendOtp} 
                      disabled={otpLoading}
                      className="w-full text-lg h-14 bg-white text-black hover:bg-white/90 border-0 shadow-xl group"
                    >
                      {otpLoading ? 'Sending...' : <> Send OTP <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" /></>}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="text-center mb-2">
                      <h2 className="text-2xl font-bold mb-1">Verify Mobile</h2>
                      <p className="text-sm text-white/40">Demo OTP generated for +91 {phone}</p>
                    </div>

                    {/* ── Demo OTP Banner ── */}
                    {demoOtp && (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative overflow-hidden rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Demo Mode — Your OTP</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            {demoOtp.split('').map((d: string, i: number) => (
                              <span key={i} className="w-9 h-11 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center text-xl font-black text-emerald-300">
                                {d}
                              </span>
                            ))}
                          </div>
                          <button
                            onClick={() => setOtp(demoOtp)}
                            className="ml-3 px-3 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold hover:bg-emerald-500/30 transition-colors whitespace-nowrap"
                          >
                            Auto-fill ↵
                          </button>
                        </div>
                        <p className="text-[10px] text-emerald-300/50 mt-2">No SMS sent — this is a demo system. Click Auto-fill or type the code below.</p>
                      </motion.div>
                    )}

                    {/* OTP digit inputs */}
                    <div className="flex justify-between gap-2">
                      {[...Array(6)].map((_, i) => (
                        <input
                          key={i}
                          type="text"
                          maxLength={1}
                          value={otp[i] || ''}
                          autoFocus={i === 0}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (/^\d*$/.test(val)) {
                              const newOtp = otp.split('');
                              newOtp[i] = val;
                              setOtp(newOtp.join(''));
                              if (val && e.target.nextSibling) {
                                (e.target.nextSibling as HTMLInputElement).focus();
                              }
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace' && !otp[i] && (e.target as HTMLInputElement).previousSibling) {
                              ((e.target as HTMLInputElement).previousSibling as HTMLInputElement).focus();
                            }
                          }}
                          className="w-full aspect-square bg-white/5 border border-white/10 rounded-xl text-center text-xl font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:bg-white/10"
                        />
                      ))}
                    </div>
                    <Button onClick={onVerifyOtp} disabled={otpLoading} className="w-full text-lg h-14 bg-gradient-to-r from-blue-500 to-indigo-600 border-0">
                      {otpLoading ? 'Verifying...' : 'Verify & Continue'}
                    </Button>
                    <div className="text-center">
                      <button onClick={() => setOtpSent(false)} className="text-xs text-white/40 hover:text-white transition-colors">
                        ← Change number / Resend OTP
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <button 
              onClick={() => setView('admin-login')} 
              className="text-white/20 text-[10px] hover:text-white/60 transition-colors uppercase tracking-[0.3em] font-bold flex items-center justify-center gap-2 mx-auto group"
            >
              Admin Access <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </Card>

        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-6 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
            <Utensils size={20} />
            <Bike size={20} />
            <Truck size={20} />
            <Zap size={20} />
          </div>
          <p className="text-center text-white/20 text-[10px] flex items-center justify-center gap-2 font-medium">
             <Lock size={10} /> IRDAI COMPLIANT · 256-BIT ENCRYPTION · SECURE PAYOUTS
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function OnboardingView({ phone, onComplete }: { phone: string; onComplete: (u: User) => void }) {
  const [step, setStep] = useState(1);
  const [details, setDetails] = useState({
    name: '',
    platform: '' as Platform,
    vehicle: '' as Vehicle,
    upiId: '',
    shift: 'Full Day' as Shift,
    location: { city: '', zone: '', pincode: '' }
  });

  const [locating, setLocating] = useState(false);

  const nextStep = () => setStep(s => s + 1);

  const detectLocation = async () => {
    setLocating(true);
    const result = await detectLiveLocation();
    setLocating(false);
    if (result) {
      setDetails(d => ({ ...d, location: result }));
      toast.success('Live Location Sync Successful!');
    } else {
      toast.error('Location access denied or unavailable.');
    }
  };

  const platforms: { name: Platform; icon: any }[] = [
    { name: 'Zomato', icon: <Utensils size={20} /> },
    { name: 'Swiggy', icon: <Bike size={20} /> },
    { name: 'Zepto', icon: <Zap size={20} /> },
    { name: 'Blinkit', icon: <Zap size={20} /> },
  ];

  const vehicles: { name: Vehicle; icon: any }[] = [
    { name: 'Bicycle', icon: <Bike size={24} /> },
    { name: 'Bike', icon: <Bike size={24} /> },
    { name: 'Auto', icon: <Car size={24} /> },
    { name: 'Car', icon: <Car size={24} /> },
  ];

  const shifts: Shift[] = ['Morning', 'Afternoon', 'Evening', 'Night', 'Full Day'];

  return (
    <div className="min-h-screen bg-slate-950 p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-blue-500' : 'bg-white/10'}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold">Tell Us About Your Work</h2>
                <p className="text-white/50">Help us customize your coverage</p>
              </div>
              
              <div className="space-y-4">
                <Input 
                  placeholder="Full Name" 
                  value={details.name} 
                  onChange={e => setDetails(d => ({ ...d, name: e.target.value }))}
                />
                
                <p className="text-sm font-medium text-white/70">Select your platform</p>
                <div className="grid grid-cols-2 gap-3">
                  {platforms.map(p => (
                    <button
                      key={p.name}
                      onClick={() => setDetails(d => ({ ...d, platform: p.name }))}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${details.platform === p.name ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-white/5 border-white/10'}`}
                    >
                      {p.icon}
                      <span className="font-medium">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={nextStep} className="w-full" disabled={!details.name || !details.platform}>
                Next <ArrowRight size={18} />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold">Location & Vehicle</h2>
                <p className="text-white/50">Auto-detecting your working zone</p>
              </div>

              <Card className="bg-white/5 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white/70">
                    <MapPin size={18} className="text-blue-500" />
                    <span>Current Zone</span>
                  </div>
                  <Button
  variant="ghost" 
  className="text-xs h-8 px-3 bg-blue-500/10 border border-blue-500/20 text-blue-400"
  onClick={detectLocation}
>
  {locating ? 'Detecting...' : '📍 Detect Location'}
</Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <p className="text-[10px] text-white/30 uppercase">City</p>
                    <p className="font-semibold">{details.location.city}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <p className="text-[10px] text-white/30 uppercase">Pincode</p>
                    <p className="font-semibold">{details.location.pincode}</p>
                  </div>
                </div>
              </Card>

              <div className="space-y-4">
                <p className="text-sm font-medium text-white/70">Vehicle Selection</p>
                <div className="grid grid-cols-4 gap-2">
                  {vehicles.map(v => (
                    <button
                      key={v.name}
                      onClick={() => setDetails(d => ({ ...d, vehicle: v.name }))}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all aspect-square ${details.vehicle === v.name ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' : 'bg-white/5 border-white/10'}`}
                    >
                      {v.icon}
                      <span className="text-[10px] mt-1 font-medium">{v.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={nextStep} className="w-full" disabled={!details.vehicle}>
                Continue <ArrowRight size={18} />
              </Button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold">Payout Setup</h2>
                <p className="text-white/50">Instant claims directly to your UPI</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Input 
                    placeholder="Enter UPI ID (e.g. name@okaxis)" 
                    value={details.upiId} 
                    onChange={e => setDetails(d => ({ ...d, upiId: e.target.value }))}
                    className="pr-20"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <button className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-xs font-bold border border-emerald-500/20">VERIFY</button>
                  </div>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex gap-3">
                  <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                  <p className="text-sm text-emerald-300">Success! All insurance payouts will be credited instantly to this UPI ID.</p>
                </div>

                <div className="space-y-3 pt-4">
                  <p className="text-sm font-medium text-white/70">Preferred Working Hours</p>
                  <div className="grid grid-cols-2 gap-2">
                    {shifts.map(s => (
                      <button
                        key={s}
                        onClick={() => setDetails(d => ({ ...d, shift: s }))}
                        className={`p-3 rounded-lg border text-sm transition-all ${details.shift === s ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-white/5 border-white/10'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button onClick={nextStep} className="w-full" disabled={!details.upiId}>
                Review Plan <ArrowRight size={18} />
              </Button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold">Your Coverage Plan</h2>
                <p className="text-white/50">AI-optimized for {details.location.city}</p>
              </div>

              <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-blue-700 border-none p-0">
                <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-indigo-100/70 text-sm font-medium">GigShield Premium</p>
                      <h3 className="text-3xl font-bold text-white">₹29<span className="text-sm font-normal opacity-70">/week</span></h3>
                    </div>
                    <Badge variant="success">AI-Powered</Badge>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {[
                      'Rain & Flood Protection',
                      'High AQI Health Cover',
                      'Accident & Disability',
                      'Loss of Income (Traffic Blocks)'
                    ].map(item => (
                      <li key={item} className="flex items-center gap-2 text-sm text-indigo-50/90">
                        <CheckCircle2 size={16} className="text-emerald-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant="secondary" 
                    className="w-full bg-white text-indigo-600 hover:bg-slate-100 font-bold text-lg"
                    onClick={() => {
                      onComplete({
                        id: 'u' + Math.random().toString(36).substr(2, 9),
                        phone: phone,
                        ...details,
                        gigScore: 750,
                        totalEarnings: 0,
                        totalClaims: 0,
                        isActive: true
                      });
                    }}
                  >
                    Activate Coverage
                  </Button>
                </div>
                <div className="bg-indigo-900/50 p-4 text-center">
                  <p className="text-[10px] text-indigo-100/50 uppercase tracking-widest">Powered by RiskEngine AI</p>
                </div>
              </Card>

              <p className="text-xs text-center text-white/30 px-6">
                By activating, you agree to the auto-debit of ₹29 every Monday via your linked UPI. No lock-in, cancel anytime.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function DashboardView({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<'home' | 'claims' | 'profile'>('home');
  const [claiming, setClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [claims, setClaims] = useState<any[]>([]);
  const [claimsLoading, setClaimsLoading] = useState(false);
  const [currentUserData] = useState<User>(user);

  // Fetch live weather on mount
  useEffect(() => {
  const loadWeather = async () => {
    setWeatherLoading(true);

    try {
      const coords = await getCurrentCoords();

      if (coords) {
        const data = await fetchLiveWeather(coords.lat, coords.lon);

        // ✅ FIX: backend returns { success, data }
        if (data && data.success && data.data) {
  setWeather(data.data);
} else {
  setWeather(null); // fallback
}
      }
    } catch (err) {
      console.error("Weather fetch error:", err);
    }

    setWeatherLoading(false);
  };

  loadWeather();
}, []);

  // Fetch claims from DB when claims tab opened
  useEffect(() => {
    if (activeTab === 'claims') {
      setClaimsLoading(true);
      getUserClaimsDB(user.id).then(res => {
        if (res.success && res.data) setClaims(res.data as any[]);
      }).catch(() => {}).finally(() => setClaimsLoading(false));
    }
  }, [activeTab, user.id]);

  // Derive live risk values from real weather data
  const weatherRisk = weather
    ? weather.isRaining ? 90 : Math.min(100, Math.round((weather.humidity / 100) * 60 + (weather.windSpeed > 30 ? 20 : 0)))
    : 0;
  const aqiRisk = weather?.aqi != null ? Math.min(100, Math.round((weather.aqi / 300) * 100)) : 0;
  const trafficRisk = weather ? (weather.isRaining ? 65 : weather.windSpeed > 25 ? 50 : 30) : 0;

  const simulateClaim = async () => {
    setClaiming(true);
    const city = weather?.city || user.location.city || 'your city';
    await new Promise(r => setTimeout(r, 3000));
    setClaiming(false);
    setClaimSuccess(true);
    toast.success('₹180 Credited to UPI!');
    // Persist claim to PostgreSQL
    const claimId = 'claim_' + Date.now();
    try {
      await createClaimDB({
        id: claimId,
        userId: user.id,
        userName: user.name,
        amount: 180,
        date: new Date().toISOString().split('T')[0],
        reason: 'Rain/Weather payout via Time-Travel Claim',
        status: 'Paid',
        type: 'Rain',
        city,
      });
      // Refresh claims list
      const res = await getUserClaimsDB(user.id);
      if (res.success && res.data) setClaims(res.data as any[]);
    } catch (e) {
      console.warn('Claim DB save failed:', e);
    }
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold">Hello, {user.name.split(' ')[0]}!</h1>
            <p className="text-xs text-white/50 flex items-center gap-1">
              <MapPin size={10} /> {user.location.zone}, {user.location.city}
            </p>
          </div>
        </div>
        <button onClick={onLogout} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
          <LogOut size={18} className="text-white/50" />
        </button>
      </header>

      {activeTab === 'home' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Main Stats Card */}
          <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 border-none p-6 shadow-2xl shadow-blue-500/20">
            <div className="flex justify-between mb-4">
               <div>
                 <p className="text-blue-100/70 text-xs font-medium uppercase tracking-wider">Total Claimed Payouts</p>
                 <h2 className="text-3xl font-bold">₹{user.totalClaims + (claimSuccess ? 180 : 0)}</h2>
               </div>
               <div className="bg-white/20 p-2 rounded-xl">
                 <Coins className="text-white" size={24} />
               </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <div className="h-1.5 flex-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 w-3/4 rounded-full" />
              </div>
              <span className="text-[10px] font-bold text-emerald-300">+12% vs last week</span>
            </div>
          </Card>

          {/* Live Weather Cards */}
          <div className="grid grid-cols-2 gap-4">
            {weatherLoading ? (
              <>
                <Card className="p-4 bg-white/5 border-white/10 animate-pulse">
                  <div className="h-4 bg-white/10 rounded mb-2 w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                </Card>
                <Card className="p-4 bg-white/5 border-white/10 animate-pulse">
                  <div className="h-4 bg-white/10 rounded mb-2 w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                </Card>
              </>
            ) : weather ? (
              <>
                <Card className={`p-4 ${weather.isRaining ? 'bg-amber-500/10 border-amber-500/20' : 'bg-blue-500/10 border-blue-500/20'}`}>
                  <div className="flex justify-between mb-2">
                    <CloudRain className={weather.isRaining ? 'text-amber-500' : 'text-blue-400'} size={20} />
                    <span className={`text-[10px] px-1.5 rounded ${weather.isRaining ? 'bg-amber-500/20 text-amber-400' : 'text-white/30'}`}>
                      {weather.isRaining ? 'Active' : 'Clear'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold">
  {weather?.temp ?? '--'}°C · {weather?.condition ?? 'N/A'}
</h4>
                  <p className="text-[10px] text-white/50 mt-1">
                    {weather.isRaining ? '₹60/hr rain coverage active' : `Humidity ${weather.humidity}% · Wind ${weather.windSpeed} km/h`}
                  </p>
                </Card>
                <Card className={`p-4 ${weather.aqi && weather.aqi > 100 ? 'bg-rose-500/10 border-rose-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                  <div className="flex justify-between mb-2">
                    <Wind className={weather.aqi && weather.aqi > 100 ? 'text-rose-400' : 'text-emerald-400'} size={20} />
                    <span className="text-[10px] text-white/30 px-1.5 rounded">
                      AQI: {weather.aqi ?? '—'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold">
                    {!weather.aqi ? 'Air Quality' : weather.aqi > 200 ? 'Very Poor Air' : weather.aqi > 100 ? 'Poor Air' : 'Good Air'}
                  </h4>
                  <p className="text-[10px] text-white/50 mt-1">
                    {weather.aqi && weather.aqi > 100 ? 'Health claim bonus available' : 'Air quality is acceptable today'}
                  </p>
                </Card>
              </>
            ) : (
              <>
                <Card className="p-4 bg-white/5 border-white/10">
                  <CloudRain className="text-white/30 mb-2" size={20} />
                  <h4 className="text-sm font-bold text-white/40">Weather unavailable</h4>
                  <p className="text-[10px] text-white/30 mt-1">Enable location for live alerts</p>
                </Card>
                <Card className="p-4 bg-white/5 border-white/10">
                  <Wind className="text-white/30 mb-2" size={20} />
                  <h4 className="text-sm font-bold text-white/40">AQI unavailable</h4>
                  <p className="text-[10px] text-white/30 mt-1">Enable location for live data</p>
                </Card>
              </>
            )}
          </div>

          {/* Time Travel Claim */}
          <Card className="p-0 overflow-hidden bg-slate-900 border-white/5">
             <div className="bg-indigo-600/20 p-4 border-b border-indigo-500/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <Clock className="text-indigo-400" size={18} />
                   <h3 className="font-bold">Time-Travel Claim</h3>
                </div>
                <Badge variant="info">NEW</Badge>
             </div>
             <div className="p-4">
                <p className="text-xs text-white/60 mb-4">We found weather alerts from your past working days. Check if you're eligible for missed claims.</p>
                <Button variant="outline" className="w-full text-xs h-10 border-indigo-500/50 text-indigo-400" onClick={simulateClaim}>
                  Check Past 30 Days
                </Button>
             </div>
          </Card>

          {/* GigScore Card */}
          <Card className="flex items-center justify-between p-4">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 flex items-center justify-center">
                   <span className="text-sm font-bold">{user.gigScore}</span>
                </div>
                <div>
                   <h4 className="text-sm font-bold">GigScore™</h4>
                   <p className="text-[10px] text-white/40">You're in the top 5% of earners</p>
                </div>
             </div>
             <TrendingUp className="text-emerald-500" size={20} />
          </Card>

          {/* Live Risk Status */}
          <div className="space-y-3">
             <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest px-1">Live Risk Status</h3>
             <div className="space-y-2">
                {[
                  { label: 'Weather Risk', val: weatherRisk, color: 'bg-amber-500' },
                  { label: 'Traffic Block Risk', val: trafficRisk, color: 'bg-blue-500' },
                  { label: 'Health (AQI)', val: aqiRisk, color: 'bg-rose-500' }
                ].map(risk => (
                  <div key={risk.label} className="bg-white/5 p-3 rounded-xl flex items-center justify-between">
                     <span className="text-xs text-white/70">{risk.label}</span>
                     <div className="flex items-center gap-3 w-32">
                        <div className="h-1 flex-1 bg-white/10 rounded-full">
                           <div className={`h-full ${risk.color} rounded-full transition-all duration-700`} style={{ width: `${risk.val}%` }} />
                        </div>
                        <span className="text-[10px] font-mono text-white/40">{weatherLoading ? '…' : `${risk.val}%`}</span>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'claims' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Your Claims</h2>
            <div className="flex items-center gap-2 text-white/40 text-xs">
              <Activity size={12} />
              <span>{claims.length} record{claims.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {claimSuccess && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <Card className="bg-emerald-500/10 border-emerald-500/30 p-4 border-dashed mb-2">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-emerald-500" />
                  <div>
                    <p className="text-xs font-bold text-emerald-400">New Claim Processed & Saved</p>
                    <p className="text-[10px] text-emerald-300/70">₹180 sent to {user.upiId}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {claimsLoading ? (
            <div className="space-y-3">
              {[1,2].map(i => (
                <Card key={i} className="p-4 bg-white/5 border-white/5 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-white/10 rounded w-1/2" />
                      <div className="h-2 bg-white/5 rounded w-1/3" />
                    </div>
                    <div className="h-4 bg-white/10 rounded w-12" />
                  </div>
                </Card>
              ))}
            </div>
          ) : claims.length > 0 ? (
            <div className="space-y-3">
              {claims.map((c: any) => {
                const typeIcon: Record<string, any> = {
                  Rain: <CloudRain size={18} />,
                  AQI: <Wind size={18} />,
                  Accident: <AlertTriangle size={18} />,
                  Delay: <Clock size={18} />,
                };
                const typeColor: Record<string, string> = {
                  Rain: 'bg-amber-500/20 text-amber-500',
                  AQI: 'bg-rose-500/20 text-rose-400',
                  Accident: 'bg-red-500/20 text-red-400',
                  Delay: 'bg-blue-500/20 text-blue-400',
                };
                const statusColor: Record<string, string> = {
                  Paid: 'text-emerald-400',
                  Approved: 'text-emerald-400',
                  Pending: 'text-amber-400',
                  Rejected: 'text-red-400',
                };
                return (
                  <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="p-4 flex items-center justify-between bg-white/5 border-white/5">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${typeColor[c.type] || 'bg-white/10 text-white/50'}`}>
                          {typeIcon[c.type] || <Coins size={18} />}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold">{c.type} Payout</h4>
                          <p className="text-[10px] text-white/40">{c.date} · {c.city || user.location.city}</p>
                          {c.reason && <p className="text-[10px] text-white/30 mt-0.5 max-w-[160px] truncate">{c.reason}</p>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-400">+₹{c.amount}</p>
                        <p className={`text-[10px] font-medium uppercase tracking-tighter ${statusColor[c.status] || 'text-white/40'}`}>{c.status}</p>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : !claimSuccess ? (
            <div className="text-center py-16 text-white/30">
              <Coins size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">No claims yet</p>
              <p className="text-xs mt-1">Use Time-Travel Claim on the Home tab to check eligibility</p>
            </div>
          ) : null}
        </motion.div>
      )}

      {activeTab === 'profile' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 pb-4"
        >
          {/* Avatar + Name Header */}
          <div className="flex flex-col items-center py-6">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/30 text-3xl font-bold">
                {currentUserData.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-900 ${currentUserData.isActive ? 'bg-emerald-500' : 'bg-slate-500'}`} />
            </div>
            <h2 className="text-2xl font-bold">{currentUserData.name}</h2>
            <p className="text-white/50 text-sm mt-1 flex items-center gap-1">
              <Phone size={12} /> +91 {currentUserData.phone}
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold border border-blue-500/30">
                {currentUserData.platform}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-white/60 text-xs font-medium border border-white/10">
                {currentUserData.vehicle}
              </span>
              {currentUserData.isActive && (
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium border border-emerald-500/30">
                  Active
                </span>
              )}
            </div>
          </div>

          {/* GigScore */}
          <Card className="p-5 bg-gradient-to-br from-indigo-600/20 to-blue-600/10 border-indigo-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/50 uppercase tracking-widest mb-1">GigScore™</p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-black text-white">{currentUserData.gigScore}</span>
                  <span className="text-white/40 text-sm mb-1">/100</span>
                </div>
                <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                  <TrendingUp size={10} /> Top 5% of GigShield workers
                </p>
              </div>
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15.9" fill="none"
                    stroke="url(#scoreGrad)" strokeWidth="3"
                    strokeDasharray={`${currentUserData.gigScore} ${100 - currentUserData.gigScore}`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Star size={20} className="text-blue-400" />
                </div>
              </div>
            </div>
          </Card>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 bg-emerald-500/10 border-emerald-500/20 text-center">
              <p className="text-2xl font-bold text-emerald-400">₹{currentUserData.totalClaims}</p>
              <p className="text-[10px] text-white/50 mt-1 uppercase tracking-wider">Total Claims</p>
            </Card>
            <Card className="p-4 bg-blue-500/10 border-blue-500/20 text-center">
              <p className="text-2xl font-bold text-blue-400">₹{currentUserData.totalEarnings}</p>
              <p className="text-[10px] text-white/50 mt-1 uppercase tracking-wider">Total Earnings</p>
            </Card>
          </div>

          {/* Profile Details */}
          <Card className="divide-y divide-white/5 overflow-hidden">
            {[
              {
                icon: <MapPin size={16} className="text-blue-400" />,
                label: 'City',
                value: currentUserData.location.city || 'Not set',
              },
              {
                icon: <MapPin size={16} className="text-indigo-400" />,
                label: 'Zone / Area',
                value: currentUserData.location.zone || 'Not set',
              },
              {
                icon: <MapPin size={16} className="text-purple-400" />,
                label: 'Pincode',
                value: currentUserData.location.pincode || 'Not set',
              },
              {
                icon: <Clock size={16} className="text-amber-400" />,
                label: 'Active Shift',
                value: currentUserData.shift,
              },
              {
                icon: <CreditCard size={16} className="text-emerald-400" />,
                label: 'UPI ID',
                value: (() => {
                  const parts = currentUserData.upiId.split('@');
                  if (parts.length === 2) {
                    const masked = parts[0].slice(0, 3) + '***' + '@' + parts[1];
                    return masked;
                  }
                  return currentUserData.upiId.slice(0, 6) + '***';
                })(),
              },
              {
                icon: <Smartphone size={16} className="text-white/50" />,
                label: 'Phone',
                value: '+91 ' + currentUserData.phone,
              },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-sm text-white/60">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-white">{item.value}</span>
              </div>
            ))}
          </Card>

          {/* Member Since */}
          <Card className="p-4 flex items-center gap-3 bg-white/3 border-white/5">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
              <Calendar size={14} className="text-white/40" />
            </div>
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-widest">Member Since</p>
              <p className="text-sm font-semibold">
                {(currentUserData as any).createdAt
                  ? new Date((currentUserData as any).createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                  : 'GigShield Member'}
              </p>
            </div>
          </Card>

          {/* IRDAI Badge */}
          <div className="text-center py-2">
            <p className="text-[10px] text-white/20 flex items-center justify-center gap-2">
              <Lock size={9} /> IRDAI COMPLIANT · DATA ENCRYPTED · SECURE PAYOUTS
            </p>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </motion.div>
      )}

      <AnimatePresence>
        {claiming && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-6"
          >
            <div className="text-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"
              />
              <h3 className="text-xl font-bold mb-2">Analyzing Past Activity...</h3>
              <p className="text-white/50">Cross-referencing weather alerts with your shift logs.</p>
              
              <div className="mt-8 space-y-2">
                 {[
                   `Checking Rain Data: ${weather?.city || user.location.city} (Last 30 days)`,
                   `Verifying Working Hours: ${user.shift} Shift`,
                   'Processing Smart Payout...'
                 ].map((text, i) => (
                   <motion.p 
                    key={text}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.8 }}
                    className="text-xs text-blue-400 font-mono"
                   >
                     {'>'} {text}
                   </motion.p>
                 ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-xl border-t border-white/5 px-6 py-4 flex items-center justify-between z-40 max-w-lg mx-auto rounded-t-3xl shadow-2xl">
        {[
          { id: 'home', icon: <LayoutDashboard size={24} />, label: 'Home' },
          { id: 'claims', icon: <Coins size={24} />, label: 'Claims' },
          { id: 'profile', icon: <UserIcon size={24} />, label: 'Profile' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === tab.id ? 'text-blue-500 scale-110' : 'text-white/40'}`}
          >
            {tab.icon}
            <span className="text-[10px] font-medium">{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div layoutId="nav-dot" className="w-1 h-1 bg-blue-500 rounded-full mt-1" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}

function AdminLoginView({ password, setPassword, onLogin, onBack }: any) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
      <Card className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
            <Lock size={32} className="text-white/50" />
          </div>
          <h2 className="text-2xl font-bold">Admin Portal</h2>
          <p className="text-sm text-white/50">Restricted Access only</p>
        </div>
        <div className="space-y-4">
          <Input 
            type="password" 
            placeholder="Enter Admin Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={onLogin} className="w-full">Authorize Access</Button>
          <Button variant="ghost" onClick={onBack} className="w-full text-xs">Back to Login</Button>
        </div>
      </Card>
    </div>
  );
}

function AdminDashboardView({ onLogout, users }: { onLogout: () => void, users: User[] }) {
  const [tab, setTab] = useState<'users' | 'claims' | 'analytics'>('analytics');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.phone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-[#020617] flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 p-6 hidden md:flex flex-col">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Shield size={18} />
          </div>
          <span className="font-bold text-xl tracking-tight">GigShield <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded ml-1">ADMIN</span></span>
        </div>

        <nav className="flex-1 space-y-2">
           {[
             { id: 'analytics', icon: <BarChart3 size={20} />, label: 'Overview' },
             { id: 'users', icon: <Users size={20} />, label: 'Active Users' },
             { id: 'claims', icon: <Coins size={20} />, label: 'Claims Queue' },
           ].map(item => (
             <button
              key={item.id}
              onClick={() => setTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${tab === item.id ? 'bg-blue-500/10 text-blue-400' : 'text-white/40 hover:bg-white/5'}`}
             >
               {item.icon}
               <span className="font-medium">{item.label}</span>
             </button>
           ))}
        </nav>

        <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 text-white/40 hover:text-white transition-colors">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
           <div>
              <h1 className="text-3xl font-bold">System Analytics</h1>
              <p className="text-white/50">Real-time platform performance monitoring</p>
           </div>
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                 <Calendar size={16} className="text-white/40" />
                 <span className="text-sm font-medium">Last 24 Hours</span>
              </div>
              <Button className="h-10 px-4">Download Report</Button>
           </div>
        </header>

        {tab === 'analytics' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               {[
                 { label: 'Total Payouts', value: '₹4.2L', change: '+12.5%', icon: <Coins className="text-emerald-400" /> },
                 { label: 'Active Users', value: '12,450', change: '+3.2%', icon: <Users className="text-blue-400" /> },
                 { label: 'Risk Score (Avg)', value: '840', change: '+45', icon: <TrendingUp className="text-indigo-400" /> },
                 { label: 'Fraud Alerts', value: '14', change: '-2', icon: <AlertCircle className="text-rose-400" /> },
               ].map(stat => (
                 <Card key={stat.label} className="p-6 bg-white/5 border-white/10">
                    <div className="flex justify-between items-start mb-4">
                       <div className="p-2 bg-white/5 rounded-lg border border-white/10">{stat.icon}</div>
                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stat.change.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                          {stat.change}
                       </span>
                    </div>
                    <p className="text-xs text-white/50 uppercase tracking-wider font-semibold">{stat.label}</p>
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                 </Card>
               ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <Card className="p-6">
                  <h3 className="text-lg font-bold mb-6">Claims vs Weather Intensity</h3>
                  <div className="h-[300px] w-full bg-white/5 rounded-2xl flex items-center justify-center border border-dashed border-white/10">
                     <p className="text-white/30 text-sm font-mono flex items-center gap-2">
                        <BarChart3 size={16} /> Visualization Module Loading...
                     </p>
                  </div>
               </Card>
               <Card className="p-6">
                  <h3 className="text-lg font-bold mb-6">Real-time Fraud Detection</h3>
                  <div className="space-y-4">
                     {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center justify-between p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-rose-500/10 rounded-full flex items-center justify-center">
                                 <AlertTriangle size={18} className="text-rose-500" />
                              </div>
                              <div>
                                 <p className="text-sm font-bold">Suspicious Activity Detected</p>
                                 <p className="text-[10px] text-white/40">User ID: W-928{i} | Location Mismatch</p>
                              </div>
                           </div>
                           <Button variant="ghost" className="text-[10px] h-8 px-3 border border-rose-500/20">Review</Button>
                        </div>
                     ))}
                  </div>
               </Card>
            </div>
          </div>
        )}

        {tab === 'users' && (
           <Card className="p-0 overflow-hidden bg-[#0a0f1e]/50 border-white/5 shadow-2xl">
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                 <div>
                    <h3 className="font-bold text-lg">Managed Workforce</h3>
                    <p className="text-xs text-white/40">{filteredUsers.length} workers registered</p>
                 </div>
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                    <input 
                      className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all w-64" 
                      placeholder="Search by name, phone..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                 </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-[10px] uppercase tracking-wider text-white/30 font-bold">
                      <tr>
                        <th className="px-6 py-4">Worker Profile</th>
                        <th className="px-6 py-4">Service</th>
                        <th className="px-6 py-4">Zone</th>
                        <th className="px-6 py-4">GigScore™</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                      {filteredUsers.map(u => (
                        <tr key={u.id} className="text-sm hover:bg-white/5 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold text-sm border border-blue-500/10">{u.name[0]}</div>
                                  <div>
                                    <p className="font-bold text-white group-hover:text-blue-400 transition-colors">{u.name}</p>
                                    <p className="text-[10px] text-white/30 font-mono tracking-tighter">+91 {u.phone}</p>
                                  </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="flex items-center gap-2 bg-white/5 w-fit px-2 py-1 rounded-lg border border-white/5">
                                  {u.platform === 'Zomato' ? <Utensils size={12} className="text-rose-400" /> : <Truck size={12} className="text-orange-400" />}
                                  <span className="text-xs font-medium">{u.platform}</span>
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="text-white/60 font-medium">{u.location.city}</p>
                                <p className="text-[10px] text-white/30 uppercase tracking-widest">{u.location.zone}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${u.gigScore > 800 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500'}`} />
                                <span className="font-bold font-mono">{u.gigScore}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4"><Badge variant={u.isActive ? 'success' : 'info'}>{u.isActive ? 'PROTECTED' : 'INACTIVE'}</Badge></td>
                            <td className="px-6 py-4 text-right">
                              <Button variant="ghost" className="h-9 w-9 p-0 hover:bg-blue-500/20 hover:text-blue-400">
                                  <Settings size={16} />
                              </Button>
                            </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
           </Card>
        )}

        {tab === 'claims' && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                 <Card className="p-0 overflow-hidden bg-[#0a0f1e]/50 border-white/5">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                       <h3 className="font-bold">Pending Approval Queue</h3>
                       <Badge variant="warning">4 PENDING</Badge>
                    </div>
                    <div className="divide-y divide-white/5">
                       {[
                         { id: 'C-9021', name: 'Arun V.', type: 'Rain Delay', amount: 180, time: '2 mins ago', risk: 'Low' },
                         { id: 'C-9020', name: 'Sneha P.', type: 'AQI Health', amount: 45, time: '14 mins ago', risk: 'Medium' },
                         { id: 'C-9019', name: 'Rahul S.', type: 'Traffic Block', amount: 90, time: '28 mins ago', risk: 'Low' },
                       ].map(c => (
                         <div key={c.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 text-white/40 font-mono text-xs italic">
                                  {c.risk}
                               </div>
                               <div>
                                  <p className="font-bold text-white">{c.name}</p>
                                  <p className="text-xs text-white/40">{c.type} · ID: {c.id} · {c.time}</p>
                               </div>
                            </div>
                            <div className="flex items-center gap-6">
                               <div className="text-right">
                                  <p className="font-bold text-white">₹{c.amount}</p>
                                  <p className="text-[10px] text-emerald-400 uppercase tracking-widest">Pre-Verified</p>
                               </div>
                               <div className="flex gap-2">
                                  <Button variant="secondary" className="px-3 h-10 text-xs">Reject</Button>
                                  <Button className="px-3 h-10 text-xs">Approve</Button>
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </Card>
              </div>
              <div className="space-y-6">
                 <Card className="p-6 bg-gradient-to-br from-indigo-500/10 to-transparent border-white/5">
                    <h4 className="font-bold mb-4">Payout Optimization AI</h4>
                    <p className="text-xs text-white/50 mb-6">Current engine confidence level: <span className="text-emerald-400 font-bold">98.4%</span></p>
                    <div className="space-y-4">
                       <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                          <p className="text-[10px] text-white/30 uppercase font-bold mb-2">Automated Rules</p>
                          <div className="flex items-center justify-between">
                             <span className="text-xs">Rain {'>'} 2.5mm/hr</span>
                             <Badge variant="success">ON</Badge>
                          </div>
                       </div>
                       <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                          <p className="text-[10px] text-white/30 uppercase font-bold mb-2">Fraud Shield</p>
                          <div className="flex items-center justify-between">
                             <span className="text-xs">GPS Spoofing Check</span>
                             <Badge variant="success">ON</Badge>
                          </div>
                       </div>
                    </div>
                 </Card>
              </div>
           </div>
        )}
      </main>
    </div>
  );
}
