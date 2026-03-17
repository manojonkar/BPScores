import React, { useState, useMemo } from 'react';
import { Radar } from 'react-chartjs-2';
import { 
  Trophy, Activity, Zap, Target, AlertCircle, 
  RefreshCcw, BarChart3, Scissors, 
  LayoutDashboard, Plus, Trash2, Clock, Timer, CheckCircle2, HelpCircle, ChevronRight, Download, Mail, Globe, Users, Briefcase, FileText
} from 'lucide-react';
import {
  Chart as ChartJS, RadialLinearScale, PointElement, 
  LineElement, Filler, Tooltip, Legend, ArcElement
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, ArcElement);

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
  { id: 11, text: "Every major goal has ONE name attached to it, not a department or committee.", dim: "Accountability" },
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
  const [userRole, setUserRole] = useState(null); 
  const [quizView, setQuizView] = useState('landing'); 
  const [answers, setAnswers] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  
  const [energy, setEnergy] = useState({
    block1: false, block2: false, mtgHours: 15, mtgQuality: 60,
    nfrChasing: 5, peopleStrategic: 5, peopleOperational: 5, reactive: 5
  });

  const handleAnswer = (v) => {
    setAnswers({ ...answers, [QUESTIONS[currentIdx].id]: v });
    if (currentIdx < QUESTIONS.length - 1) setCurrentIdx(currentIdx + 1);
    else setQuizView('results');
  };

  const dimensionScores = useMemo(() => {
    return DIMENSIONS.map(dim => {
      const dimQs = QUESTIONS.filter(q => q.dim === dim);
      const sum = dimQs.reduce((acc, q) => acc + (answers[q.id] || 0), 0);
      return (sum / (dimQs.length * 5)) * 10;
    });
  }, [answers]);

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);

  const auditResults = useMemo(() => {
    const stratH = (energy.block1 ? 2 : 0) + (energy.block2 ? 2 : 0) + (energy.mtgHours * (energy.mtgQuality/100)) + energy.peopleStrategic;
    const wasteH = (energy.mtgHours * (1 - energy.mtgQuality/100)) + energy.nfrChasing + energy.peopleOperational + energy.reactive;
    const score = Math.round((stratH / (stratH + wasteH)) * 100) || 0;
    return { strategic: stratH.toFixed(1), waste: wasteH.toFixed(1), score };
  }, [energy]);

  const status = useMemo(() => {
    if (totalScore <= 50) return { label: "IDLE", color: "text-gray-500", bg: "bg-gray-50" };
    if (totalScore <= 75) return { label: "BUSY", color: "text-red-600", bg: "bg-red-50" };
    if (totalScore <= 100) return { label: "EFFICIENT", color: "text-blue-600", bg: "bg-blue-50" };
    return { label: "HIGH PERFORMANCE", color: "text-green-600", bg: "bg-green-50" };
  }, [totalScore]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 print:bg-white print:pb-0">
      
      {/* BRANDING HEADER */}
      <header className="bg-white border-b border-slate-100 p-4 sticky top-0 z-50 shadow-sm print:static">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex flex-col border-r border-slate-200 pr-4">
                <span className="text-[10px] font-black text-red-600 tracking-tighter uppercase leading-none">Management Innovations</span>
                <span className="text-[8px] font-bold text-slate-400 tracking-widest uppercase mt-1">Vision to Implementation</span>
            </div>
            <div className="flex items-center gap-1">
                <span className="text-xl font-black italic text-slate-900">ODeX</span>
                <span className="text-[7px] font-bold text-slate-400 uppercase leading-none w-12 hidden md:block">Extraordinary Organizations</span>
            </div>
          </div>
          <div className="flex gap-2 no-print">
            <button onClick={() => setActiveTab('assessment')} className={`px-4 py-2 rounded-lg font-bold text-xs transition ${activeTab === 'assessment' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-900'}`}>The Assessment</button>
            <button onClick={() => setActiveTab('energy')} className={`px-4 py-2 rounded-lg font-bold text-xs transition ${activeTab === 'energy' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-900'}`}>Energy Audit</button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto pt-8 px-4">
        
        {/* VIEW 1: ASSESSMENT */}
        {activeTab === 'assessment' && (
          <div className="animate-in fade-in duration-500">
            {quizView === 'landing' && (
              <div className="max-w-4xl mx-auto py-10">
                <div className="text-center mb-12">
                   <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Busyness <span className="text-blue-600">vs</span> High Performance</h1>
                   <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">Stop mistaking intensity for impact. Diagnose your organization's performance health.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-10 rounded-3xl shadow-xl border-t-4 border-t-blue-600">
                    <Briefcase className="text-blue-600 mb-6" size={32}/>
                    <h2 className="text-2xl font-black text-slate-900 mb-4">For CEOs & Founders</h2>
                    <p className="text-slate-500 text-sm mb-8">Assess your leadership bandwidth and identify if you are an Architect or just a Manager.</p>
                    <button onClick={() => {setUserRole('ceo'); setQuizView('quiz');}} className="w-full py-4 bg-blue-600 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-slate-900 transition-all">Start CEO Audit</button>
                  </div>
                  <div className="bg-white p-10 rounded-3xl shadow-xl border-t-4 border-t-slate-900">
                    <Users className="text-slate-900 mb-6" size={32}/>
                    <h2 className="text-2xl font-black text-slate-900 mb-4">For Employees</h2>
                    <p className="text-slate-500 text-sm mb-8">Flag the daily friction and coordination debt that prevents you from doing your best work.</p>
                    <button onClick={() => {setUserRole('employee'); setQuizView('quiz');}} className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-blue-600 transition-all">Identify Friction</button>
                  </div>
                </div>
              </div>
            )}

            {quizView === 'quiz' && (
              <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-slate-100">
                <div className="flex justify-between items-center mb-8 text-[10px] font-bold uppercase tracking-widest">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full">{QUESTIONS[currentIdx].dim}</span>
                  <span className="text-slate-300">{currentIdx + 1} / 25</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-12 leading-tight min-h-[120px]">{QUESTIONS[currentIdx].text}</h2>
                <div className="grid grid-cols-5 gap-3">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button key={val} onClick={() => handleAnswer(val)} className="h-16 md:h-20 border-2 border-slate-50 rounded-2xl flex items-center justify-center hover:border-blue-600 hover:bg-blue-50 transition-all font-black text-2xl text-slate-200 hover:text-blue-600">{val}</button>
                  ))}
                </div>
              </div>
            )}

            {quizView === 'results' && (
              <div className="space-y-8 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 text-center">
                      <h2 className="text-slate-400 font-bold uppercase text-xs mb-2">BP Score</h2>
                      <div className="text-8xl font-black text-slate-900 mb-4">{totalScore}</div>
                      <div className={`py-2 px-4 rounded-full font-black text-xs uppercase ${status.color} ${status.bg} border border-slate-100`}>
                        {status.label} ORGANIZATION
                      </div>
                    </div>
                    <button onClick={() => window.print()} className="w-full no-print bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg hover:bg-blue-600 transition-colors">
                      <Download size={20}/> Download PDF Report
                    </button>
                    <button onClick={() => {setQuizView('landing'); setAnswers({}); setCurrentIdx(0);}} className="w-full text-slate-400 font-bold text-xs uppercase tracking-widest no-print hover:text-blue-600 flex items-center justify-center gap-2"><RefreshCcw size={14}/> Restart Audit</button>
                  </div>
                  <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-10 border border-slate-100 flex flex-col items-center">
                    <h3 className="text-xl font-black text-slate-900 mb-8 self-start uppercase tracking-widest">Organizational Profile</h3>
                    <div className="w-full max-w-sm">
                      <Radar 
                        data={{ labels: DIMENSIONS, datasets: [{ label: 'Score', data: dimensionScores, backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 1)', borderWidth: 3, pointBackgroundColor: '#3b82f6' }] }} 
                        options={{ scales: { r: { min: 0, max: 10, ticks: { display: false } } }, plugins: { legend: { display: false } } }} 
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl p-10 border border-slate-100">
                   <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">Diagnostic Data Summary</h3>
                   <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {DIMENSIONS.map((dim, i) => (
                        <div key={dim} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                           <div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1 truncate">{dim}</div>
                           <div className="text-lg font-black text-slate-800">{dimensionScores[i].toFixed(1)}/10</div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl p-10 border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div>
                      <h4 className="text-blue-600 font-black text-xs uppercase tracking-widest mb-6 underline underline-offset-8">Consulting Guidance</h4>
                      <ul className="space-y-6">
                        <li className="flex gap-4">
                           <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex-shrink-0 flex items-center justify-center font-black text-xs">01</div>
                           <div>
                              <p className="font-bold text-slate-900 text-sm">Target: NFR Standard</p>
                              <p className="text-xs text-slate-500 mt-1">Implement 'No Follow-Up Required' protocols to kill coordination debt.</p>
                           </div>
                        </li>
                        <li className="flex gap-4">
                           <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex-shrink-0 flex items-center justify-center font-black text-xs">02</div>
                           <div>
                              <p className="font-bold text-slate-900 text-sm">Initiative Pruning</p>
                              <p className="text-xs text-slate-500 mt-1">Reduce active initiatives by 30% to concentrate organizational focus.</p>
                           </div>
                        </li>
                      </ul>
                   </div>
                   <div className="bg-slate-900 rounded-2xl p-8 text-white">
                      <h4 className="font-black text-xs uppercase tracking-widest mb-4 text-blue-400">Next Steps</h4>
                      <p className="text-sm text-slate-300 mb-6 leading-relaxed italic">Schedule a 90-minute Executive Alignment session with Management Innovations.</p>
                      <div className="space-y-2 text-[10px] font-bold text-slate-400 tracking-widest">
                         <div className="flex items-center gap-3"><Mail size={12}/> manoj@managementinnovations.co.in</div>
                         <div className="flex items-center gap-3"><Globe size={12}/> www.inventleadership.com</div>
                      </div>
                   </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: ENERGY AUDIT */}
        {activeTab === 'energy' && (
          <div className="animate-in slide-in-from-bottom-4 duration-700 space-y-8 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div className="lg:col-span-2 space-y-6 print:lg:col-span-3">
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
                  <h2 className="text-2xl font-black text-slate-900 mb-1">Leadership ROI</h2>
                  <p className="text-slate-400 text-[10px] mb-8 uppercase tracking-[0.2em] font-black">Energy Yield Calculator</p>

                  <div className="space-y-10">
                    <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 no-print">
                      <h3 className="font-black text-blue-900 uppercase text-[10px] tracking-[0.2em] mb-4">Architect's Thinking Blocks (2x2 Rule)</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm font-bold">
                        <button onClick={() => setEnergy({...energy, block1: !energy.block1})} className={`p-4 rounded-xl flex items-center gap-3 transition-all ${energy.block1 ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-400 border border-slate-200'}`}>{energy.block1 ? <CheckCircle2 size={20}/> : <div className="w-5 h-5 rounded-full border-2 border-slate-100"/>} Session 1 (2h)</button>
                        <button onClick={() => setEnergy({...energy, block2: !energy.block2})} className={`p-4 rounded-xl flex items-center gap-3 transition-all ${energy.block2 ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-400 border border-slate-200'}`}>{energy.block2 ? <CheckCircle2 size={20}/> : <div className="w-5 h-5 rounded-full border-2 border-slate-100"/>} Session 2 (2h)</button>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-end mb-4">
                        <h3 className="font-black text-slate-900 text-[10px] uppercase tracking-widest">Meetings: Decisions vs Updates</h3>
                        <div className="text-xl font-black text-blue-600">{energy.mtgQuality}% Yield</div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Mtg Hours / Week</label>
                          <input type="range" min="0" max="40" value={energy.mtgHours} onChange={(e) => setEnergy({...energy, mtgHours: parseInt(e.target.value)})} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900 no-print" />
                          <div className="text-xs font-bold mt-2 text-slate-600">{energy.mtgHours}h Total</div>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">% Quality Discussion</label>
                          <input type="range" min="0" max="100" value={energy.mtgQuality} onChange={(e) => setEnergy({...energy, mtgQuality: parseInt(e.target.value)})} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-500 no-print" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4 border-t border-slate-50">
                      <div>
                        <h3 className="font-black text-slate-900 text-[10px] uppercase tracking-widest mb-4 text-red-500">NFR Chasing Tax (Leakage)</h3>
                        <input type="range" min="0" max="20" value={energy.nfrChasing} onChange={(e) => setEnergy({...energy, nfrChasing: parseInt(e.target.value)})} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-red-500 no-print" />
                        <div className="flex justify-between text-[10px] font-bold mt-2"><span className="text-slate-400 uppercase">Follow-up hours</span><span className="text-red-500 font-black">{energy.nfrChasing}h</span></div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-black text-slate-900 text-[10px] uppercase tracking-widest mb-2">People Split</h3>
                        <div>
                          <input type="range" min="0" max="20" value={energy.peopleStrategic} onChange={(e) => setEnergy({...energy, peopleStrategic: parseInt(e.target.value)})} className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-green-500 no-print" />
                          <div className="flex justify-between text-[8px] font-black text-green-600 uppercase mt-1"><span>Strategic Mentoring</span><span>{energy.peopleStrategic}h</span></div>
                        </div>
                        <div>
                          <input type="range" min="0" max="20" value={energy.peopleOperational} onChange={(e) => setEnergy({...energy, peopleOperational: parseInt(e.target.value)})} className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-400 no-print" />
                          <div className="flex justify-between text-[8px] font-black text-orange-500 uppercase mt-1"><span>Operational Chores</span><span>{energy.peopleOperational}h</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 print:lg:col-span-3">
                <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                  <h3 className="text-blue-400 font-bold uppercase text-[10px] tracking-[0.2em] mb-2">Leadership Yield</h3>
                  <div className="text-7xl font-black mb-2">{auditResults.score}%</div>
                  <div className="flex justify-between items-center border-t border-slate-800 pt-6 mt-8">
                    <div><div className="text-[9px] font-bold text-slate-500 uppercase mb-1">Strategic High-Value</div><div className="text-xl font-black text-green-400">{auditResults.strategic}h</div></div>
                    <div className="text-right"><div className="text-[9px] font-bold text-slate-500 uppercase mb-1">Waste/Leakage</div><div className="text-xl font-black text-red-400">{auditResults.waste}h</div></div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl border-l-4 border-l-blue-600">
                  <h4 className="font-black text-slate-900 mb-4 flex items-center gap-2 text-[10px] uppercase tracking-widest"><Zap size={14} className="text-blue-600 fill-blue-600"/> Leadership Insight</h4>
                  <div className="text-xs text-slate-600 leading-relaxed space-y-4 font-medium italic">
                    {energy.nfrChasing > 3 ? (
                      <p>⚠️ Chasing updates for {energy.nfrChasing}h/week is a massive energy leak. Implementing the NFR Standard could recover this entire block for deep strategy.</p>
                    ) : (
                      <p>✅ Your NFR status is healthy. Minimal time is wasted on low-value follow-ups.</p>
                    )}
                    {!energy.block1 || !energy.block2 ? (
                      <p>⏳ You are missing your Architect Blocks. Without them, you are merely managing the current noise, not designing the future engine.</p>
                    ) : (
                      <p className="text-green-600 font-bold">🌟 Excellent habit. Protecting your thinking time is the differentiator of a High-Performance CEO.</p>
                    )}
                  </div>
                </div>
                <button onClick={() => window.print()} className="w-full no-print bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3">
                  <Download size={18}/> Print ROI Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="hidden print:block fixed bottom-0 left-0 right-0 p-8 border-t border-slate-100 bg-white">
         <div className="flex justify-between items-center text-[8px] font-black text-slate-400 uppercase tracking-widest">
            <div>© Management Innovations | ODeX | Manoj Onkar</div>
            <div className="flex gap-4">
              <span>www.managementinnovations.co.in</span>
              <span>www.inventleadership.com</span>
            </div>
            <div>Generated by BP Architect Engine</div>
         </div>
      </footer>
    </div>
  );
}
