import React, { useState, useMemo } from 'react';
import { Radar } from 'react-chartjs-2';
import { 
  Trophy, Activity, Zap, Target, AlertCircle, 
  RefreshCcw, BarChart3, Scissors, 
  LayoutDashboard, Plus, Trash2, Clock, Timer, CheckCircle2, HelpCircle, ChevronRight
} from 'lucide-react';
import {
  Chart as ChartJS, RadialLinearScale, PointElement, 
  LineElement, Filler, Tooltip, Legend, ArcElement
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, ArcElement);

// --- 25 SHARPENED QUESTIONS ---
const QUESTIONS = [
  { id: 1, text: "Our leadership team kills old initiatives before starting new ones.", dim: "Leadership Clarity" },
  { id: 2, text: "Senior leaders spend more time on 'Architecting' the future than 'Managing' the present.", dim: "Leadership Clarity" },
  { id: 3, text: "Every employee can name 3 things we have explicitly chosen NOT to do this year.", dim: "Strategic Focus" },
  { id: 4, text: "Resource allocation is driven by strategy, not by historical budgets.", dim: "Strategic Focus" },
  { id: 5, text: "We have a 'Hard Cap' on active projects that is strictly enforced.", dim: "Initiative Discipline" },
  { id: 6, text: "We have stopped a major project in the last 90 days because it lost strategic fit.", dim: "Initiative Discipline" },
  { id: 7, text: "Important decisions are made in days, not weeks of committee reviews.", dim: "Decision Effectiveness" },
  { id: 8, text: "Junior staff know exactly what they can decide without asking permission.", dim: "Decision Effectiveness" },
  { id: 9, text: "Most meetings end with a clear decision log rather than a 'follow-up' meeting.", dim: "Meeting Discipline" },
  { id: 10, text: "We regularly cancel recurring meetings that have lost their purpose.", dim: "Meeting Discipline" },
  { id: 11, text: "Every major goal has ONE name attached to it, not a committee.", dim: "Accountability" },
  { id: 12, text: "Underperformance is confronted directly and kindly, never ignored.", dim: "Accountability" },
  { id: 13, text: "We protect 'Thinking Time' as a non-negotiable part of the work week.", dim: "Org Learning" },
  { id: 14, text: "We celebrate 'Clean Failures' as much as we celebrate safe successes.", dim: "Org Learning" },
  { id: 15, text: "Continuous improvement is genuinely embedded in daily work.", dim: "Org Learning" },
  { id: 16, text: "High performers who work fewer hours are respected more than those who work late.", dim: "Performance Orientation" },
  { id: 17, text: "We measure outcomes (value created) rather than inputs (hours/emails).", dim: "Performance Orientation" },
  { id: 18, text: "Our organizational structure is simple enough to explain in 2 minutes.", dim: "Org Simplicity" },
  { id: 19, text: "Information reaches the right person instantly without layers of 'CC'.", dim: "Org Simplicity" },
  { id: 20, text: "We actively remove 'Process Debt' (rules that no longer make sense).", dim: "Org Simplicity" },
  { id: 21, text: "The busiest person in the room is viewed as a bottleneck, not a hero.", dim: "Culture of HP" },
  { id: 22, text: "People feel safe saying 'No' to the CEO if a request conflicts with priorities.", dim: "Culture of HP" },
  { id: 23, text: "Honesty about project delays is rewarded more than 'Green-washing' reports.", dim: "Culture of HP" },
  { id: 24, text: "Leadership communications stay focused on the same 3 priorities for months.", dim: "Leadership Clarity" },
  { id: 25, text: "We have a culture of 'No Follow-Up Required' (people do what they say).", dim: "Strategic Focus" }
];

const DIMENSIONS = ["Leadership Clarity", "Strategic Focus", "Initiative Discipline", "Decision Effectiveness", "Meeting Discipline", "Accountability", "Org Learning", "Performance Orientation", "Org Simplicity", "Culture of HP"];

export default function BPApp() {
  const [activeTab, setActiveTab] = useState('assessment');
  
  // Assessment State
  const [quizView, setQuizView] = useState('welcome'); 
  const [answers, setAnswers] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  
  // Pruner State
  const [initiatives, setInitiatives] = useState([]);
  const [newInit, setNewInit] = useState("");

  // Energy Audit State
  const [energy, setEnergy] = useState({
    block1: false, block2: false, mtgHours: 15, mtgQuality: 60,
    nfrChasing: 5, peopleStrategic: 5, peopleOperational: 5, reactive: 10
  });

  // Logic: Assessment
  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [QUESTIONS[currentIdx].id]: value };
    setAnswers(newAnswers);
    if (currentIdx < QUESTIONS.length - 1) setCurrentIdx(currentIdx + 1);
    else setQuizView('results');
  };

  const dimensionScores = useMemo(() => {
    return DIMENSIONS.map(dim => {
      const dimQuestions = QUESTIONS.filter(q => q.dim === dim);
      const sum = dimQuestions.reduce((acc, q) => acc + (answers[q.id] || 0), 0);
      return (sum / (dimQuestions.length * 5)) * 10;
    });
  }, [answers]);

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);

  // Logic: Energy Audit
  const auditResults = useMemo(() => {
    const totalPossibleStrategic = (energy.block1 ? 2 : 0) + (energy.block2 ? 2 : 0) + (energy.mtgHours * (energy.mtgQuality/100)) + energy.peopleStrategic;
    const totalWaste = (energy.mtgHours * (1 - energy.mtgQuality/100)) + energy.nfrChasing + energy.peopleOperational + energy.reactive;
    const totalHours = totalPossibleStrategic + totalWaste;
    const capacityScore = totalHours > 0 ? Math.round((totalPossibleStrategic / totalHours) * 100) : 0;
    return { strategic: totalPossibleStrategic.toFixed(1), waste: totalWaste.toFixed(1), score: capacityScore };
  }, [energy]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* GLOBAL NAVIGATION */}
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 font-black text-xl tracking-tighter cursor-pointer" onClick={() => setActiveTab('assessment')}>
            <Zap className="text-blue-400 fill-blue-400" /> BP ARCHITECT
          </div>
          <div className="flex gap-2">
            <button onClick={() => setActiveTab('assessment')} className={`px-4 py-2 rounded-lg font-bold text-xs transition ${activeTab === 'assessment' ? 'bg-blue-600' : 'text-slate-400 hover:text-white'}`}>Audit</button>
            <button onClick={() => setActiveTab('pruner')} className={`px-4 py-2 rounded-lg font-bold text-xs transition ${activeTab === 'pruner' ? 'bg-blue-600' : 'text-slate-400 hover:text-white'}`}>Pruner</button>
            <button onClick={() => setActiveTab('energy')} className={`px-4 py-2 rounded-lg font-bold text-xs transition ${activeTab === 'energy' ? 'bg-blue-600' : 'text-slate-400 hover:text-white'}`}>Energy</button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto pt-10 px-4">
        
        {/* TAB 1: ASSESSMENT */}
        {activeTab === 'assessment' && (
          <div className="animate-in fade-in duration-500">
            {quizView === 'welcome' && (
              <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl p-10 text-center border border-slate-100 mt-10">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600"><BarChart3 size={32}/></div>
                <h1 className="text-4xl font-black text-slate-900 mb-4">Fast-Track Diagnosis</h1>
                <p className="text-slate-600 mb-8 leading-relaxed italic">"Diagnose the gap between being busy and being high-performing in 5 minutes."</p>
                <button onClick={() => setQuizView('quiz')} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-2">Start 25-Question Audit <ChevronRight size={18}/></button>
              </div>
            )}
            {quizView === 'quiz' && (
              <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
                <div className="flex justify-between items-center mb-8 text-[10px] font-bold uppercase tracking-widest">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full">{QUESTIONS[currentIdx].dim}</span>
                  <span className="text-slate-300">{currentIdx + 1} / 25</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-12 leading-tight min-h-[100px]">{QUESTIONS[currentIdx].text}</h2>
                <div className="grid grid-cols-5 gap-3">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button key={val} onClick={() => handleAnswer(val)} className="h-16 md:h-20 border-2 border-slate-50 rounded-2xl flex items-center justify-center hover:border-blue-600 hover:bg-blue-50 transition-all font-black text-xl text-slate-300 hover:text-blue-600 active:scale-95">{val}</button>
                  ))}
                </div>
                <div className="flex justify-between mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest"><span>Strongly Disagree</span><span>Strongly Agree</span></div>
              </div>
            )}
            {quizView === 'results' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-100 h-fit">
                  <h2 className="text-slate-500 font-bold uppercase text-xs mb-2">Total Score</h2>
                  <div className="text-8xl font-black text-slate-900 mb-4">{totalScore}</div>
                  <div className="text-xs font-bold text-slate-400 mb-8 italic">Max Possible: 125</div>
                  <button onClick={() => {setQuizView('welcome'); setAnswers({}); setCurrentIdx(0);}} className="flex items-center justify-center gap-2 w-full py-3 bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 font-bold transition-all"><RefreshCcw size={16}/> Re-Audit</button>
                </div>
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8 border border-slate-100 flex flex-col items-center">
                  <h3 className="text-xl font-black text-slate-900 mb-8 self-start">The BP Score Profile</h3>
                  <div className="w-full max-w-sm"><Radar data={{ labels: DIMENSIONS, datasets: [{ label: 'Score', data: dimensionScores, backgroundColor: 'rgba(59, 130, 246, 0.2)', borderColor: 'rgba(59, 130, 246, 1)', pointBackgroundColor: '#3b82f6' }] }} options={{ scales: { r: { min: 0, max: 10, ticks: { display: false } } }, plugins: { legend: { display: false } } }} /></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PRUNER */}
        {activeTab === 'pruner' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 mb-8">
              <h2 className="text-2xl font-black mb-2 text-slate-900">Initiative Pruner</h2>
              <p className="text-slate-500 text-sm mb-6 italic">"A strategy that does not tell you what to stop doing is not a real strategy."</p>
              <div className="flex gap-2">
                <input value={newInit} onKeyDown={(e) => e.key === 'Enter' && newInit && setInitiatives([...initiatives, {id: Date.now(), name: newInit, status: 'pending'}])} onChange={(e) => setNewInit(e.target.value)} placeholder="Type project name..." className="flex-1 bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:border-blue-500 font-medium" />
                <button onClick={() => {if(newInit) {setInitiatives([...initiatives, {id: Date.now(), name: newInit, status: 'pending'}]); setNewInit("");}}} className="bg-slate-900 text-white px-6 rounded-xl font-bold hover:bg-blue-600 transition-all"><Plus/></button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {initiatives.map(item => (
                <div key={item.id} className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${item.status === 'STOP' ? 'border-red-200 bg-red-50 opacity-60' : 'border-slate-100'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`font-bold text-lg leading-tight ${item.status === 'STOP' ? 'line-through text-red-800' : 'text-slate-800'}`}>{item.name}</span>
                    <button onClick={() => setInitiatives(initiatives.filter(i => i.id !== item.id))} className="text-slate-300 hover:text-red-500"><Trash2 size={16}/></button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {['STOP', 'TRANSFORM', 'REVIEW', 'ACCELERATE'].map(s => (
                      <button key={s} onClick={() => setInitiatives(initiatives.map(i => i.id === item.id ? {...i, status: s} : i))} className={`text-[9px] px-2 py-1.5 rounded font-black transition-all ${item.status === s ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-50 text-slate-400 hover:bg-slate-200'}`}>{s}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {initiatives.length > 0 && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-10 py-5 rounded-2xl shadow-2xl flex items-center gap-8 border border-slate-800 animate-in slide-in-from-bottom-10">
                <div className="text-center"><div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Items Removed</div><div className="text-2xl font-black text-red-400">{initiatives.filter(i => i.status === 'STOP').length}</div></div>
                <div className="h-10 w-[1px] bg-slate-700"></div>
                <div className="text-center"><div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Org Capacity Freed</div><div className="text-2xl font-black text-green-400">{initiatives.filter(i => i.status === 'STOP').length * 10}%</div></div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ENERGY AUDIT */}
        {activeTab === 'energy' && (
          <div className="animate-in slide-in-from-bottom-4 duration-700">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
                  <h2 className="text-2xl font-black text-slate-900 mb-2">Energy Quality Audit</h2>
                  <p className="text-slate-500 text-sm mb-8 italic">"The difference between a busy leader and a high-performer is allocation."</p>

                  <div className="space-y-10">
                    <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                      <h3 className="font-bold text-blue-900 uppercase text-[10px] tracking-[0.2em] mb-4">Architect's 2x2 Thinking Blocks</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm font-bold">
                        <button onClick={() => setEnergy({...energy, block1: !energy.block1})} className={`p-4 rounded-xl flex items-center gap-3 transition-all ${energy.block1 ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-400 border border-slate-200'}`}>{energy.block1 ? <CheckCircle2 /> : <div className="w-5 h-5 rounded-full border-2 border-slate-100"/>} Session 1 (2h)</button>
                        <button onClick={() => setEnergy({...energy, block2: !energy.block2})} className={`p-4 rounded-xl flex items-center gap-3 transition-all ${energy.block2 ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-400 border border-slate-200'}`}>{energy.block2 ? <CheckCircle2 /> : <div className="w-5 h-5 rounded-full border-2 border-slate-100"/>} Session 2 (2h)</button>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-end mb-4">
                        <h3 className="font-black text-slate-900 text-[10px] uppercase tracking-[0.2em]">Meetings (Decisions vs Updates)</h3>
                        <div className="text-xl font-black text-blue-600">{energy.mtgQuality}% Yield</div>
                      </div>
                      <div className="flex gap-8 items-center">
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Hours per week</label>
                          <input type="range" min="0" max="40" value={energy.mtgHours} onChange={(e) => setEnergy({...energy, mtgHours: parseInt(e.target.value)})} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900" />
                          <div className="text-xs font-bold mt-1 text-slate-600">{energy.mtgHours}h Total</div>
                        </div>
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">% Quality Discussion</label>
                          <input type="range" min="0" max="100" value={energy.mtgQuality} onChange={(e) => setEnergy({...energy, mtgQuality: parseInt(e.target.value)})} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4 border-t border-slate-50">
                      <div>
                        <h3 className="font-black text-slate-900 text-[10px] uppercase tracking-[0.2em] mb-4 text-red-500">NFR Chasing Tax (Leakage)</h3>
                        <input type="range" min="0" max="20" value={energy.nfrChasing} onChange={(e) => setEnergy({...energy, nfrChasing: parseInt(e.target.value)})} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-red-500" />
                        <div className="flex justify-between text-[10px] font-bold mt-2"><span className="text-slate-400 uppercase">Following Up</span><span className="text-red-500 font-black">{energy.nfrChasing}h</span></div>
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 text-[10px] uppercase tracking-[0.2em] mb-4">People Investment</h3>
                        <div className="space-y-4">
                           <div>
                             <input type="range" min="0" max="20" value={energy.peopleStrategic} onChange={(e) => setEnergy({...energy, peopleStrategic: parseInt(e.target.value)})} className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-green-500" />
                             <div className="flex justify-between text-[9px] font-bold mt-1 text-green-600 uppercase tracking-tighter"><span>Strategic Mentoring</span><span>{energy.peopleStrategic}h</span></div>
                           </div>
                           <div>
                             <input type="range" min="0" max="20" value={energy.peopleOperational} onChange={(e) => setEnergy({...energy, peopleOperational: parseInt(e.target.value)})} className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-400" />
                             <div className="flex justify-between text-[9px] font-bold mt-1 text-orange-500 uppercase tracking-tighter"><span>Operational Chores</span><span>{energy.peopleOperational}h</span></div>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl">
                  <h3 className="text-blue-400 font-bold uppercase text-[10px] tracking-[0.2em] mb-2">Strategic Yield</h3>
                  <div className="text-7xl font-black mb-2">{auditResults.score}%</div>
                  <p className="text-slate-500 text-[10px] font-bold leading-relaxed mb-8 uppercase tracking-widest">Efficiency Benchmark</p>
                  <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-6">
                    <div><div className="text-[10px] font-bold text-slate-500 uppercase mb-1">High Value</div><div className="text-xl font-black text-green-400">{aud
