import React, { useState, useMemo } from 'react';
import { Radar } from 'react-chartjs-2';
import { 
  Trophy, Activity, Zap, Target, AlertCircle, 
  RefreshCcw, BarChart3, Scissors, 
  LayoutDashboard, Plus, Trash2, Clock, Timer, CheckCircle2, HelpCircle, ChevronRight, ChevronLeft, Download, Mail, Globe, Users, Briefcase, FileText, Info
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

export default function MasterBPApp() {
  const [activeTab, setActiveTab] = useState('assessment');
  const [quizView, setQuizView] = useState('landing'); 
  const [answers, setAnswers] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  
  const [energy, setEnergy] = useState({
    block1: false, block2: false, mtgHours: 15, mtgQuality: 60,
    nfrChasing: 5, peopleStrategic: 5, peopleOperational: 5, reactive: 5
  });

  // --- LOGIC: ASSESSMENT ---
  const dimensionScores = useMemo(() => {
    return DIMENSIONS.map(dim => {
      const dimQs = QUESTIONS.filter(q => q.dim === dim);
      const sum = dimQs.reduce((acc, q) => acc + (answers[q.id] || 0), 0);
      return (sum / (dimQs.length * 5)) * 10;
    });
  }, [answers]);

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);

  // --- LOGIC: ENERGY AUDIT ---
  const auditResults = useMemo(() => {
    const stratH = (energy.block1 ? 2 : 0) + (energy.block2 ? 2 : 0) + (energy.mtgHours * (energy.mtgQuality/100)) + energy.peopleStrategic;
    const wasteH = (energy.mtgHours * (1 - energy.mtgQuality/100)) + energy.nfrChasing + energy.peopleOperational + energy.reactive;
    const score = Math.round((stratH / (stratH + wasteH)) * 100) || 0;
    return { strategic: stratH.toFixed(1), waste: wasteH.toFixed(1), score, total: (stratH + wasteH).toFixed(1) };
  }, [energy]);

  const status = useMemo(() => {
    if (totalScore <= 50) return { label: "IDLE", color: "text-gray-500", bg: "bg-gray-50", quote: "Needs a Strategic Awakening." };
    if (totalScore <= 75) return { label: "BUSY", color: "text-red-600", bg: "bg-red-50", quote: "High activity, but leaking performance through complexity." };
    if (totalScore <= 100) return { label: "EFFICIENT", color: "text-blue-600", bg: "bg-blue-50", quote: "Strong operations, needs bolder strategic differentiation." };
    return { label: "HIGH PERFORMANCE", color: "text-green-600", bg: "bg-green-50", quote: "Focused activity and exceptional alignment." };
  }, [totalScore]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 print:bg-white print:pb-0">
      
      {/* HEADER */}
      <header className="bg-white border-b border-slate-100 p-4 sticky top-0 z-50 shadow-sm print:static">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex flex-col border-r border-slate-200 pr-4">
                <span className="text-[10px] font-black text-red-600 tracking-tighter uppercase leading-none">Management Innovations</span>
                <span className="text-[8px] font-bold text-slate-400 tracking-widest uppercase mt-1">Vision to Implementation</span>
            </div>
            <div className="flex items-center gap-1">
                <span className="text-xl font-black italic text-slate-900 uppercase">ODeX</span>
                <span className="text-[7px] font-bold text-slate-400 uppercase leading-none w-12 hidden md:block">Extraordinary Organizations</span>
            </div>
          </div>
          <div className="flex gap-2 no-print">
            <button onClick={() => setActiveTab('assessment')} className={`px-4 py-2 rounded-lg font-bold text-xs transition ${activeTab === 'assessment' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-900'}`}>Assessment</button>
            <button onClick={() => setActiveTab('energy')} className={`px-4 py-2 rounded-lg font-bold text-xs transition ${activeTab === 'energy' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-900'}`}>Energy Audit</button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto pt-8 px-4">
        
        {/* VIEW 1: ASSESSMENT */}
        {activeTab === 'assessment' && (
          <div className="animate-in fade-in duration-500">
            {quizView === 'landing' && (
              <div className="max-w-4xl mx-auto py-6">
                <div className="text-center mb-10">
                   <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Busyness <span className="text-blue-600">vs</span> High Performance</h1>
                   <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">A professional diagnostic to uncover why your organization feels overworked but under-productive.</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl p-8 mb-10 border border-slate-100 border-l-8 border-l-blue-600">
                  <h3 className="flex items-center gap-2 font-black text-slate-900 uppercase text-xs tracking-widest mb-6"><Info size={16} className="text-blue-600"/> Key Areas Being Evaluated</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                    {[
                      { title: "Leadership Clarity", desc: "Do leaders simplify or complicate the agenda?" },
                      { title: "Strategic Focus", desc: "The ability to say 'No' to distractions." },
                      { title: "Initiative Discipline", desc: "Hard caps on projects vs. overload." },
                      { title: "Decision Velocity", desc: "Speed of execution vs. committee lag." },
                      { title: "NFR Standard", desc: "A culture where no follow-ups are needed." },
                      { title: "Accountability", desc: "Single owners vs. shared blame." }
                    ].map(item => (
                      <div key={item.title} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="font-bold text-slate-900 mb-1">{item.title}</div>
                        <div className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-slate-900 text-white p-10 rounded-3xl shadow-xl flex flex-col justify-between">
                    <div>
                      <Briefcase className="text-blue-400 mb-6" size={32}/>
                      <h2 className="text-2xl font-black mb-4">CEOs & Founders</h2>
                      <p className="text-slate-400 text-sm mb-8 leading-relaxed italic">"Diagnose if you are an Architect of the future or a Manager of the noise."</p>
                    </div>
                    <button onClick={() => setQuizView('quiz')} className="w-full py-4 bg-blue-600 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-white hover:text-blue-600 transition-all">Start Leadership Audit</button>
                  </div>
                  <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 flex flex-col justify-between">
                    <div>
                      <Users className="text-slate-900 mb-6" size={32}/>
                      <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Teams & Employees</h2>
                      <p className="text-slate-500 text-sm mb-8 leading-relaxed italic">"Identify the friction points and 'CC culture' that steals your focus."</p>
                    </div>
                    <button onClick={() => setQuizView('quiz')} className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-blue-600 transition-all">Identify Friction</button>
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
                <div className="grid grid-cols-5 gap-3 mb-10">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button 
                      key={val} 
                      onClick={() => setAnswers({ ...answers, [QUESTIONS[currentIdx].id]: val })} 
                      className={`h-16 md:h-20 border-2 rounded-2xl flex items-center justify-center transition-all font-black text-2xl active:scale-95 ${answers[QUESTIONS[currentIdx].id] === val ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'border-slate-50 text-slate-200 hover:border-blue-200'}`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                
                <div className="flex justify-between items-center pt-8 border-t border-slate-50">
                   <button 
                    disabled={currentIdx === 0}
                    onClick={() => setCurrentIdx(currentIdx - 1)}
                    className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase disabled:opacity-0"
                   >
                     <ChevronLeft size={16}/> Back
                   </button>
                   {currentIdx === QUESTIONS.length - 1 ? (
                     <button onClick={() => setQuizView('results')} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-blue-600 transition-all">Calculate Results</button>
                   ) : (
                     <button onClick={() => setCurrentIdx(currentIdx + 1)} className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase">Next <ChevronRight size={16}/></button>
                   )}
                </div>
              </div>
            )}

            {quizView === 'results' && (
              <div className="space-y-8 pb-20 print:space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:grid-cols-1">
                  <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 text-center">
                      <h2 className="text-slate-400 font-bold uppercase text-xs mb-2">Total BP Score</h2>
                      <div className="text-8xl font-black text-slate-900 mb-2">{totalScore}<span className="text-lg text-slate-200">/125</span></div>
                      <div className={`py-3 px-6 rounded-2xl font-black text-sm uppercase tracking-tighter ${status.color} ${status.bg} border border-slate-100 mb-4`}>
                        {status.label} ORGANIZATION
                      </div>
                      <p className="text-xs text-slate-500 italic font-medium leading-relaxed">"{status.quote}"</p>
                    </div>
                    <button onClick={() => window.print()} className="w-full no-print bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg hover:bg-blue-600">
                      <Download size={20}/> Download Exhaustive Report
                    </button>
                  </div>
                  <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-10 border border-slate-100 flex flex-col items-center">
                    <h3 className="text-xl font-black text-slate-900 mb-8 self-start uppercase tracking-widest border-l-4 border-l-blue-600 pl-4">Organizational Profile</h3>
                    <div className="w-full max-w-sm">
                      <Radar 
                        data={{ labels: DIMENSIONS, datasets: [{ label: 'Score', data: dimensionScores, backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 1)', borderWidth: 3, pointBackgroundColor: '#3b82f6' }] }} 
                        options={{ scales: { r: { min: 0, max: 10, ticks: { display: false } } }, plugins: { legend: { display: false } } }} 
                      />
                    </div>
                  </div>
                </div>

                {/* THE PERFORMANCE EQUATION (Report Content) */}
                <div className="bg-slate-900 text-white rounded-3xl p-10 shadow-2xl relative overflow-hidden">
                   <div className="relative z-10">
                      <h4 className="text-blue-400 font-black text-xs uppercase tracking-widest mb-8">The Performance Equation Logic</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center items-center">
                        <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700">
                           <div className="text-[10px] text-slate-400 font-bold uppercase mb-2">Clarity</div>
                           <div className="text-3xl font-black text-blue-400">{(dimensionScores[0] + dimensionScores[1])/20 * 5 === 0 ? '0' : ((dimensionScores[0] + dimensionScores[1])/2).toFixed(1)}</div>
                        </div>
                        <div className="text-2xl font-black text-slate-600">×</div>
                        <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700">
                           <div className="text-[10px] text-slate-400 font-bold uppercase mb-2">Capability</div>
                           <div className="text-3xl font-black text-blue-400">{((dimensionScores[6] + dimensionScores[9])/2).toFixed(1)}</div>
                        </div>
                      </div>
                      <p className="mt-8 text-xs text-slate-500 font-bold italic border-t border-slate-800 pt-6">"Performance = Clarity × Capability × Discipline. If any factor approaches zero, the entire organization defaults to busyness."</p>
                   </div>
                </div>

                {/* DATA TABLE */}
                <div className="bg-white rounded-3xl shadow-xl p-10 border border-slate-100 overflow-hidden">
                   <h3 className="text-xl font-black text-slate-900 mb-8 border-b border-slate-50 pb-6">Dimensional Performance Breakdown</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                      {DIMENSIONS.map((dim, i) => (
                        <div key={dim} className="flex justify-between items-center py-2 border-b border-slate-50">
                           <span className="text-sm font-bold text-slate-700 uppercase tracking-tighter">{dim}</span>
                           <div className="flex items-center gap-3">
                              <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                 <div className={`h-full ${dimensionScores[i] < 5 ? 'bg-red-500' : dimensionScores[i] < 8 ? 'bg-blue-400' : 'bg-green-500'}`} style={{ width: `${dimensionScores[i] * 10}%` }}></div>
                              </div>
                              <span className="text-sm font-black text-slate-900 w-8 text-right">{dimensionScores[i].toFixed(1)}</span>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* COACHING/CONTACT */}
                <div className="bg-white rounded-3xl shadow-xl p-10 border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div>
                      <h4 className="text-blue-600 font-black text-xs uppercase tracking-widest mb-6 underline underline-offset-8">Coaching Insight</h4>
                      <p className="text-sm text-slate-600 leading-relaxed mb-6 italic">
                        {totalScore < 75 ? "Your current score indicates a 'Busyness Trap'. Your immediate priority must be the removal of initiative clutter before attempting further growth." : "You are demonstrating high-performance behaviors. Your focus should shift to scaling your execution engine and reinforcing the NFR standard across all departments."}
                      </p>
                   </div>
                   <div className="bg-slate-900 rounded-2xl p-8 text-white">
                      <h4 className="font-black text-xs uppercase tracking-widest mb-4 text-blue-400">Connect with Manoj Onkar</h4>
                      <div className="space-y-3 font-bold text-[10px] text-slate-400 tracking-widest uppercase">
                         <div className="flex items-center gap-3"><Mail size={14}/> manoj@managementinnovations.co.in</div>
                         <div className="flex items-center gap-3"><Globe size={14}/> www.managementinnovations.co.in</div>
                         <div className="flex items-center gap-3"><Globe size={14}/> www.inventleadership.com</div>
                      </div>
                   </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ENERGY AUDIT */}
        {activeTab === 'energy' && (
          <div className="animate-in slide-in-from-bottom-4 duration-700 space-y-8 pb-20 print:space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
                  <h2 className="text-2xl font-black text-slate-900 mb-1 leading-none uppercase tracking-tighter">Energy Yield Audit</h2>
                  <p className="text-slate-400 text-[10px] mb-8 uppercase tracking-[0.3em] font-black">Personal leadership bandwidth ROI</p>

                  <div className="space-y-10">
                    {/* THINKING BLOCKS */}
                    <div className="p-8 bg-blue-50 rounded-3xl border border-blue-100 relative overflow-hidden no-print">
                      <h3 className="font-black text-blue-900 uppercase text-[10px] tracking-[0.2em] mb-4">2x2 Architect Blocks (Thinking Time)</h3>
                      <div className="grid grid-cols-2 gap-4 text-xs font-black uppercase">
                        <button onClick={() => setEnergy({...energy, block1: !energy.block1})} className={`p-5 rounded-2xl flex items-center gap-3 transition-all ${energy.block1 ? 'bg-blue-600 text-white shadow-xl' : 'bg-white text-slate-400 border border-slate-200'}`}>{energy.block1 ? <CheckCircle2 size={18}/> : <Clock size={18}/>} Tuesday Session (2h)</button>
                        <button onClick={() => setEnergy({...energy, block2: !energy.block2})} className={`p-5 rounded-2xl flex items-center gap-3 transition-all ${energy.block2 ? 'bg-blue-600 text-white shadow-xl' : 'bg-white text-slate-400 border border-slate-200'}`}>{energy.block2 ? <CheckCircle2 size={18}/> : <Clock size={18}/>} Thursday Session (2h)</button>
                      </div>
                      <Target className="absolute -bottom-4 -right-4 opacity-5 w-24 h-24" />
                    </div>

                    {/* MEETINGS */}
                    <div>
                      <div className="flex justify-between items-end mb-4">
                        <h3 className="font-black text-slate-900 text-[10px] uppercase tracking-[0.2em]">Meetings (Decisions vs Updates)</h3>
                        <div className="text-xl font-black text-blue-600">{energy.mtgQuality}% yield</div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <label className="text-[9px] font-black text-slate-400 uppercase block mb-3">Meeting Hours / Week</label>
                          <input type="range" min="0" max="40" value={energy.mtgHours} onChange={(e) => setEnergy({...energy, mtgHours: parseInt(e.target.value)})} className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900" />
                          <div className="text-lg font-black mt-2 text-slate-900">{energy.mtgHours}h</div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <label className="text-[9px] font-black text-slate-400 uppercase block mb-3">Decision Quality Rate (%)</label>
                          <input type="range" min="0" max="100" value={energy.mtgQuality} onChange={(e) => setEnergy({...energy, mtgQuality: parseInt(e.target.value)})} className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                        </div>
                      </div>
                    </div>

                    {/* PEOPLE & NFR */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4 border-t border-slate-50">
                      <div>
                        <h3 className="font-black text-slate-900 text-[10px] uppercase tracking-[0.2em] mb-4 text-red-500 flex items-center gap-2">NFR Chasing Tax <HelpCircle size={10}/></h3>
                        <input type="range" min="0" max="20" value={energy.nfrChasing} onChange={(e) => setEnergy({...energy, nfrChasing: parseInt(e.target.value)})} className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-red-500" />
                        <div className="flex justify-between text-[10px] font-black mt-4 text-red-600 uppercase tracking-tighter"><span>Hours Chasing People</span><span>{energy.nfrChasing}h</span></div>
                      </div>
                      <div className="space-y-6">
                        <h3 className="font-black text-slate-900 text-[10px] uppercase tracking-widest mb-2">Investment in People</h3>
                        <div className="space-y-4">
                           <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                             <input type="range" min="0" max="20" value={energy.peopleStrategic} onChange={(e) => setEnergy({...energy, peopleStrategic: parseInt(e.target.value)})} className="w-full h-1 bg-green-100 rounded-lg appearance-none cursor-pointer accent-green-600" />
                             <div className="flex justify-between text-[8px] font-black text-green-700 uppercase mt-2"><span>Strategic Mentoring</span><span>{energy.peopleStrategic}h</span></div>
                           </div>
                           <div className="bg-orange-50 p-3 rounded-xl border border-orange-100">
                             <input type="range" min="0" max="20" value={energy.peopleOperational} onChange={(e) => setEnergy({...energy, peopleOperational: parseInt(e.target.value)})} className="w-full h-1 bg-orange-100 rounded-lg appearance-none cursor-pointer accent-orange-400" />
                             <div className="flex justify-between text-[8px] font-black text-orange-700 uppercase mt-2"><span>Operational Tasks</span><span>{energy.peopleOperational}h</span></div>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ENERGY RESULTS PANEL */}
              <div className="space-y-6 print:lg:col-span-3">
                <div className="bg-slate-900 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden border border-slate-800">
                  <h3 className="text-blue-400 font-bold uppercase text-[10px] tracking-[0.4em] mb-4">Strategic Yield</h3>
                  <div className="text-8xl font-black mb-2">{auditResults.score}%</div>
                  <div className="flex justify-between items-center border-t border-slate-800 pt-8 mt-10">
                    <div><div className="text-[9px] font-bold text-slate-500 uppercase mb-2">Strategic Hours</div><div className="text-2xl font-black text-green-400">{auditResults.strategic}h</div></div>
                    <div className="text-right"><div className="text-[9px] font-bold text-slate-500 uppercase mb-2">System Waste</div><div className="text-2xl font-black text-red-500">{auditResults.waste}h</div></div>
                  </div>
                  <Zap className="absolute -bottom-10 -right-10 opacity-5 w-40 h-40 text-blue-600" />
                </div>

                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl border-l-8 border-l-blue-600">
                  <h4 className="font-black text-slate-900 mb-6 flex items-center gap-2 text-[10px] uppercase tracking-widest"><FileText size={14} className="text-blue-600"/> Audit Report Insight</h4>
                  <div className="text-xs text-slate-600 leading-relaxed space-y-6 font-medium">
                    <p className="p-4 bg-slate-50 rounded-xl border border-slate-100 italic">
                      "The 14x Output rule states that moving from 5% strategic focus to 70% strategic focus doesn't require more time—it requires the radical removal of coordination chores."
                    </p>
                    {energy.nfrChasing > 3 && (
                      <div className="flex gap-4">
                         <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex-shrink-0 flex items-center justify-center font-black">!</div>
                         <p><span className="text-slate-900 font-black uppercase text-[9px]">NFR Target:</span> Chasing for {energy.nfrChasing}h is the most expensive activity in your week. Recover this via formalized SLAs.</p>
                      </div>
                    )}
                    {energy.peopleOperational > energy.peopleStrategic && (
                      <div className="flex gap-4">
                         <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex-shrink-0 flex items-center justify-center font-black">!</div>
                         <p><span className="text-slate-900 font-black uppercase text-[9px]">People Shift:</span> You are currently a 'Doer' for your team. Shift 5 hours from Tasks to Mentoring to build scalable capability.</p>
                      </div>
                    )}
                  </div>
                </div>
                <button onClick={() => window.print()} className="w-full no-print bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 transition-all hover:bg-blue-600 shadow-xl">
                  <Download size={18}/> Generate ROI Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="hidden print:block fixed bottom-0 left-0 right-0 p-10 border-t border-slate-100 bg-white">
         <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
            <div className="flex flex-col gap-1">
              <span className="text-red-600">© Management Innovations | Manoj Onkar</span>
              <span className="text-slate-900 italic font-black">ODeX Extraordinary Organizations</span>
            </div>
            <div className="flex gap-8">
              <span>www.managementinnovations.co.in</span>
              <span>www.inventleadership.com</span>
            </div>
         </div>
      </footer>
    </div>
  );
}
