import React from 'react';

interface EPLogoProps {
  onClick?: () => void;
  className?: string;
}

export const EPLogo: React.FC<EPLogoProps> = ({ onClick, className = '' }) => {
  // 4x5 grid representations for lowercase e and p
  const letterE = [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [0, 1, 1, 1]
  ];

  const letterP = [
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0]
  ];

  // Colors: Forest Green and Royal Blue
  const c1 = "bg-green-800"; 
  const c2 = "bg-blue-700";

  const renderLetter = (grid: number[][], startIndex: number) => {
    let count = startIndex;
    return (
      <div className="flex flex-col gap-[2px]">
        {grid.map((row, rI) => (
          <div key={rI} className="flex gap-[2px]">
            {row.map((cell, cI) => {
              if (cell === 1) {
                const color = count % 2 === 0 ? c1 : c2;
                count++;
                return <div key={cI} className={`w-1.5 h-1.5 sm:w-2 sm:h-2 ${color} rounded-[1px]`} />;
              }
              return <div key={cI} className="w-1.5 h-1.5 sm:w-2 sm:h-2" />;
            })}
          </div>
        ))}
      </div>
    );
  };

  // Count active blocks to maintain alternating pattern across letters
  const blocksInE = letterE.flat().filter(x => x === 1).length;

  return (
    <div 
      onClick={onClick}
      className={`cursor-pointer flex items-end gap-2 select-none hover:scale-105 transition-transform ${className}`}
      aria-label="EarthPost Home"
      role="button"
    >
      {renderLetter(letterE, 0)}
      {renderLetter(letterP, blocksInE)} 
    </div>
  );
};