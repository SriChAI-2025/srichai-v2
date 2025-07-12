import React from 'react';

interface ScoreButtonsProps {
  sectionType: 'A' | 'B' | 'C';
  currentScore: number | undefined;
  onScoreSelect: (score: number) => void;
  isNeoBrutalism?: boolean;
}

const ScoreButtons: React.FC<ScoreButtonsProps> = ({
  sectionType,
  currentScore,
  onScoreSelect,
  isNeoBrutalism = false
}) => {
  const getMaxScore = () => {
    switch (sectionType) {
      case 'A': return 2;
      case 'B': return 5;
      case 'C': return 8;
      default: return 8;
    }
  };

  const maxScore = getMaxScore();

  return (
    <div className="space-y-2">
      <label className={`block text-sm font-medium ${isNeoBrutalism ? 'font-black uppercase tracking-wider text-gray-700' : 'text-gray-700'}`}>
        Score
      </label>
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: maxScore }, (_, index) => {
          const score = index + 1;
          const isSelected = currentScore === score;
          const isDisabled = score > maxScore;
          
          return (
            <button
              key={score}
              onClick={() => onScoreSelect(score)}
              disabled={isDisabled}
              className={`
                w-12 h-12 rounded-lg font-bold text-lg transition-all duration-200 
                ${isSelected 
                  ? isNeoBrutalism 
                    ? 'bg-blue-600 text-white border-4 border-black transform scale-105' 
                    : 'bg-blue-600 text-white border-2 border-blue-600 transform scale-105 shadow-lg'
                  : isNeoBrutalism
                    ? 'bg-white text-black border-4 border-black hover:bg-gray-100 hover:transform hover:scale-105'
                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:transform hover:scale-105 shadow-sm'
                }
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {score}
            </button>
          );
        })}
      </div>
      <div className={`text-xs ${isNeoBrutalism ? 'font-bold uppercase tracking-wide' : 'text-gray-500'}`}>
        Section {sectionType}: Max {maxScore} marks
      </div>
    </div>
  );
};

export default ScoreButtons; 