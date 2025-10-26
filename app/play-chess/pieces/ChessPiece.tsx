'use client';

import Image from 'next/image';

interface ChessPieceProps {
  piece: string;
  size?: number;
  className?: string;
}

export function ChessPiece({ piece, size = 40, className = '' }: ChessPieceProps) {
  const getPieceImage = () => {
    const imagePath = `/chess-pieces/${piece}.png`;
    
    // Apply blue theme filter based on piece color
    const isWhite = piece.startsWith('w');
    const filterStyle = isWhite 
      ? 'brightness(1.05) saturate(120%) hue-rotate(200deg)' // Light blue/cyan for white pieces
      : 'brightness(0.6) saturate(140%) hue-rotate(200deg)'; // Dark blue for black pieces
    
    return (
      <Image
        src={imagePath}
        alt={`${piece} chess piece`}
        width={size}
        height={size}
        className={`object-contain ${className}`}
        style={{ width: 'auto', height: 'auto', filter: filterStyle }}
        priority
      />
    );
  };

  return (
    <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {getPieceImage()}
    </div>
  );
}