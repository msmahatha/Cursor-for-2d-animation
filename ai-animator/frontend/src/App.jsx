import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Film, Code, Bot, CircleDashed, Lightbulb, History as HistoryIcon, Trash2, LogIn, UserPlus, LogOut, Mail, KeyRound, User, Menu, X, Github, Twitter, Linkedin, ChevronDown } from 'lucide-react';

// --- Firebase Imports ---
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';

// --- Firebase Config ---
const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG || '{}');

// --- Animated Background Component ---
const AnimatedBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init(); // Re-initialize particles on resize
        };
        
        const mathSymbols = ['∫', '∑', '√', 'ƒ(x)', '∂y/∂x', 'E=mc²', 'π', '∞', 'α', 'β', 'λ', 'μ', 'σ', 'ω', '∇', '∮', '∴', '∵'];
        const colors = ['#8B5CF6', '#EC4899', '#F97316', '#10B981', '#3B82F6'];

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 20 + 10;
                this.speedX = Math.random() * 0.4 - 0.2;
                this.speedY = Math.random() * 0.4 - 0.2;
                this.symbol = mathSymbols[Math.floor(Math.random() * mathSymbols.length)];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.opacity = Math.random() * 0.5 + 0.1;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width + 10) this.x = -10;
                if (this.x < -10) this.x = canvas.width + 10;
                if (this.y > canvas.height + 10) this.y = -10;
                if (this.y < -10) this.y = canvas.height + 10;
            }
            draw() {
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.color;
                ctx.font = `${this.size}px Arial`;
                ctx.fillText(this.symbol, this.x, this.y);
            }
        }

        const init = () => {
            particles = [];
            let numberOfParticles = (window.innerWidth * window.innerHeight) / 10000;
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            animationFrameId = requestAnimationFrame(animate);
        };
        
        resizeCanvas();
        animate();
        window.addEventListener('resize', resizeCanvas);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0 bg-black" />;
};

// --- Advanced Loading Animation ---
const LoadingAnimation = ({ text }) => {
    return (
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
            <svg width="80" height="80" viewBox="0 0 100 100" className="animate-spin-slow">
                <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#F97316', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <path 
                    d="M 50,50 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" 
                    fill="none" 
                    stroke="url(#grad)" 
                    strokeWidth="8"
                    strokeDasharray="150 100"
                    className="animate-dash"
                    filter="url(#glow)"
                />
                <text x="50" y="58" textAnchor="middle" fill="#fff" fontSize="24" fontFamily="monospace">
                    {"<>"}
                </text>
            </svg>
            <p className="mt-4 text-lg font-medium text-gray-300">{text}</p>
            <style>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 3s linear infinite;
                }
                @keyframes dash {
                    0% { stroke-dashoffset: 250; }
                    50% { stroke-dashoffset: 0; }
                    100% { stroke-dashoffset: -250; }
                }
                .animate-dash {
                    animation: dash 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

// --- Footer Component ---
const Footer = () => {
    return (
        <footer className="w-full text-center p-4 mt-auto">
            <div className="flex justify-center items-center gap-4">
                <a href="https://github.com/msmahatha" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <Github size={20} />
                </a>
                <a href="https://x.com/MsMahatha" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <Twitter size={20} />
                </a>
                <a href="https://www.linkedin.com/in/msmahatha/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <Linkedin size={20} />
                </a>
            </div>
            <p className="text-xs text-gray-500 mt-2">
                © {new Date().getFullYear()} 2D-Animator. All Rights Reserved.
            </p>
        </footer>
    );
};


// --- Main App Component ---
export default function App() {
    const [user, setUser] = useState(null);
    const [auth, setAuth] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const app = initializeApp(firebaseConfig);
        const authInstance = getAuth(app);
        setAuth(authInstance);

        const unsubscribe = onAuthStateChanged(authInstance, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <CircleDashed className="w-12 h-12 text-purple-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <AnimatedBackground />
            <div className="relative z-10">
                {user ? <AnimatorApp user={user} auth={auth} /> : <LoginPage auth={auth} />}
            </div>
        </div>
    );
}

// --- Login Page Component ---
const LoginPage = ({ auth }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleAuthAction = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
        } catch (err) {
            setError(err.message);
        }
    };
    
    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen text-white flex flex-col items-center justify-center p-4">
            <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">2D-Animator</h1>
                <p className="text-gray-300 mt-2 text-lg">AI-Powered 2D Animation Generator</p>
            </div>
            <div className="w-full max-w-md bg-gray-900/60 backdrop-blur-lg border border-gray-700/50 rounded-xl p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-center mb-6">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                {error && <p className="bg-red-900/50 border border-red-700 text-red-300 rounded-lg p-3 text-center mb-4">{error}</p>}
                <form onSubmit={handleAuthAction} className="space-y-4">
                    <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none transition" required /></div>
                    <div className="relative"><KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none transition" required /></div>
                    <button type="submit" className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300">{isLogin ? <LogIn/> : <UserPlus/>}<span>{isLogin ? 'Log In' : 'Sign Up'}</span></button>
                </form>
                <div className="flex items-center my-6"><div className="flex-grow border-t border-gray-600"></div><span className="flex-shrink mx-4 text-gray-400">OR</span><div className="flex-grow border-t border-gray-600"></div></div>
                <button onClick={handleGoogleSignIn} className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"><User className="w-5 h-5"/><span>Sign In with Google</span></button>
                <p className="text-center mt-6 text-sm text-gray-400">{isLogin ? "Don't have an account?" : "Already have an account?"}<button onClick={() => setIsLogin(!isLogin)} className="font-semibold text-purple-400 hover:underline ml-1"> {isLogin ? 'Sign Up' : 'Log In'}</button></p>
            </div>
            <Footer />
        </div>
    );
};


// --- Animator App Component (The main app when logged in) ---
const AnimatorApp = ({ user, auth }) => {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [history, setHistory] = useState([]);
  const [isLoadingCode, setIsLoadingCode] = useState(false);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

  const categories = {
    "Mathematics": [
        "Animating a Sine Wave",
        "Animating a Cosine Wave",
        "Graphing a Parabola",
        "Graphing a Hyperbola",
        "Pythagorean theorem visualization",
        "Unit circle with sine and cosine waves",
        "Animating a Taylor Series approximation",
        "Visualizing a Riemann Sum",
        "Plotting a 3D Surface",
        "Creating a moving tangent line on a curve"
    ],
    "Data Structures": [
        "Visualize a linked list insertion",
        "Binary search tree creation",
        "Bubble sort algorithm animation",
        "Stack push and pop operations"
    ],
    "Physics": [
        "Simple pendulum simulation",
        "Projectile motion with vectors",
        "Wave interference pattern",
        "Newton's cradle animation"
    ],
    "Geometry": [
        "Morphing a circle into a square",
        "Creating a rotating cube",
        "Visualizing the intersection of two shapes",
        "Drawing a fractal (Sierpinski triangle)"
    ]
  };

  const getAuthHeader = async () => {
    const token = await user.getIdToken();
    return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
  };

  const fetchHistory = async () => {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${backendUrl}/history`, { headers });
      if (!response.ok) throw new Error('Failed to fetch history');
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      console.error(err);
      setError('Could not load creation history.');
    }
  };

  useEffect(() => {
    if(user) fetchHistory();
  }, [user]);

  const handleGenerateCode = async (currentPrompt) => {
    if (!currentPrompt) return;
    setError(null);
    setGeneratedCode('');
    setVideoUrl('');
    setIsLoadingCode(true);
    setIsLoadingVideo(true); 

    const fullPrompt = `You are an expert in Manim. Generate Python code for: "${currentPrompt}".
RULES:
- You must define only one class, and its name must be exactly \`GeneratedAnimationScene\`.
- If the prompt involves 3D objects (like surfaces, spheres, or 3D axes), the class MUST inherit from \`ThreeDScene\`. Otherwise, inherit from \`Scene\`.
- To animate a \`Group\` of objects, use \`FadeIn(your_group)\` or \`AnimationGroup\`. Do NOT use \`Create(your_group)\`.
- To animate a graph being drawn, use the \`Create()\` animation. Do not use attributes that don't exist, like \`t_offset\`.
- Return ONLY the raw Python code without markdown formatting or comments.`;
    
    try {
        const headers = await getAuthHeader();
        const payload = { contents: [{ role: "user", parts: [{ text: fullPrompt }] }] };
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`;
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        const result = await response.json();
        
        setIsLoadingCode(false);

        if (result.candidates?.[0]?.content.parts[0].text) {
            let codeText = result.candidates[0].content.parts[0].text.trim().replace(/^```python\n|```$/g, '');
            const finalCode = `from manim import *\n\n${codeText}`;
            setGeneratedCode(finalCode);
            await handleRenderVideo(finalCode, currentPrompt);
        } else {
            throw new Error('The model returned an empty response.');
        }
    } catch (err) {
        setError(`Code Generation Failed: ${err.message}`);
        setIsLoadingCode(false);
        setIsLoadingVideo(false);
    }
  };

  const handleRenderVideo = async (codeToRender, promptToSave) => {
      try {
          const headers = await getAuthHeader();
          const response = await fetch(`${backendUrl}/render`, {
              method: 'POST',
              headers,
              body: JSON.stringify({ code: codeToRender, prompt: promptToSave })
          });
          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.stderr || 'Backend rendering failed.');
          }
          const result = await response.json();
          setVideoUrl(result.videoUrl);
          fetchHistory();
      } catch (err) {
          setError(`Video Rendering Failed: ${err.message}`);
      } finally {
          setIsLoadingVideo(false);
      }
  };

  const handleDelete = async (id, event) => {
    event.stopPropagation();
    try {
        const headers = await getAuthHeader();
        const response = await fetch(`${backendUrl}/history/${id}`, { method: 'DELETE', headers });
        if (!response.ok) throw new Error('Failed to delete item.');
        setHistory(history.filter(item => item.id !== id));
    } catch (err) {
        setError('Could not delete the creation.');
    }
  };

  const handleClearHistory = async () => {
    if (!isClearing) {
        setIsClearing(true);
        setTimeout(() => setIsClearing(false), 3000);
        return;
    }
    try {
        const headers = await getAuthHeader();
        const response = await fetch(`${backendUrl}/history`, { method: 'DELETE', headers });
        if (!response.ok) throw new Error('Failed to clear history.');
        setHistory([]);
        setIsClearing(false);
    } catch (err) {
        setError('Could not clear history.');
    }
  };

  const loadCreation = (creation) => {
    setPrompt(creation.prompt);
    setGeneratedCode(creation.code);
    setVideoUrl(creation.videoUrl);
    setError(null);
    setIsSidebarOpen(false);
  };

  const handlePresetClick = (presetPrompt) => {
    setPrompt(presetPrompt);
    handleGenerateCode(presetPrompt);
  };

  const toggleCategory = (category) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  return (
    <div className="min-h-screen text-white font-sans flex relative">
      {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-30 md:hidden"></div>}

      <aside className={`fixed top-0 left-0 h-full w-full max-w-xs bg-gray-900/50 backdrop-blur-lg border-r border-gray-700/30 flex flex-col p-4 z-40 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 bg-gray-800/50 p-2 rounded-lg border border-gray-700/50 w-full">
                {user.photoURL ? (
                    <img src={user.photoURL} alt="User" className="w-10 h-10 rounded-full" />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                    </div>
                )}
                <div className="truncate">
                    <p className="font-semibold text-sm truncate">{user.displayName || 'User'}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-gray-400 hover:text-white md:hidden ml-2">
                <X size={20}/>
            </button>
        </div>

        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <HistoryIcon className="w-6 h-6 text-purple-400"/>
                <h2 className="text-lg font-semibold">History</h2>
            </div>
            {history.length > 0 && (
                <button 
                    onClick={handleClearHistory} 
                    className={`text-xs font-semibold px-2 py-1 rounded-md transition-all ${isClearing ? 'bg-red-500/80 text-white' : 'bg-gray-700/50 text-gray-400 hover:bg-red-500/50 hover:text-white'}`}
                >
                    {isClearing ? 'Sure?' : 'Clear'}
                </button>
            )}
        </div>
        <div className="flex-grow overflow-y-auto pr-2 -mr-2">
          {history.length > 0 ? (
            <ul className="space-y-2">
              {history.map(c => (
                <li key={c.id} onClick={() => loadCreation(c)} className="group flex items-center justify-between bg-gray-900/50 hover:bg-purple-900/30 border border-gray-700/50 hover:border-purple-700/50 rounded-lg p-3 cursor-pointer transition-all duration-200">
                  <div className="flex-grow truncate pr-2"><p className="font-medium text-sm text-gray-200 truncate">{c.prompt}</p><p className="text-xs text-gray-500">{c.createdAt?._seconds ? new Date(c.createdAt._seconds * 1000).toLocaleString() : 'Just now'}</p></div>
                  <button onClick={(e) => handleDelete(c.id, e)} className="p-1 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"><Trash2 size={16}/></button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-gray-500 pt-10 flex flex-col items-center">
              <HistoryIcon className="w-10 h-10 mb-2 text-gray-600"/>
              <p className="font-medium">No creations yet</p>
              <p className="text-xs">Your saved animations will appear here.</p>
            </div>
          )}
        </div>
        <button onClick={() => signOut(auth)} title="Log Out" className="mt-4 flex items-center justify-center gap-2 w-full p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/10">
            <LogOut size={18}/>
            <span>Log Out</span>
        </button>
      </aside>

      <div className="flex-grow flex flex-col w-full">
        <header className="text-center p-4 md:p-8">
          <div className="flex items-center justify-between md:justify-center">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-400 hover:text-white md:hidden">
              <Menu size={24}/>
            </button>
            <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">2D Animator</h1>
            <div className="w-8 h-8 md:hidden"></div>
          </div>
          <p className="text-gray-300 mt-2 text-base md:text-lg">AI-Powered 2D Animation Generator</p>
        </header>

        <main className="flex-grow flex flex-col gap-8 px-4 sm:px-6 lg:px-8 pb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-2xl shadow-black/20">
            <div className="flex items-center gap-3 mb-4"><Bot className="w-6 h-6 text-purple-400" /><label htmlFor="prompt-input" className="text-lg font-medium text-gray-300">Describe the animation you want to create</label></div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input id="prompt-input" type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., A DNA helix rotating" className="flex-grow bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none transition" onKeyPress={(e) => e.key === 'Enter' && handleGenerateCode(prompt)} />
              <button onClick={() => handleGenerateCode(prompt)} disabled={isLoadingCode || isLoadingVideo} className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900/50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"><Sparkles className="w-5 h-5" /><span>Generate</span></button>
            </div>
            <div className="mt-6 space-y-4">
                {Object.keys(categories).map(category => (
                    <div key={category}>
                        <button onClick={() => toggleCategory(category)} className="w-full flex justify-between items-center text-left font-semibold p-3 bg-gray-900/50 rounded-lg hover:bg-purple-900/30 transition-colors">
                            <span>{category}</span>
                            <ChevronDown className={`transition-transform duration-300 ${activeCategory === category ? 'rotate-180' : ''}`} />
                        </button>
                        {activeCategory === category && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 p-2 bg-black/20 rounded-lg">
                                {categories[category].map(preset => (
                                    <button key={preset} onClick={() => handlePresetClick(preset)} className="text-left text-sm p-2 rounded-md hover:bg-purple-500/20 transition-colors">
                                        {preset}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
          </div>

          {error && (<div className="bg-red-900/50 border border-red-700 text-red-300 rounded-lg p-4 text-center">{error}</div>)}

          <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-2xl shadow-black/20 overflow-hidden">
              <div className="flex items-center justify-between p-4 bg-gray-900/70 border-b border-gray-700"><div className="flex items-center gap-3"><Code className="w-5 h-5 text-cyan-400" /><h2 className="font-semibold">Manim Code</h2></div></div>
              <div className="flex-grow p-4 bg-black/50 relative overflow-auto">
                {isLoadingCode && <LoadingAnimation text="Generating Code..." />}
                <pre className={`transition-opacity duration-300 text-sm font-mono ${isLoadingCode ? 'opacity-0' : 'opacity-100'}`}>{generatedCode || "// Your generated Python code will appear here"}</pre>
              </div>
            </div>

            <div className="flex flex-col bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-2xl shadow-black/20 overflow-hidden">
              <div className="flex border-b border-gray-700"><TabButton title="Animation Preview" icon={<Film/>} isActive={true} /></div>
              <div className="flex-grow relative">
                  <div className="flex-grow flex items-center justify-center p-4 bg-black/50 min-h-[300px]">
                      {isLoadingVideo && <LoadingAnimation text="Rendering Video..." />}
                      {videoUrl && !isLoadingVideo ? (<video key={videoUrl} controls autoPlay loop className="w-full h-full object-contain rounded-lg"><source src={videoUrl} type="video/mp4" />Your browser does not support the video tag.</video>) : ( !isLoadingVideo && <div className="text-center text-gray-500"><Film size={48} className="mx-auto mb-2" /><p>Your animation preview will appear here.</p></div>)}
                  </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

const TabButton = ({ title, icon, isActive, onClick }) => {
    return (
        <button onClick={onClick} className={`flex-1 flex items-center justify-center gap-2 p-3 text-sm font-semibold transition-colors ${isActive ? 'bg-gray-900/70 text-cyan-400' : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'}`}>
            {React.cloneElement(icon, { className: 'w-5 h-5' })}
            <span>{title}</span>
        </button>
    );
};
