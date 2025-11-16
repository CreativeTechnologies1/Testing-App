
import React, { useState, useCallback } from 'react';
import { generateStartupIdeas, generateBusinessPlan } from './services/geminiService';
import type { StartupIdea, BusinessPlan, AppView } from './types';
import { LightbulbIcon, BriefcaseIcon, ArrowLeftIcon, RocketIcon } from './components/icons';
import LoadingSpinner from './components/LoadingSpinner';

const InitialScreen: React.FC<{ onAnalyze: () => void; isLoading: boolean }> = ({ onAnalyze, isLoading }) => (
    <div className="text-center flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-2xl">
            <RocketIcon className="w-24 h-24 text-teal-400 mx-auto mb-6 animate-pulse"/>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
                Создадим стартап, который <span className="text-teal-400">выстрелит</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8">
                Проанализируем актуальные тренды и идеи, чтобы найти то, что нужно рынку прямо сейчас. Выберите лучшую идею, и мы приступим к разработке бизнес-плана.
            </p>
            <button
                onClick={onAnalyze}
                disabled={isLoading}
                className="inline-flex items-center justify-center px-8 py-4 bg-teal-500 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    'Анализируем...'
                ) : (
                    <>
                        <LightbulbIcon className="w-6 h-6 mr-3" />
                        Найти идеи
                    </>
                )}
            </button>
        </div>
    </div>
);

const IdeaCard: React.FC<{ idea: StartupIdea; onSelect: () => void }> = ({ idea, onSelect }) => (
    <div
        onClick={onSelect}
        className="bg-slate-800 rounded-xl p-6 border border-slate-700 cursor-pointer transition-all duration-300 hover:border-teal-500 hover:shadow-2xl hover:shadow-teal-500/10 hover:-translate-y-2"
    >
        <h3 className="text-xl font-bold text-teal-300 mb-2">{idea.title}</h3>
        <p className="text-slate-400">{idea.description}</p>
    </div>
);

const IdeasScreen: React.FC<{ ideas: StartupIdea[]; onSelectIdea: (idea: StartupIdea) => void; }> = ({ ideas, onSelectIdea }) => (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-white mb-2">Вот несколько перспективных идей</h2>
        <p className="text-center text-slate-400 mb-10">Выберите ту, что кажется вам наиболее интересной, чтобы проработать ее детальнее.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ideas.map((idea, index) => (
                <IdeaCard key={index} idea={idea} onSelect={() => onSelectIdea(idea)} />
            ))}
        </div>
    </div>
);

const DetailSection: React.FC<{ title: string; content: string; }> = ({ title, content }) => (
    <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        <h4 className="text-lg font-semibold text-teal-400 mb-3">{title}</h4>
        <div className="text-slate-300 space-y-2">
            {content.split(';').map((item, index) => item.trim() && <p key={index}>{item.trim()}</p>)}
        </div>
    </div>
);

const DetailsScreen: React.FC<{ idea: StartupIdea; plan: BusinessPlan; onBack: () => void; }> = ({ idea, plan, onBack }) => (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <button onClick={onBack} className="inline-flex items-center text-slate-300 hover:text-teal-400 mb-8 transition-colors">
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Назад к идеям
        </button>
        <div className="text-center mb-10">
            <BriefcaseIcon className="w-16 h-16 text-teal-400 mx-auto mb-4"/>
            <h2 className="text-4xl font-extrabold text-white">{idea.title}</h2>
            <p className="text-slate-400 mt-2">{idea.description}</p>
        </div>
        <div className="space-y-6">
            <DetailSection title="Целевая аудитория" content={plan.targetAudience} />
            <DetailSection title="Проблема" content={plan.problem} />
            <DetailSection title="Решение" content={plan.solution} />
            <DetailSection title="Ключевые функции" content={plan.keyFeatures} />
            <DetailSection title="Стратегия монетизации" content={plan.monetization} />
            <DetailSection title="Маркетинговый план" content={plan.marketingPlan} />
        </div>
    </div>
);

const App: React.FC = () => {
    const [view, setView] = useState<AppView>('initial');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [startupIdeas, setStartupIdeas] = useState<StartupIdea[]>([]);
    const [selectedIdea, setSelectedIdea] = useState<StartupIdea | null>(null);
    const [businessPlan, setBusinessPlan] = useState<BusinessPlan | null>(null);

    const handleAnalyzeIdeas = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const ideas = await generateStartupIdeas();
            setStartupIdeas(ideas);
            setView('ideas');
        } catch (e: any) {
            setError(e.message);
            setView('initial');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSelectIdea = useCallback(async (idea: StartupIdea) => {
        setSelectedIdea(idea);
        setIsLoading(true);
        setError(null);
        setView('details'); 
        try {
            const plan = await generateBusinessPlan(idea.title);
            setBusinessPlan(plan);
        } catch (e: any) {
            setError(e.message);
            setView('ideas'); // Go back to ideas list on error
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    const handleGoBack = useCallback(() => {
        setView('ideas');
        setSelectedIdea(null);
        setBusinessPlan(null);
        setError(null);
    }, []);

    const renderContent = () => {
        if (error && (view === 'initial' || view === 'ideas')) {
            return (
                <div className="text-center p-8 text-red-400 bg-red-900/20 rounded-lg max-w-md mx-auto my-20">
                    <p className="font-bold">Произошла ошибка</p>
                    <p>{error}</p>
                    <button onClick={() => setError(null)} className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Попробовать снова</button>
                </div>
            );
        }
        
        switch (view) {
            case 'initial':
                return <InitialScreen onAnalyze={handleAnalyzeIdeas} isLoading={isLoading} />;
            case 'ideas':
                return <IdeasScreen ideas={startupIdeas} onSelectIdea={handleSelectIdea} />;
            case 'details':
                if (isLoading) {
                    return <LoadingSpinner message={`Разрабатываем бизнес-план для "${selectedIdea?.title}"...`} />;
                }
                if (businessPlan && selectedIdea) {
                    return <DetailsScreen idea={selectedIdea} plan={businessPlan} onBack={handleGoBack} />;
                }
                return <div className="text-center text-slate-400 p-8">Что-то пошло не так.</div>; // Fallback
            default:
                return <InitialScreen onAnalyze={handleAnalyzeIdeas} isLoading={isLoading} />;
        }
    };

    return (
        <div className="bg-slate-900 min-h-screen text-white font-sans">
            <main>
                {renderContent()}
            </main>
        </div>
    );
};

export default App;
