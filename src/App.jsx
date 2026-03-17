import React, { useState, useMemo } from 'react';
import { Radar } from 'react-chartjs-2';
import { 
  Trophy, Activity, Zap, Target, AlertCircle, 
  ChevronRight, RefreshCcw, BarChart3, Scissors, 
  LayoutDashboard, Plus, Trash2 
} from 'lucide-react';
import {
  Chart as ChartJS, RadialLinearScale, PointElement, 
  LineElement, Filler, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// 25 SHARPENED QUESTIONS (2-3 per dimension)
const QUESTIONS = [
  { id: 1, text: "Our leadership team regularly simplifies priorities rather than adding new initiatives.", dim: "Leadership Clarity" },
  { id: 2, text: "Leaders demonstrate strategic thinking in their daily work rather than operational busyness.", dim: "Leadership Clarity" },
  { id: 3, text: "Leaders can clearly explain what the organization will NOT pursue in the next 12 months.", dim: "Strategic Focus" },
  { id: 4, text: "The organization's strategy visibly influences resource allocation and daily decision-making.", dim: "Strategic Focus" },
  { id: 5, text: "We actively limit the total number of major strategic initiatives running at any time.", dim: "Initiative Discipline" },
  { id: 6, text: "Existing initiatives are regularly reviewed and discontinued when they no longer serve strategy.", dim: "Initiative Discipline" },
  { id: 7, text: "Important organizational decisions are made quickly and without excessive delay.", dim: "Decision Effectiveness" },
  { id: 8, text: "Decision rights are clearly defined; everyone understands who has authority to decide what.", dim: "Decision Effectiveness" },
  { id: 9, text: "Meetings almost always result in clear decisions, action items, or meaningful insights.", dim: "Meeting Discipline" },
  { id: 10, text: "The total number of meetings is reasonable and purposeful—not reflexively scheduled.", dim: "Meeting Discipline" },
  { id: 11, text: "Every major strategic initiative has a single, clearly accountable owner—not a committee.", dim: "Accountability" },
  { id: 12, text: "People are held accountable for results achieved, not merely for effort invested.", dim: "Accountability" },
  { id: 13, text: "The organization regularly creates structured time to reflect on what is and is not working.", dim: "Org Learning" },
  { id: 14, text: "Employees are actively encouraged to challenge inefficient processes and propose fixes.", dim: "Org Learning" },
  { id: 15, text: "Continuous improvement is genuinely embedded in daily work, not just strategy sessions.", dim: "Org Learning" },
  { id: 16, text: "Success in this organization is measured by impact created, not by effort expended.", dim: "Performance Orientation" },
  { id: 17, text: "The organization consistently celebrates meaningful achievements rather than visible busyness.", dim: "Performance Orientation" },
  { id: 18, text: "Our organizational structure and processes are as simple as they can be.", dim: "Org Simplicity" },
  { id: 19, text: "Employees spend the majority of their time executing strategic work rather than coordinating.", dim: "Org Simplicity" },
  { id: 20, text: "When complexity grows, leaders step in to simplify rather than just manage it.", dim: "Org Simplicity" },
  { id: 21, text: "The organizational culture consistently celebrates results, impact, and value creation.", dim: "Culture of HP" },
  { id: 22, text: "Leaders model high performance behavior—focused, strategic, and disciplined.", dim: "Culture of HP" },
  { id: 23, text: "High performance is the standard—not a special achievement, but the expectation.", dim: "Culture of HP" },
  { id: 24, text: "Our leadership team communicates a clear and consistent strategic direction.", dim: "Leadership Clarity" },
  { id: 25, text: "Most employees understand the top two or three strategic priorities.", dim: "Strategic Focus" }
];

const DIMENSIONS = [
  "Leadership Clarity", "Strategic Focus", "Initiative Discipline", 
  "Decision Effectiveness", "Meeting Discipline", "Accountability", 
  "Org Learning", "Performance Orientation", "Org Simplicity", "Culture of HP"
];

export default function BPApp() {
  const [activeTab, setActiveTab] = useState('assessment');
  const [view, setView] = useState('welcome'); 
  const [answers, setAnswers] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  
  const [initiatives, setInitiatives] = useState([]);
  const [newInit, setNewInit] = useState("");

  const handleAnswer = (value) => {
    const questionId = QUESTIONS[currentIdx].id;
    setAnswers({ ...answers, [questionId]: value });
    if (currentIdx < QUESTIONS.length - 1) setCurrentIdx(currentIdx + 1);
    else setView('results');
  };

  const dimensionScores = useMemo(() => {
    return DIMENSIONS.map(dim => {
      const dimQuestions = QUESTIONS.filter(q => q.dim === dim);
      const sum = dimQuestions.reduce((acc, q) => acc + (answers[q.id] || 0), 0);
      // Normalize to a 10-point scale for visual consistency on radar
      return (sum / (dimQuestions.length * 5)) * 10;
    });
  }, [answers]);

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);

  const getStatus = (score) => {
    if (score <= 50) return { label: "IDLE", color: "text-gray-500", bg: "bg-gray-100", icon: <Activity /> };
    if (score <= 75) return { label: "BUSY", color: "text-red-600", bg: "bg-red-50", icon: <AlertCircle /> };
    if (score <= 100) return { label: "EFFICIENT", color: "text-blue-600", bg: "bg-blue-50", icon: <Zap /> };
    return { label: "HIGH PERFORMANCE", color: "text-green-600", bg: "bg-green-50", icon: <Trophy /> };
  };

  const chartData = {
    labels: DIMENSIONS,
    datasets: [{
      label: 'Performance Level',
      data: dimensionScores,
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 2,
    }]
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 font-black text-xl tracking-tighter">
            <Zap className="text-blue-400 fill-blue-400" /> BP ARCHITECT
          </div>
          <div className="flex gap-4">
            <button onClick={() => setActiveTab('assessment')} className={`px-4 py-2 rounded-lg font-bold text-sm ${activeTab === 'assessment' ? 'bg-blue-600' : 'text-slate-400'}`}>Assessment</button>
            <button onClick={() => setActiveTab('pruner')} className={`px-4 py-2 rounded-lg font-bold text-sm ${activeTab === 'pruner' ? 'bg-blue-600' : 'text-slate-400'}`}>Pruner</button>
          </div>
        </div>
      </nav>

      {activeTab === 'assessment' ? (
        <div className="max-w-4xl mx-auto pt-10 px-4">
          {view === 'welcome' && (
            <div className="bg-white rounded-3xl shadow-xl p-10 text-center border border-slate-100 mt-10">
              <h1 className="text-4xl font-black text-slate-900 mb-4">Fast-Track Diagnosis</h1>
              <p className="text-slate-600 mb-8">25 Questions. 5 Minutes. Uncover the hidden busyness in your organization.</p>
              <button onClick={() => setView('quiz')} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-blue-600 transition-all">Start 25-Question Quest</button>
            </div>
          )}

          {view === 'quiz' && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase">{QUESTIONS[currentIdx].dim}</span>
                <span className="text-slate-400 font-bold">{currentIdx + 1} / 25</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-12">{QUESTIONS[currentIdx].text}</h2>
              <div className="grid grid-cols-5 gap-3">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button key={val} onClick={() => handleAnswer(val)} className="h-20 border-2 border-slate-100 rounded-2xl flex flex-col items-center justify-center hover:border-blue-600 hover:bg-blue-50 transition-all active:scale-95">
                    <span className="text-2xl font-black text-slate-400">{val}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {view === 'results' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
               <div className="lg:col-span-1 bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-100 h-fit">
                  <h2 className="text-slate-500 font-bold uppercase text-sm mb-2">Total BP Score</h2>
                  <div className="text-8xl font-black text-slate-900 mb-4">{totalScore}<span className="text-2xl text-slate-300">/125</span></div>
                  <div className={`px-4 py-2 rounded-full font-bold text-sm ${getStatus(totalScore).bg} ${getStatus(totalScore).color}`}>
                    {getStatus(totalScore).label} ORGANIZATION
                  </div>
                  <button onClick={() => {setView('welcome'); setAnswers({}); setCurrentIdx(0);}} className="mt-10 flex items-center justify-center gap-2 w-full text-slate-400 font-bold"><RefreshCcw size={16}/> Restart</button>
               </div>
               <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
                  <h3 className="text-xl font-bold mb-6">Your Performance Profile</h3>
                  <Radar data={chartData} options={{ scales: { r: { min: 0, max: 10, ticks: { display: false } } } }} />
               </div>
            </div>
          )}
        </div>
      ) : (
        /* PRUNER MODULE (Module C) */
        <div className="max-w-4xl mx-auto pt-10 px-4">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 mb-8">
            <h2 className="text-2xl font-black mb-4 flex items-center gap-2"><Scissors className="text-blue-600"/> Initiative Pruner</h2>
            <div className="flex gap-2">
              <input value={newInit} onChange={(e) => setNewInit(e.target.value)} placeholder="Enter project name..." className="flex-1 bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:border-blue-500" />
              <button onClick={addInitiative} className="bg-slate-900 text-white px-6 rounded-xl font-bold"><Plus/></button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {initiatives.map(item => (
              <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                <span className="font-bold text-slate-800 text-lg mb-4">{item.name}</span>
                <div className="flex justify-between items-center">
                   <div className="flex gap-1">
                      {['STOP', 'TRANSFORM', 'REVIEW', 'ACCELERATE'].map(s => (
                        <button key={s} onClick={() => updateStatus(item.id, s)} className={`text-[9px] px-2 py-1 rounded font-bold transition ${item.status === s ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>{s}</button>
                      ))}
                   </div>
                   <button onClick={() => deleteInit(item.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={16}/></button>
                </div>
              </div>
            ))}
          </div>
          
          {initiatives.length > 0 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-6">
              <div className="text-center"><div className="text-xs text-slate-400 font-bold">PROJECTS KILLED</div><div className="text-xl font-black text-red-400">{initiatives.filter(i => i.status === 'STOP').length}</div></div>
              <div className="h-8 w-[1px] bg-slate-700"></div>
              <div className="text-center"><div className="text-xs text-slate-400 font-bold">CAPACITY FREED</div><div className="text-xl font-black text-green-400">{initiatives.filter(i => i.status === 'STOP').length * 10}%</div></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
