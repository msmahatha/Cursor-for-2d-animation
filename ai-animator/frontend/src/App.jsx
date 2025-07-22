import React, { useState } from 'react';
import { Sparkles, Film, Code, Bot, CircleDashed, Lightbulb } from 'lucide-react';

//  Main App Component 
export default function App() {
  // State Management 
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [videoUrl, setVideoUrl] = useState(''); // Changed from generatedImage
  const [explanation, setExplanation] = useState('');
  const [isLoadingCode, setIsLoadingCode] = useState(false);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false); // Changed from isLoadingImage
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('preview');

  const examplePrompts = [
    'A circle morphing into a square',
    'A 3D bar chart animating growth',
    'Visualize a linked list data structure',
    'The solar system with orbiting planets',
  ];

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // API Call to Gemini for Manim Code Generation 
  const handleGenerateCode = async (currentPrompt) => {
    if (!currentPrompt) {
      setError('Please enter a prompt to generate an animation.');
      return;
    }
    if (!apiKey) {
        setError("API key is not set. Please add VITE_GEMINI_API_KEY to your .env.local file.");
        return;
    }
    setError(null);
    setGeneratedCode('');
    setVideoUrl('');
    setExplanation('');
    setActiveTab('preview');
    setIsLoadingCode(true);

    const fullPrompt = `You are an expert in Manim, the mathematical animation library for Python. Generate Python code for a Manim animation based on the following user request: "${currentPrompt}". RULES: The code must be a single, complete, and runnable Manim scene. The class must inherit from \`Scene\`, \`ThreeDScene\`, or another appropriate Manim scene type. Name the class \`GeneratedAnimationScene\`. The code should be self-contained and not require external files. Do not include any explanation, comments, or markdown formatting like \`\`\`python. Only return the raw Python code.`;
    
    try {
        const payload = { contents: [{ role: "user", parts: [{ text: fullPrompt }] }] };
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        const result = await response.json();
        if (result.candidates?.[0]?.content.parts[0].text) {
            let codeText = result.candidates[0].content.parts[0].text.trim();
            
           
            if (codeText.startsWith("```python")) {
                codeText = codeText.substring("```python".length).trim();
            }
            if (codeText.endsWith("```")) {
                codeText = codeText.slice(0, -3).trim();
            }

           
            const finalCode = `from manim import *\n\n${codeText}`;

            setGeneratedCode(finalCode);
            // Now call the video rendering function with the corrected code
            await handleRenderVideo(finalCode);
        } else {
            throw new Error('The model returned an empty response for code generation.');
        }
    } catch (err) {
        setError(`Code Generation Failed: ${err.message}`);
    } finally {
        setIsLoadingCode(false);
    }
  };

  // --- NEW: API Call to Backend for Video Rendering ---
  const handleRenderVideo = async (codeToRender) => {
      setIsLoadingVideo(true);
      try {
          const backendUrl = 'http://localhost:5001/render';
          const response = await fetch(backendUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ code: codeToRender })
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.stderr || 'Backend rendering failed.');
          }

          const result = await response.json();
          setVideoUrl(result.videoUrl);

      } catch (err) {
          setError(`Video Rendering Failed: ${err.message}`);
      } finally {
          setIsLoadingVideo(false);
      }
  };
  
  // --- API Call to Gemini for Code Explanation ---
  const handleExplainCode = async () => {
      if (!generatedCode) {
          setError("There is no code to explain.");
          return;
      }
      setError(null);
      setIsLoadingExplanation(true);
      setExplanation('');
      setActiveTab('explanation');

      const explainPrompt = `You are an expert Python and Manim developer acting as a helpful programming tutor. Explain the following Manim code snippet step-by-step. Break down what each line or section does. Use simple language and assume the reader is a beginner. Use markdown for formatting, including headings and bullet points. Code to explain:\n\`\`\`python\n${generatedCode}\n\`\`\``;

      try {
          const payload = { contents: [{ role: "user", parts: [{ text: explainPrompt }] }] };
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
          const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
          const result = await response.json();
          if (result.candidates?.[0]?.content.parts[0].text) {
              setExplanation(result.candidates[0].content.parts[0].text);
          } else {
              throw new Error('Failed to get an explanation from the model.');
          }
      } catch (err) {
          setError(`Explanation Failed: ${err.message}`);
      } finally {
          setIsLoadingExplanation(false);
      }
  };

  const handlePromptClick = (example) => {
    setPrompt(example);
    handleGenerateCode(example);
  };

  // --- UI Rendering ---
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-6 lg:p-8 flex flex-col">
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
          Create Animated Videos with Ease
        </h1>
        <p className="text-gray-400 mt-2 text-lg">
          Generate, understand, and visualize animations from a simple prompt.
        </p>
      </header>

      <main className="flex-grow flex flex-col gap-8">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 shadow-2xl shadow-black/20">
          <div className="flex items-center gap-3 mb-4"><Bot className="w-6 h-6 text-purple-400" /><label htmlFor="prompt-input" className="text-lg font-medium text-gray-300">How can I help you today?</label></div>
          <div className="flex flex-col sm:flex-row gap-4">
            <input id="prompt-input" type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., A DNA helix rotating" className="flex-grow bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none transition" onKeyPress={(e) => e.key === 'Enter' && handleGenerateCode(prompt)} />
            <button onClick={() => handleGenerateCode(prompt)} disabled={isLoadingCode || isLoadingVideo} className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900/50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"><Sparkles className="w-5 h-5" /><span>Generate</span></button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">{examplePrompts.map((p) => (<button key={p} onClick={() => handlePromptClick(p)} disabled={isLoadingCode || isLoadingVideo} className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-full px-3 py-1 transition">{p}</button>))}</div>
        </div>

        {error && (<div className="bg-red-900/50 border border-red-700 text-red-300 rounded-lg p-4 text-center">{error}</div>)}

        <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col bg-gray-800/50 border border-gray-700 rounded-xl shadow-2xl shadow-black/20 overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-gray-900/70 border-b border-gray-700">
                <div className="flex items-center gap-3"><Code className="w-5 h-5 text-cyan-400" /><h2 className="font-semibold">Manim Code</h2></div>
                <button onClick={handleExplainCode} disabled={!generatedCode || isLoadingExplanation} className="flex items-center gap-2 text-xs bg-cyan-600/50 hover:bg-cyan-600/80 disabled:bg-gray-600/50 disabled:cursor-not-allowed text-white font-semibold py-1 px-3 rounded-lg transition-all"><Lightbulb className="w-4 h-4" /><span>{isLoadingExplanation ? "Explaining..." : "Explain Code"}</span></button>
            </div>
            <div className="flex-grow p-4 bg-black/50 relative overflow-auto">
              {(isLoadingCode) && <LoadingSpinner text="Generating Code..." />}
              <pre className={`transition-opacity duration-500 ${isLoadingCode ? 'opacity-20' : 'opacity-100'}`}><code className="language-python text-sm font-mono">{generatedCode || "// Your generated Python code will appear here"}</code></pre>
            </div>
          </div>

          <div className="flex flex-col bg-gray-800/50 border border-gray-700 rounded-xl shadow-2xl shadow-black/20 overflow-hidden">
            <div className="flex border-b border-gray-700">
                <TabButton title="Animation Preview" icon={<Film/>} isActive={activeTab === 'preview'} onClick={() => setActiveTab('preview')} />
                <TabButton title="Code Explanation" icon={<Lightbulb/>} isActive={activeTab === 'explanation'} onClick={() => setActiveTab('explanation')} />
            </div>
            <div className="flex-grow relative">
                {activeTab === 'preview' && (
                    <div className="flex-grow flex items-center justify-center p-4 bg-black/50 min-h-[300px]">
                        {(isLoadingVideo) && <LoadingSpinner text="Rendering Video..." />}
                        {videoUrl ? (
                            <video key={videoUrl} controls autoPlay loop className={`w-full h-full object-contain rounded-lg transition-opacity duration-500 ${isLoadingVideo ? 'opacity-20' : 'opacity-100'}`}>
                                <source src={videoUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ) : (!isLoadingCode && !isLoadingVideo && (<div className="text-center text-gray-500"><Film size={48} className="mx-auto mb-2" /><p>Your animation preview will appear here.</p></div>))}
                    </div>
                )}
                {activeTab === 'explanation' && (
                    <div className="flex-grow p-6 bg-black/50 overflow-y-auto min-h-[300px] prose prose-invert prose-sm max-w-none">
                        {isLoadingExplanation && <LoadingSpinner text="Thinking..." />}
                        {explanation ? (
                            <div dangerouslySetInnerHTML={{ __html: explanation.replace(/\n/g, '<br />') }}></div>
                        ) : (
                            !isLoadingExplanation && <div className="text-center text-gray-500"><Lightbulb size={48} className="mx-auto mb-2" /><p>Click "Explain Code" to get a breakdown of the generated Manim script.</p></div>
                        )}
                    </div>
                )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const LoadingSpinner = ({ text }) => (
  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center z-10 backdrop-blur-sm"><CircleDashed className="w-10 h-10 text-purple-400 animate-spin" /><p className="mt-4 text-lg font-medium text-gray-300">{text}</p></div>
);

const TabButton = ({ title, icon, isActive, onClick }) => (
    <button onClick={onClick} className={`flex-1 flex items-center justify-center gap-2 p-3 text-sm font-semibold transition-colors ${isActive ? 'bg-gray-900/70 text-cyan-400' : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'}`}>
        {React.cloneElement(icon, { className: 'w-5 h-5' })}
        <span>{title}</span>
    </button>
);