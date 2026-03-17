import React, { useState, useMemo } from 'react';
import { Radar } from 'react-chartjs-2';
import { 
  Trophy, Activity, Zap, Target, AlertCircle, 
  ChevronRight, RefreshCcw, BarChart3, Scissors, 
  LayoutDashboard, Plus, Trash2, Clock, Timer
} from 'lucide-react';
import {
  Chart as ChartJS, RadialLinearScale, PointElement, 
  LineElement, Filler, Tooltip, Legend, ArcElement
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, ArcElement);

// SHARPENED QUESTIONS V2 (Confrontational Style)
const QUESTIONS = [
  { id: 1, text: "Our leadership team kills old initiatives before starting new ones.", dim: "Leadership Clarity" },
  { id: 2, text: "Senior leaders spend more time on 'Architecting' the future than 'Managing' the present.", dim: "Leadership Clarity" },
  { id: 3, text: "Every employee can name 3 things we have explicitly chosen NOT to do this year.", dim: "Strategic Focus" },
  { id: 4, text: "Resource allocation is driven by strategy, not by who yells the loudest or historical budgets.", dim: "Strategic Focus" },
  { id: 5, text: "We have a 'Hard Cap' on active projects that is strictly enforced.", dim: "Initiative Discipline" },
  { id: 6, text: "We have successfully stopped a major project in the last 90 days because it lost strategic fit.", dim: "Initiative Discipline" },
  { id: 7, text: "Important decisions are made in days, not weeks of committee reviews.", dim: "Decision Effectiveness" },
  { id: 8, text: "Junior staff know exactly what they can decide without asking permission.", dim: "Decision Effectiveness" },
  { id: 9, text: "Most of our meetings end with a clear decision log rather than a 'follow-up' meeting.", dim: "Meeting Discipline" },
  { id: 10, text: "We regularly cancel recurring meetings that have lost their purpose.", dim: "Meeting Discipline" },
  { id: 11, text: "Every major goal has ONE name attached to it, not a department or committee.", dim: "Accountability" },
  { id: 12, text: "Underperformance is confronted directly and kindly, never ignored.", dim: "Accountability" },
  { id: 13, text: "We protect 'Thinking Time' as a non-negotiable part of the work week.", dim: "Org Learning" },
  { id: 14, text: "We celebrate 'Clean Failures' as much as we celebrate safe successes.", dim: "Org Learning" },
  { id: 15, text: "Post-mortems actually result in changed processes, not just a report.", dim: "Org Learning" },
  { id: 16, text: "High performers who work fewer hours are respected more than 'busy' people who work late.", dim: "Performance Orientation" },
  { id: 17, text: "We measure outcomes (value created) rather than inputs (hours/emails).", dim: "Performance Orientation" },
  { id: 18, text: "Our organizational structure is simple enough to explain to a stranger in 2 minutes.", dim: "Org Simplicity" },
  { id: 19, text: "Information reaches the right person instantly without passing through 3 layers of 'CC'.", dim: "Org Simplicity" },
  { id: 20, text: "We actively remove 'Process Debt' (rules that no longer make sense).", dim: "Org Simplicity" },
  { id: 21, text: "The busiest person in the room is viewed as a bottleneck, not a hero.", dim: "Culture of HP" },
  { id: 22, text: "People feel safe saying 'No' to the CEO if a request conflicts with top priorities.", dim: "Culture of HP" },
  { id: 23, text: "Honesty about project delays is rewarded more than 'Green-washing' status reports.", dim: "Culture of HP" },
  { id: 24, text: "Leadership communications are consistently focused on the same 3 priorities for months.", dim: "Leadership Clarity" },
  { id: 25, text: "We have a culture of 'No Follow-Up Required' (people do what they say they will).", dim: "Strategic Focus" }
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
  
  // Pruner State
  const [initiatives, setInitiatives] = useState([]);
  const [newInit, setNewInit] = useState("");

  // Energy Audit State
  const [hours, setHours] = useState({ strategic: 4, people: 4, coordination: 20, reactive: 12 });

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [QUESTIONS[currentIdx].id]: value });
    if (currentIdx < QUESTIONS.length - 1) setCurrentIdx(currentIdx + 1);
    else setView('results');
  };

  const dimensionScores = useMemo(() => {
    return DIMENSIONS.map(dim => {
      const dimQuestions = QUESTIONS.filter(q => q.dim === dim);
      const sum = dimQuestions.reduce((acc, q) => acc + (answers[q.id] || 0), 0);
      return (sum / (dimQuestions.length * 5)) * 10;
    });
  }, [answers]);

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
  const totalHours = Object.values(hours).reduce((a, b) => a + b, 0);
  const strategicPercentage = Math.round((hours.strategic / totalHours) * 100);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* Navigation */}
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 font-black text-xl tracking-tighter">
            <Zap className="text-blue-400 fill-blue-400" /> BP ARCHITECT
          </div>
          <div className="flex gap-2 md:gap-4">
            {[
              { id: 'assessment', icon: <LayoutDashboard size={16}/>, label: 'Audit' },
              { id: 'pruner', icon: <Scissors size={16}/>, label: 'Pruner' },
              { id: 'energy', icon: <Timer size={16}/>, label: 'Energy' }
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-xs transition ${activeTab === tab.id ? 'bg-blue-600' : 'text-slate-400 hover:bg-slate-800'}`}>
                {tab.icon} <span className="hidden md:block">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto pt-10 px-4">
        {activeTab === 'assessment' && (
          <>
            {view === 'welcome' && (
              <div className="bg-white rounded-3xl shadow-xl p-10 text-center border border-slate-100 mt-10">
                <h1 className="text-4xl font-black text-slate-900 mb-4">Sharpened Diagnosis</h1>
                <p className="text-slate-600 mb-8 italic">"The truth will set you free, but first it will make you miserable."</p>
                <button onClick={() => setView('quiz')} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-blue-600 transition-all">Start Sharpened Assessment</button>
              </div>
            )}
            {view === 'quiz' && (
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
                <div className="flex justify-between items-center mb-8">
                  <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase">{QUESTIONS[currentIdx].dim}</span>
                  <span className="text-slate-400 font-bold">{currentIdx + 1} / 25</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-12 leading-tight">{QUESTIONS[currentIdx].text}</h2>
                <div className="grid grid-cols-5 gap-3">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button key={val} onClick={() => handleAnswer(val)} className="h-20 border-2 border-slate-100 rounded-2xl flex items-center justify-center hover:border-blue-600 hover:bg-blue-50 transition-all font-black text-xl text-slate-300 hover:text-blue-600">{val}</button>
                  ))}
                </div>
              </div>
            )}
            {view === 'results' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
                <div className="lg:col-span-1 bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-100 h-fit">
                  <h2 className="text-slate-500 font-bold uppercase text-xs mb-2">BP Score</h2>
                  <div className="text-7xl font-black text-slate-900 mb-4">{totalScore}</div>
                  <div className="text-xs font-bold text-slate-400 mb-6 italic">MAX POSSIBLE: 125</div>
                  <button onClick={() => {setView('welcome'); setAnswers({}); setCurrentIdx(0);}} className="flex items-center justify-center gap-2 w-full text-slate-300 hover:text-blue-600 font-bold"><RefreshCcw size={16}/> Restart</button>
                </div>
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
                  <Radar data={{ labels: DIMENSIONS, datasets: [{ label: 'Score', data: dimensionScores, backgroundColor: 'rgba(59, 130, 246, 0.2)', borderColor: 'rgba(59, 130, 246, 1)' }] }} options={{ scales: { r: { min: 0, max: 10, ticks: { display: false } } } }} />
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'pruner' && (
          <div className="animate-in fade-in duration-500">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 mb-8">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-2 text-slate-900"><Scissors className="text-blue-600"/> Initiative Pruner</h2>
              <div className="flex gap-2">
                <input value={newInit} onChange={(e) => setNewInit(e.target.value)} placeholder="Project Name..." className="flex-1 bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:border-blue-500" />
                <button onClick={() => {if(newInit) {setInitiatives([...initiatives, {id: Date.now(), name: newInit, status: 'pending'}]); setNewInit("");}}} className="bg-slate-900 text-white px-6 rounded-xl font-bold"><Plus/></button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {initiatives.map(item => (
                <div key={item.id} className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${item.status === 'STOP' ? 'border-red-200 bg-red-50 opacity-60' : 'border-slate-100'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`font-bold text-lg ${item.status === 'STOP' ? 'line-through text-red-800' : 'text-slate-800'}`}>{item.name}</span>
                    <button onClick={() => setInitiatives(initiatives.filter(i => i.id !== item.id))} className="text-slate-300 hover:text-red-500"><Trash2 size={16}/></button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {['STOP', 'TRANSFORM', 'REVIEW', 'ACCELERATE'].map(s => (
                      <button key={s} onClick={() => setInitiatives(initiatives.map(i => i.id === item.id ? {...i, status: s} : i))} className={`text-[9px] px-2 py-1 rounded font-black transition ${item.status === s ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>{s}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'energy' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 mb-8">
                <h2 className="text-2xl font-black mb-2 flex items-center gap-2 text-slate-900"><Clock className="text-blue-600"/> Leadership Energy Audit</h2>
                <p className="text-slate-500 text-sm mb-8 italic">"The difference between a busy leader and a high-performing one is allocation, not effort."</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                  <div className="space-y-6">
                    {Object.keys(hours).map(key => (
                      <div key={key}>
                        <div className="flex justify-between text-xs font-black uppercase text-slate-400 mb-2">
                          <span>{key} Hours</span>
                          <span className="text-slate-900">{hours[key]}h</span>
                        </div>
                        <input type="range" min="0" max="40" value={hours[key]} onChange={(e) => setHours({...hours, [key]: parseInt(e.target.value)})} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-900 rounded-3xl p-8 text-white text-center shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                      <h3 className="text-blue-400 font-bold uppercase text-xs tracking-widest mb-2">Strategic Focus</h3>
                      <div className="text-6xl font-black mb-2">{strategicPercentage}%</div>
                      <div className="text-slate-400 text-xs font-bold uppercase">Target: 40%+</div>
                      
                      <div className="mt-8 pt-8 border-t border-slate-800">
                        <div className="text-xs text-slate-500 font-bold mb-1 uppercase">Strategic Multiplier</div>
                        <div className={`text-2xl font-black ${strategicPercentage >= 40 ? 'text-green-400' : 'text-red-400'}`}>
                          {strategicPercentage >= 40 ? '14x Output' : 'Busyness Trap'}
                        </div>
                      </div>
                    </div>
                    <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12"><Trophy size={160}/></div>
                  </div>
                </div>
             </div>
             
             <div className="bg-blue-600 rounded-2xl p-6 text-white flex items-center gap-4 shadow-lg">
                <Zap className="fill-white"/>
                <div>
                  <div className="font-bold">Next Milestone: Thinking Thursday</div>
                  <div className="text-sm opacity-80 text-blue-50">Block 4 hours on your calendar this week for zero-interruption strategic work.</div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
