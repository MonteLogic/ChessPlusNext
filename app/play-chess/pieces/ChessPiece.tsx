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
    
    return (
      <Image
        src={imagePath}
        alt={`${piece} chess piece`}
        width={size}
        height={size}
        className={`object-contain ${className}`}
        style={{ width: 'auto', height: 'auto' }}
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