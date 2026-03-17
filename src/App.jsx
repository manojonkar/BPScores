import React, { useState, useMemo } from 'react';
import { Radar } from 'react-chartjs-2';
import { 
  Trophy, 
  Activity, 
  Zap, 
  Target, 
  AlertCircle, 
  ChevronRight, 
  RefreshCcw, 
  BarChart3 
} from 'lucide-react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const QUESTIONS = [
  // Dimension 1: Leadership Clarity
  { id: 1, text: "Our leadership team communicates a clear and consistent strategic direction.", dim: "Leadership Clarity" },
  { id: 2, text: "Leaders regularly simplify priorities rather than adding new initiatives.", dim: "Leadership Clarity" },
  { id: 3, text: "Leaders encourage focus on outcomes rather than on visible effort.", dim: "Leadership Clarity" },
  { id: 4, text: "Leaders demonstrate strategic thinking in their work, rather than operational busyness.", dim: "Leadership Clarity" },
  { id: 5, text: "Leadership meetings focus on important decisions rather than routine status updates.", dim: "Leadership Clarity" },
  // Dimension 2: Strategic Focus
  { id: 6, text: "Our organization has a clearly articulated strategic direction that guides all major decisions.", dim: "Strategic Focus" },
  { id: 7, text: "Leaders can clearly explain what the organization will NOT pursue in the next 12 months.", dim: "Strategic Focus" },
  { id: 8, text: "Most employees understand the top two or three strategic priorities of the organization.", dim: "Strategic Focus" },
  { id: 9, text: "Strategic initiatives are limited and well-defined, with clear connections to strategy.", dim: "Strategic Focus" },
  { id: 10, text: "The organization's strategy visibly influences resource allocation.", dim: "Strategic Focus" },
  // Dimension 3: Initiative Discipline
  { id: 11, text: "The organization actively limits the total number of major strategic initiatives running at any time.", dim: "Initiative Discipline" },
  { id: 12, text: "New initiatives are only launched after careful evaluation of importance and feasibility.", dim: "Initiative Discipline" },
  { id: 13, text: "Existing initiatives are regularly reviewed and discontinued when they no longer serve strategy.", dim: "Initiative Discipline" },
  { id: 14, text: "Teams rarely feel overwhelmed by too many simultaneous competing priorities.", dim: "Initiative Discipline" },
  { id: 15, text: "The vast majority of active initiatives can be clearly linked to stated strategic objectives.", dim: "Initiative Discipline" },
  // Dimension 4: Decision Effectiveness
  { id: 16, text: "Important organizational decisions are made quickly, clearly, and without excessive delay.", dim: "Decision Effectiveness" },
  { id: 17, text: "Decision rights are clearly defined; everyone understands who has authority to decide what.", dim: "Decision Effectiveness" },
  { id: 18, text: "Employees rarely experience confusion about who should make which types of decisions.", dim: "Decision Effectiveness" },
  { id: 19, text: "Decisions rarely require multiple rounds of approvals that add time without adding quality.", dim: "Decision Effectiveness" },
  { id: 20, text: "Leaders avoid the pattern of revisiting and re-discussing decisions already made.", dim: "Decision Effectiveness" },
  // Dimension 5: Meeting Discipline
  { id: 21, text: "Meetings in our organization have clear objectives, structured agendas, and time limits.", dim: "Meeting Discipline" },
  { id: 22, text: "Meetings almost always result in clear decisions, action items, or meaningful insights.", dim: "Meeting Discipline" },
  { id: 23, text: "The total number of meetings is reasonable and purposeful—not reflexively scheduled.", dim: "Meeting Discipline" },
  { id: 24, text: "Leaders actively work to eliminate unnecessary meetings and protect focused working time.", dim: "Meeting Discipline" },
  { id: 25, text: "Employees genuinely feel that meetings add strategic value rather than consume time.", dim: "Meeting Discipline" },
  // Dimension 6: Accountability and Ownership
  { id: 26, text: "Every major strategic initiative has a single, clearly accountable owner—not a committee.", dim: "Accountability" },
  { id: 27, text: "Responsibilities for major organizational outcomes are unambiguous and well understood.", dim: "Accountability" },
  { id: 28, text: "Teams regularly and honestly review progress against strategic commitments.", dim: "Accountability" },
  { id: 29, text: "Underperformance against strategic goals is openly discussed and constructively addressed.", dim: "Accountability" },
  { id: 30, text: "People are held accountable for results achieved, not merely for effort invested.", dim: "Accountability" },
  // Dimension 7: Organizational Learning
  { id: 31, text: "The organization regularly creates structured time to reflect on what is and is not working.", dim: "Org Learning" },
  { id: 32, text: "Leaders genuinely encourage learning from mistakes rather than penalizing failure.", dim: "Org Learning" },
  { id: 33, text: "Teams allocate meaningful time for improvement, innovation, and capability building.", dim: "Org Learning" },
  { id: 34, text: "Employees are actively encouraged to challenge inefficient processes.", dim: "Org Learning" },
  { id: 35, text: "Continuous improvement is genuinely embedded in daily work.", dim: "Org Learning" },
  // Dimension 8: Performance Orientation
  { id: 36, text: "Leaders frequently discuss performance outcomes in terms of strategic value, not activity.", dim: "Performance Orientation" },
  { id: 37, text: "Teams have a clear understanding of how their work directly contributes to results.", dim: "Performance Orientation" },
  { id: 38, text: "Success in this organization is genuinely measured by impact, not by effort expended.", dim: "Performance Orientation" },
  { id: 39, text: "Employees feel strongly encouraged to continuously improve their performance.", dim: "Performance Orientation" },
  { id: 40, text: "The organization consistently celebrates meaningful achievements rather than visible busyness.", dim: "Performance Orientation" },
  // Dimension 9: Organizational Simplicity
  { id: 41, text: "Our organizational structure and processes are as simple as they can be while remaining effective.", dim: "Org Simplicity" },
  { id: 42, text: "Communication channels are clear and direct—information reaches people efficiently.", dim: "Org Simplicity" },
  { id: 43, text: "The organization actively works to eliminate bureaucracy and unnecessary complexity.", dim: "Org Simplicity" },
  { id: 44, text: "Employees spend the majority of their time executing strategic work rather than coordinating.", dim: "Org Simplicity" },
  { id: 45, text: "When complexity grows, leaders step in to simplify rather than just manage it.", dim: "Org Simplicity" },
  // Dimension 10: Culture of High Performance
  { id: 46, text: "The organizational culture consistently celebrates results, impact, and value creation.", dim: "Culture of HP" },
  { id: 47, text: "Leaders model high performance behavior—focused, strategic, decisive, and disciplined.", dim: "Culture of HP" },
  { id: 48, text: "The organization has a shared sense of ambition that drives people toward results.", dim: "Culture of HP" },
  { id: 49, text: "People at all levels feel a genuine sense of ownership for performance.", dim: "Culture of HP" },
  { id: 50, text: "High performance is the standard—not a special achievement, but the expectation.", dim: "Culture of HP" }
];

const DIMENSIONS = [
  "Leadership Clarity", "Strategic Focus", "Initiative Discipline", 
  "Decision Effectiveness", "Meeting Discipline", "Accountability", 
  "Org Learning", "Performance Orientation", "Org Simplicity", "Culture of HP"
];

export default function BPScoreAssessment() {
  const [view, setView] = useState('welcome'); // welcome, quiz, results
  const [answers, setAnswers] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);

  const handleAnswer = (value) => {
    const questionId = QUESTIONS[currentIdx].id;
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setView('results');
    }
  };

  const dimensionScores = useMemo(() => {
    return DIMENSIONS.map((dim, idx) => {
      const dimQuestions = QUESTIONS.filter(q => q.dim === dim);
      const sum = dimQuestions.reduce((acc, q) => acc + (answers[q.id] || 0), 0);
      return sum;
    });
  }, [answers, view]);

  const totalScore = dimensionScores.reduce((a, b) => a + b, 0);

  const getStatus = (score) => {
    if (score <= 100) return { label: "IDLE", color: "text-gray-500", bg: "bg-gray-100", icon: <Activity /> };
    if (score <= 150) return { label: "BUSY", color: "text-red-600", bg: "bg-red-50", icon: <AlertCircle /> };
    if (score <= 200) return { label: "EFFICIENT", color: "text-blue-600", bg: "bg-blue-50", icon: <Zap /> };
    return { label: "HIGH PERFORMANCE", color: "text-green-600", bg: "bg-green-50", icon: <Trophy /> };
  };

  const chartData = {
    labels: DIMENSIONS,
    datasets: [{
      label: 'Score (Max 25)',
      data: dimensionScores,
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(59, 130, 246, 1)',
    }]
  };

  if (view === 'welcome') return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl p-10 text-center border border-slate-100">
        <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3">
          <BarChart3 className="text-white w-10 h-10" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">The BP Score Assessment</h1>
        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
          Based on "Busyness vs High Performance". Evaluate your organization across 50 key indicators to find your position on the performance spectrum.
        </p>
        <button 
          onClick={() => setView('quiz')}
          className="group w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
        >
          Start Diagnosis
          <ChevronRight className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );

  if (view === 'results') {
    const status = getStatus(totalScore);
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Score Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-100">
              <h2 className="text-slate-500 font-bold uppercase tracking-widest text-sm mb-2">Total BP Score</h2>
              <div className="text-8xl font-black text-slate-900 mb-4">{totalScore}</div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${status.bg} ${status.color}`}>
                {status.icon} {status.label} ORGANIZATION
              </div>
              <p className="text-slate-500 mt-6 text-sm italic leading-relaxed">
                {totalScore <= 150 ? "Your organization is currently trapped in activity. You are working hard, but progress is leaking through complexity." : "You have a strong foundation. Focus on consistency and disciplined execution."}
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Target className="text-blue-600" /> Improvement Priorities
              </h3>
              <div className="space-y-3">
                {DIMENSIONS.map((dim, i) => (
                  dimensionScores[i] < 15 && (
                    <div key={dim} className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                      <span className="text-sm font-medium text-slate-700">{dim}</span>
                      <span className="text-red-600 font-bold">{dimensionScores[i]}</span>
                    </div>
                  )
                ))}
              </div>
              <button 
                onClick={() => {setView('welcome'); setAnswers({}); setCurrentIdx(0);}}
                className="mt-8 w-full flex items-center justify-center gap-2 text-slate-400 hover:text-blue-600 font-bold transition-colors"
              >
                <RefreshCcw size={18} /> Restart Assessment
              </button>
            </div>
          </div>

          {/* Chart View */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8 border border-slate-100 flex flex-col justify-center items-center">
            <h3 className="text-xl font-bold text-slate-900 mb-8 self-start">The BP Score Profile</h3>
            <div className="w-full max-w-md">
              <Radar 
                data={chartData} 
                options={{ 
                  scales: { r: { min: 0, max: 25, ticks: { display: false } } },
                  plugins: { legend: { display: false } }
                }} 
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-10 w-full">
               {DIMENSIONS.map((dim, i) => (
                 <div key={dim} className="text-center">
                   <div className="text-xs text-slate-400 font-bold uppercase truncate">{dim}</div>
                   <div className="text-lg font-black text-slate-800">{dimensionScores[i]}</div>
                 </div>
               ))}
            </div>
          </div>

        </div>
      </div>
    );
  }

  const currentQ = QUESTIONS[currentIdx];
  const progress = ((currentIdx + 1) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-slate-100">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-widest">
            {currentQ.dim}
          </span>
          <span className="text-slate-400 font-bold text-sm">
            {currentIdx + 1} / 50
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full mb-12">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Question */}
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-12 leading-snug">
          {currentQ.text}
        </h2>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((val) => (
            <button
              key={val}
              onClick={() => handleAnswer(val)}
              className="group relative h-20 border-2 border-slate-100 rounded-2xl flex flex-col items-center justify-center hover:border-blue-600 hover:bg-blue-50 transition-all active:scale-95"
            >
              <span className="text-2xl font-black text-slate-300 group-hover:text-blue-600 transition-colors">
                {val}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                {val === 1 ? "Strongly Disagree" : val === 5 ? "Strongly Agree" : ""}
              </span>
            </button>
          ))}
        </div>

        <p className="text-center text-slate-400 text-xs mt-8 font-medium">
          Choose a score from 1 (lowest) to 5 (highest)
        </p>

      </div>
    </div>
  );
}
