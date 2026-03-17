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

  // --- LOGIC: ASSESSMENT ---
  const handleAnswer = (value) => {
    setAnswers({ ...answers, [QUESTIONS[currentIdx].id]: value });
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

  // --- LOGIC: ENERGY AUDIT ---
  const auditResults = useMemo(() => {
    const totalPossibleStrategic = (energy.block1 ? 2 : 0) + (energy.block2 ? 2 : 0) + (energy.mtgHours * (energy.mtgQuality/100)) + energy.peopleStrategic;
    const totalWaste = (energy.mtgHours * (1 - energy.mtgQuality/100)) + energy.nfrChasing + energy.peopleOperational + energy.reactive;
    const totalHours = totalPossibleStrategic + totalWaste;
    const capacityScore = totalHours > 0 ? Math.round((totalPossibleStrategic / totalHours) * 100) : 0;
    return { strategic: totalPossibleStrategic.toFixed(1), waste: totalWaste.toFixed(1), score: capacityScore, total: totalHours.toFixed(1) };
  }, [energy]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 print:bg-white print:pb-0">
      
      {/* BRANDING HEADER */}
      <header className="bg-white border-b border-slate-100 p-4 sticky top-0 z-50 shadow-sm print:relative">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
                <span className="text-[10px] font-black text-red-600 tracking-[0.2em] uppercase leading-none">Management Innovations</span>
                <span className="text-[8px] font-bold text-slate-400 tracking-widest uppercase mt-1">Vision to Implementation</span>
            </div>
            <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>
            <div className="hidden md:flex items-center gap-2">
                <span className="text-xl font-black italic tracking-tighter text-slate-900">ODeX</span>
                <span className="text-[8px] font-bold text-slate-500 uppercase leading-tight w-20">Extraordinary Organizations</span>
            </div>
          </div>
          <div className="flex gap-2 no-print">
            <button onClick={() => setActiveTab('assessment')} className={`px-4 py-2 rounded-lg font-bold text-xs transition ${activeTab === 'assessment' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-900'}`}>Assessment</button>
            <button onClick={() => setActiveTab('energy')} className={`px-4 py-2 rounded-lg font-bold text-xs transition ${activeTab === 'energy' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-900'}`}>Energy Audit</button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto pt-8 px-4">
        
        {/* TAB 1: ASSESSMENT */}
        {activeTab === 'assessment' && (
          <div className="animate-in fade-in duration-500">
            {quizView === 'landing' && (
              <div className="max-w-4xl mx-auto py-10">
                <div className="text-center mb-12">
                   <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">The High Performance <span className="text-blue-600 italic">Quest</span></h1>
                   <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                     A leadership invitation to diagnose the gap between <strong>Endless Activity</strong> and <strong>Real Results</strong>.
                   </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                  <div className="bg-white p-10 rounded-3xl shadow-xl border-t-4 border-t-blue-600 flex flex-col justify-between hover:scale-[1.01] transition-transform">
                    <div>
                      <Briefcase className="text-blue-600 mb-6" size={32}/>
                      <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">CEOs & Founders</h2>
                      <p className="text-slate-500 text-sm mb-6 leading-relaxed">Assess your role as an <strong>Architect Leader</strong>. Are you creating clarity or managing the clutter?</p>
                      <button onClick={() => {setUserRole('ceo'); setQuizView('quiz');}} className="w-full py-4 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center justify-center gap-2">Start CEO Audit <ChevronRight size={16}/></button>
                    </div>
                  </div>
                  <div className="bg-white p-10 rounded-3xl shadow-xl border-t-4 border-t-slate-900 flex flex-col justify-between hover:scale-[1.01] transition-transform">
                    <div>
                      <Users className="text-slate-900 mb-6" size={32}/>
                      <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Employees & Teams</h2>
                      <p className="text-slate-500 text-sm mb-6 leading-relaxed">Identify the <strong>Friction Points</strong> stealing your focus. Help your leaders build a better system.</p>
                      <button onClick={() => {setUserRole('employee'); setQuizView('quiz');}} className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2">Identify Friction <ChevronRight size={16}/></button>
                    </div>
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
                    <button key={val} onClick={() => handleAnswer(val)} className="h-16 md:h-20 border-2 border-slate-50 rounded-2xl flex items-center justify-center hover:border-blue-600 hover:bg-blue-50 transition-all font-black text-2xl text-slate-200 hover:text-blue-600 active:scale-95">{val}</button>
                  ))}
                </div>
              </div>
            )}

            {quizView === 'results' && (
              <div className="space-y-8 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 text-center">
                      <h2 className="text-slate-400 font-bold uppercase text-xs mb-2 tracking-widest">Assessment Result</h2>
                      <div className="text-8xl font-black text-slate-
