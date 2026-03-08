'use client';

import { useGame } from '@/context/GameContext';
import ProgressBar from '@/components/ProgressBar';
import SetupForm from '@/components/SetupForm';
import PlayerInput from '@/components/PlayerInput';
import ResultView from '@/components/ResultView';

export default function Home() {
  const { currentStep } = useGame();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f1a] to-[#0d1f12] font-sans">
      <div className="max-w-lg mx-auto px-4 py-8">
        <ProgressBar />
        {currentStep === 'setup' && <SetupForm />}
        {currentStep === 'player-input' && <PlayerInput />}
        {currentStep === 'result' && <ResultView />}
      </div>
    </div>
  );
}
