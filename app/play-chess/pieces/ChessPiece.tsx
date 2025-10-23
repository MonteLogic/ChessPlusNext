'use client';

interface ChessPieceProps {
  piece: string;
  size?: number;
  className?: string;
}

export function ChessPiece({ piece, size = 40, className = '' }: ChessPieceProps) {
  const getPieceSVG = () => {
    switch (piece) {
      case 'wK': return <WhiteKing size={size} />;
      case 'wQ': return <WhiteQueen size={size} />;
      case 'wR': return <WhiteRook size={size} />;
      case 'wB': return <WhiteBishop size={size} />;
      case 'wN': return <WhiteKnight size={size} />;
      case 'wP': return <WhitePawn size={size} />;
      case 'bK': return <BlackKing size={size} />;
      case 'bQ': return <BlackQueen size={size} />;
      case 'bR': return <BlackRook size={size} />;
      case 'bB': return <BlackBishop size={size} />;
      case 'bN': return <BlackKnight size={size} />;
      case 'bP': return <BlackPawn size={size} />;
      default: return null;
    }
  };

  return (
    <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {getPieceSVG()}
    </div>
  );
}

// White Pieces
function WhiteKing({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className="drop-shadow-sm">
      {/* Base */}
      <rect x="12" y="32" width="16" height="6" rx="2" fill="white" stroke="#374151" strokeWidth="1.5"/>
      {/* Body */}
      <rect x="14" y="20" width="12" height="12" rx="2" fill="white" stroke="#374151" strokeWidth="1.5"/>
      {/* Crown */}
      <path d="M16 20 L14 16 L18 16 L20 20 L22 16 L26 16 L24 20 Z" fill="white" stroke="#374151" strokeWidth="1.5" strokeLinejoin="round"/>
      {/* Cross */}
      <path d="M20 8 L20 12 M18 10 L22 10" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function WhiteQueen({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className="drop-shadow-sm">
      {/* Base */}
      <rect x="12" y="32" width="16" height="6" rx="2" fill="white" stroke="#374151" strokeWidth="1.5"/>
      {/* Body */}
      <rect x="14" y="20" width="12" height="12" rx="2" fill="white" stroke="#374151" strokeWidth="1.5"/>
      {/* Crown with 4 points */}
      <path d="M16 20 L14 16 L18 16 L20 20 L22 16 L26 16 L24 20 Z" fill="white" stroke="#374151" strokeWidth="1.5" strokeLinejoin="round"/>
      {/* Crown points */}
      <circle cx="16" cy="14" r="1.5" fill="white" stroke="#374151" strokeWidth="1"/>
      <circle cx="20" cy="12" r="1.5" fill="white" stroke="#374151" strokeWidth="1"/>
      <circle cx="24" cy="14" r="1.5" fill="white" stroke="#374151" strokeWidth="1"/>
    </svg>
  );
}

function WhiteRook({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className="drop-shadow-sm">
      {/* Base */}
      <rect x="12" y="32" width="16" height="6" rx="2" fill="white" stroke="#374151" strokeWidth="1.5"/>
      {/* Body */}
      <rect x="14" y="16" width="12" height="16" rx="1" fill="white" stroke="#374151" strokeWidth="1.5"/>
      {/* Battlements */}
      <rect x="12" y="8" width="4" height="8" fill="white" stroke="#374151" strokeWidth="1.5"/>
      <rect x="18" y="8" width="4" height="8" fill="white" stroke="#374151" strokeWidth="1.5"/>
      <rect x="24" y="8" width="4" height="8" fill="white" stroke="#374151" strokeWidth="1.5"/>
    </svg>
  );
}

function WhiteBishop({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className="drop-shadow-sm">
      {/* Base */}
      <rect x="12" y="32" width="16" height="6" rx="2" fill="white" stroke="#374151" strokeWidth="1.5"/>
      {/* Body */}
      <ellipse cx="20" cy="24" rx="6" ry="8" fill="white" stroke="#374151" strokeWidth="1.5"/>
      {/* Miter cut */}
      <path d="M18 16 L22 16 L20 20 Z" fill="white" stroke="#374151" strokeWidth="1.5" strokeLinejoin="round"/>
      {/* Top */}
      <circle cx="20" cy="12" r="3" fill="white" stroke="#374151" strokeWidth="1.5"/>
    </svg>
  );
}

function WhiteKnight({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className="drop-shadow-sm">
      {/* Base */}
      <rect x="12" y="32" width="16" height="6" rx="2" fill="white" stroke="#374151" strokeWidth="1.5"/>
      {/* Body */}
      <ellipse cx="20" cy="24" rx="6" ry="8" fill="white" stroke="#374151" strokeWidth="1.5"/>
      {/* Horse head */}
      <path d="M16 20 Q14 16 18 16 Q22 16 20 20 Q18 18 16 20 Z" fill="white" stroke="#374151" strokeWidth="1.5" strokeLinejoin="round"/>
      {/* Eye */}
      <circle cx="18" cy="17" r="1" fill="#374151"/>
    </svg>
  );
}

function WhitePawn({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className="drop-shadow-sm">
      {/* Base */}
      <rect x="12" y="32" width="16" height="6" rx="2" fill="white" stroke="#374151" strokeWidth="1.5"/>
      {/* Body */}
      <ellipse cx="20" cy="24" rx="6" ry="8" fill="white" stroke="#374151" strokeWidth="1.5"/>
      {/* Head */}
      <circle cx="20" cy="12" r="6" fill="white" stroke="#374151" strokeWidth="1.5"/>
    </svg>
  );
}

// Black Pieces
function BlackKing({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className="drop-shadow-sm">
      {/* Base */}
      <rect x="12" y="32" width="16" height="6" rx="2" fill="#374151" stroke="#1f2937" strokeWidth="1.5"/>
      {/* Body */}
      <rect x="14" y="20" width="12" height="12" rx="2" fill="#374151" stroke="#1f2937" strokeWidth="1.5"/>
      {/* Crown */}
      <path d="M16 20 L14 16 L18 16 L20 20 L22 16 L26 16 L24 20 Z" fill="#374151" stroke="#1f2937" strokeWidth="1.5" strokeLinejoin="round"/>
      {/* Cross */}
      <path d="M20 8 L20 12 M18 10 L22 10" stroke="#1f2937" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function BlackQueen({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className="drop-shadow-sm">
      {/* Base */}
      <rect x="12" y="32" width="16" height="6" rx="2" fill="#374151" stroke="#1f2937" strokeWidth="1.5"/>
      {/* Body */}
      <rect x="14" y="20" width="12" height="12" rx="2" fill="#374151" stroke="#1f2937" strokeWidth="1.5"/>
      {/* Crown with 4 points */}
      <path d="M16 20 L14 16 L18 16 L20 20 L22 16 L26 16 L24 20 Z" fill="#374151" stroke="#1f2937" strokeWidth="1.5" strokeLinejoin="round"/>
      {/* Crown points */}
      <circle cx="16" cy="14" r="1.5" fill="#374151" stroke="#1f2937" strokeWidth="1"/>
      <circle cx="20" cy="12" r="1.5" fill="#374151" stroke="#1f2937" strokeWidth="1"/>
      <circle cx="24" cy="14" r="1.5" fill="#374151" stroke="#1f2937" strokeWidth="1"/>
    </svg>
  );
}

function BlackRook({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className="drop-shadow-sm">
      {/* Base */}
      <rect x="12" y="32" width="16" height="6" rx="2" fill="#374151" stroke="#1f2937" strokeWidth="1.5"/>
      {/* Body */}
      <rect x="14" y="16" width="12" height="16" rx="1" fill="#374151" stroke="#1f2937" strokeWidth="1.5"/>
      {/* Battlements */}
      <rect x="12" y="8" width="4" height="8" fill="#374151" stroke="#1f2937" strokeWidth="1.5"/>
      <rect x="18" y="8" width="4" height="8" fill="#374151" stroke="#1f2937" strokeWidth="1.5"/>
      <rect x="24" y="8" width="4" height="8" fill="#374151" stroke="#1f2937" strokeWidth="1.5"/>
    </svg>
  );
}

function BlackBishop({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className="drop-shadow-sm">
      {/* Base */}
      <rect x="12" y="32" width="16" height="6" rx="2" fill="#374151" stroke="#1f2937" strokeWidth="1.5"/>
      {/* Body */}
      <ellipse cx="20" cy="24" rx="6" ry="8" fill="#374151" stroke="#1f2937" strokeWidth="1.5"/>
      {/* Miter cut */}
      <path d="M18 16 L22 16 L20 20 Z" fill="#374151" stroke="#1f2937" strokeWidth="1.5" strokeLinejoin="round"/>
      {/* Top */}
      <circle cx="20" cy="12" r="3" fill="#374151" stroke="#1f2937" strokeWidth="1.5"/>
    </svg>
  );
}

function BlackKnight({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className="drop-shadow-sm">
      {/* Base */}
      <rect x="12" y="32" width="16" height="6" rx="2" fill="#374151" stroke="#1f2937" strokeWidth="1.5"/>
      {/* Body */}
      <ellipse cx="20" cy="24" rx="6" ry="8" fill="#374151" stroke="#1f2937" strokeWidth="1.5"/>
      {/* Horse head */}
      <path d="M16 20 Q14 16 18 16 Q22 16 20 20 Q18 18 16 20 Z" fill="#374151" stroke="#1f2937" strokeWidth="1.5" strokeLinejoin="round"/>
      {/* Eye */}
      <circle cx="18" cy="17" r="1" fill="#1f2937"/>
    </svg>
  );
}

function BlackPawn({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className="drop-shadow-sm">
      {/* Base */}
      <rect x="12" y="32" width="16" height="6" rx="2" fill="#374151" stroke="#1f2937" strokeWidth="1.5"/>
      {/* Body */}
      <ellipse cx="20" cy="24" rx="6" ry="8" fill="#374151" stroke="#1f2937" strokeWidth="1.5"/>
      {/* Head */}
      <circle cx="20" cy="12" r="6" fill="#374151" stroke="#1f2937" strokeWidth="1.5"/>
    </svg>
  );
}
