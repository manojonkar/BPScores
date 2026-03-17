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

const QUESTIONS = [
  { id: 1, text: "Our leadership team communicates a clear and consistent strategic direction.", dim: "Leadership Clarity" },
  { id: 2, text: "Leaders regularly simplify priorities rather than adding new initiatives.", dim: "Leadership Clarity" },
  { id: 3, text: "Leaders encourage focus on outcomes rather than on visible effort.", dim: "Leadership Clarity" },
  { id: 4, text: "Leaders demonstrate strategic thinking in their work, rather than operational busyness.", dim: "Leadership Clarity" },
  { id: 5, text: "Leadership meetings focus on important decisions rather than routine status updates.", dim: "Leadership Clarity" },
  { id: 6, text: "Our organization has a clearly articulated strategic direction that guides all major decisions.", dim: "Strategic Focus" },
  { id: 7, text: "Leaders can clearly explain what the organization will NOT pursue in the next 12 months.", dim: "Strategic Focus" },
  { id: 8, text: "Most employees understand the top two or three strategic priorities of the organization.", dim: "Strategic Focus" },
  { id: 9, text: "Strategic initiatives are limited and well-defined, with clear connections to strategy.", dim: "Strategic Focus" },
  { id: 10, text: "The organization's strategy visibly influences resource allocation.", dim: "Strategic Focus" },
  { id: 11, text: "The organization actively limits the total number of major strategic initiatives running at any time.", dim: "Initiative Discipline" },
  { id: 12, text: "New initiatives are only launched after careful evaluation of importance and feasibility.", dim: "Initiative Discipline" },
  { id: 13, text: "Existing initiatives are regularly reviewed and discontinued when they no longer serve strategy.", dim: "Initiative Discipline" },
  { id: 14, text: "Teams rarely feel overwhelmed by too many simultaneous competing priorities.", dim: "Initiative Discipline" },
  { id: 15, text: "The vast majority of active initiatives can be clearly linked to stated strategic objectives.", dim: "Initiative Discipline" },
  { id: 16, text: "Important organizational decisions are made quickly, clearly, and without excessive delay.", dim: "Decision Effectiveness" },
  { id: 17, text: "Decision rights are clearly defined; everyone understands who has authority to decide what.", dim: "Decision Effectiveness" },
  { id: 18, text: "Employees rarely experience confusion about who should make which types of decisions.", dim: "Decision Effectiveness" },
  { id: 19, text: "Decisions rarely require multiple rounds of approvals that add time without adding quality.", dim: "Decision Effectiveness" },
  { id: 20, text: "Leaders avoid the pattern of revisiting and re-discussing decisions already made.", dim: "Decision Effectiveness" },
  { id: 21, text: "Meetings in our organization have clear objectives, structured agendas, and time limits.", dim: "Meeting Discipline" },
  { id: 22, text: "Meetings almost always result in clear decisions, action items, or meaningful insights.", dim: "Meeting Discipline" },
  { id: 23, text: "The total number of meetings is reasonable and purposeful—not reflexively scheduled.", dim: "Meeting Discipline" },
  { id: 24, text: "Leaders actively work to eliminate unnecessary meetings and protect focused working time.", dim: "Meeting Discipline" },
  { id: 25, text: "Employees genuinely feel that meetings add strategic value rather than consume time.", dim: "Meeting Discipline" },
  { id: 26, text: "Every major strategic initiative has a single, clearly accountable owner—not a committee.", dim: "Accountability" },
  { id: 27, text: "Responsibilities for major organizational outcomes are unambiguous and well understood.", dim: "Accountability" },
  { id: 28, text: "Teams regularly and honestly review progress against strategic commitments.", dim: "Accountability" },
  { id: 29, text: "Underperformance against strategic goals is openly discussed and constructively addressed.", dim: "Accountability" },
  { id: 30, text: "People are held accountable for results achieved, not merely for effort invested.", dim: "Accountability" },
  { id: 31, text: "The organization regularly creates structured time to reflect on what is and is not working.", dim: "Org Learning" },
  { id: 32, text: "Leaders genuinely encourage learning from mistakes rather than penalizing failure.", dim: "Org Learning" },
  { id: 33, text: "Teams allocate meaningful time for improvement, innovation, and capability building.", dim: "Org Learning" },
  { id: 34, text: "Employees are actively encouraged to challenge inefficient processes.", dim: "Org Learning" },
  { id: 35, text: "Continuous improvement is genuinely embedded in daily work.", dim: "Org Learning" },
  { id: 36, text: "Leaders frequently discuss performance outcomes in terms of strategic value, not activity.", dim: "Performance Orientation" },
  { id: 37, text: "Teams have a clear understanding of how their work directly contributes to results.", dim: "Performance Orientation" },
  { id: 38, text: "Success in this organization is genuinely measured by impact, not by effort expended.", dim: "Performance Orientation" },
  { id: 39, text: "Employees feel strongly encouraged to continuously improve their performance.", dim: "Performance Orientation" },
  { id: 40, text: "The organization consistently celebrates meaningful achievements rather than visible busyness.", dim: "Performance Orientation" },
  { id: 41, text: "Our organizational structure and processes are as simple as they can be while remaining effective.", dim: "Org Simplicity" },
  { id: 42, text: "Communication channels are clear and direct—information reaches people efficiently.", dim: "Org Simplicity" },
  { id: 43, text: "The organization actively works to eliminate bureaucracy and unnecessary complexity.", dim: "Org Simplicity" },
  { id: 44, text: "Employees spend the majority of their time executing strategic work rather than coordinating.", dim: "Org Simplicity" },
  { id: 45, text: "When complexity grows, leaders step in to simplify rather than just manage it.", dim: "Org Simplicity" },
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

export default function BPApp() {
  const [activeTab, setActiveTab] = useState('assessment'); // assessment or pruner
  const [view, setView] = useState('welcome'); 
  const [answers, setAnswers] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  
  // Pruner State
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
      return dimQuestions.reduce((acc, q) => acc + (answers[q.id] || 0), 0);
    });
  }, [answers]);

  const totalScore = dimensionScores.reduce((a, b) => a + b, 0);

  // Pruner Logic
  const addInitiative = () => {
    if (!newInit) return;
    setInitiatives([...initiatives, { id: Date.now(), name: newInit, status: 'pending' }]);
    setNewInit("");
  };

  const updateStatus = (id, status) => {
    setInitiatives(initiatives.map(i => i.id === id ? { ...i, status } : i));
  };

  const deleteInit = (id) => setInitiatives(initiatives.filter(i => i.id !== id));

  const capacityFreed = initiatives.filter(i => i.status === 'STOP').length * 10;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* Navigation Bar */}
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 font-black text-xl tracking-tighter">
            <Zap className="text-blue-400 fill-blue-400" /> BP ARCHITECT
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab('assessment')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition ${activeTab === 'assessment' ? 'bg-blue-600' : 'hover:bg-slate-800 text-slate-400'}`}
            >
              <LayoutDashboard size={18} /> Assessment
            </button>
            <button 
              onClick={() => setActiveTab('pruner')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition ${activeTab === 'pruner' ? 'bg-blue-600' : 'hover:bg-slate-800 text-slate-400'}`}
            >
              <Scissors size={18} /> Initiative Pruner
            </button>
          </div>
        </div>
      </nav>

      {activeTab === 'assessment' ? (
        <div className="max-w-5xl mx-auto pt-10 px-4">
          {view === 'welcome' && (
             <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-2xl p-10 text-center border border-slate-100 mt-20">
                <h1 className="text-4xl font-black text-slate-90
