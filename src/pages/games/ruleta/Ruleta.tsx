import React, { useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { mockBars } from '@/data/mockBars';

type Slice = {
  id: string;
  label: string;
  color: string;
  icon: JSX.Element;
};

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
}

export const Ruleta: React.FC = () => {
  const navigate = useNavigate();
  const { barId } = useParams<{ barId: string }>();
  const bar = mockBars.find((b) => b.id === barId);

  // Define the challenges (slices). Add or tweak as desired.
  const slices: Slice[] = useMemo(
    () => [
      { id: 'shot', label: 'Toma 1 trago', color: '#F87171', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 3h10l-1 7a5 5 0 0 1-8 0L7 3z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
      { id: 'sip', label: 'Toma 2 sorbos', color: '#FB923C', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2v6" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 8h12l-1 9a4 4 0 0 1-8 0L6 8z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
      { id: 'dance', label: 'Baila 30s', color: '#FBCFE8', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2v4" stroke="#B91C1C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M17 9l3 3-1 5-4 3-4-3-1-5 3-3" stroke="#B91C1C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
      { id: 'sing', label: 'Canta una canción', color: '#60A5FA', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 9v6a3 3 0 1 0 6 0V6h4" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
      { id: 'truth', label: 'Responde verdad', color: '#34D399', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
      { id: 'challenge', label: 'Reto loco', color: '#A78BFA', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" stroke="white" strokeWidth="1.0" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    ],
    []
  );

  const count = slices.length;
  const anglePer = 360 / count;

  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<Slice | null>(null);
  const bottleRef = useRef<HTMLImageElement | null>(null);
  const spinAudioRef = useRef<HTMLAudioElement | null>(null);
  const resultAudioRef = useRef<HTMLAudioElement | null>(null);

  // Start the spin by rotating the bottle image in the center. The bottle's pointing
  // direction determines the selected slice.
  const startSpin = () => {
    if (spinning) return;
    setResult(null);
    setSpinning(true);

    // Play spin sound
    if (spinAudioRef.current) {
      spinAudioRef.current.currentTime = 0;
      spinAudioRef.current.play().catch(error => console.error('Error al reproducir audio:', error));
    }

    const spins = 6;
    const randomOffset = Math.random() * 360;
    const finalRotation = spins * 360 + randomOffset;
    const duration = 2 + Math.random() * 2; // Reducido de 3 a 2 segundos (rango: 2-4s)

    // apply transition and transform to the bottle element
    if (bottleRef.current) {
      bottleRef.current.style.transition = `transform ${duration}s cubic-bezier(0.22, 0.61, 0.36, 1)`;
      // trigger layout then set transform
      requestAnimationFrame(() => {
        bottleRef.current!.style.transform = `rotate(${finalRotation}deg)`;
        setRotation(finalRotation);
      });
    } else {
      // fallback: update state so any inline styles update
      requestAnimationFrame(() => setRotation(finalRotation));
    }

    // After animation ends, compute which slice the bottle points to.
    setTimeout(() => {
      const normalized = ((finalRotation % 360) + 360) % 360; // 0..360
      // determine index: which slice contains the angle
      const selectedIndex = Math.floor(normalized / anglePer) % count;
      setResult(slices[selectedIndex]);
      setSpinning(false);
      
      // Stop spin sound
      if (spinAudioRef.current) {
        spinAudioRef.current.pause();
        spinAudioRef.current.currentTime = 0;
      }

      // Play result sound
      if (resultAudioRef.current) {
        resultAudioRef.current.currentTime = 0;
        resultAudioRef.current.play().catch(error => console.error('Error al reproducir audio de resultado:', error));
      }
    }, duration * 1000 + 150);
  };

  const reset = () => {
    setRotation(0);
    setResult(null);
    if (bottleRef.current) {
      bottleRef.current.style.transition = '';
      bottleRef.current.style.transform = `rotate(0deg)`;
    }
    if (spinAudioRef.current) {
      spinAudioRef.current.pause();
      spinAudioRef.current.currentTime = 0;
    }
  };

  // SVG sizing
  const size = 360;
  const radius = size / 2 - 8;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="min-h-screen p-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Hidden audio elements */}
      <audio ref={spinAudioRef} src="/sounds/clown.mp3" preload="auto" loop />
      <audio ref={resultAudioRef} src="/sounds/cerveza_bote.mp3" preload="auto" />

      <div className="max-w-6xl mx-auto">
        {/* Title section */}
        <div className="text-center mb-8">
          <h1 
            className="text-6xl font-extrabold mb-4 animate-bounce"
            style={{ 
              color: 'white',
              textShadow: '0 4px 8px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.5)',
            }}
          >
            🎯 Ruleta de Retos 🎯
          </h1>
          {bar && (
            <h2 className="text-3xl font-bold" style={{ color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
              en {bar.name}
            </h2>
          )}
          <p style={{ color: 'rgba(255,255,255,0.9)', marginTop: '0.5rem', fontSize: '1.2rem' }}>
            ¡Gira y acepta el desafío más loco! 🎪
          </p>
        </div>

        {/* Main game area */}
        <div 
          className="rounded-3xl shadow-2xl p-8"
          style={{
            background: 'white',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 8px rgba(255,255,255,0.3)',
            border: '4px solid rgba(255,255,255,0.5)',
          }}
        >
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
            {/* Wheel */}
            <div className="relative">
              {/* Pointer */}
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-12 z-20">
                <div className="animate-bounce">
                  <div 
                    className="w-0 h-0 border-l-[20px] border-r-[20px] border-b-[32px] border-transparent"
                    style={{ 
                      borderBottomColor: '#FFD700',
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                    }}
                  />
                </div>
              </div>

              {/* Decorative rings around wheel */}
              <div className="absolute inset-0 rounded-full animate-spin-slow" style={{
                background: 'conic-gradient(from 0deg, #FF6B6B, #4ECDC4, #FFE66D, #FF6B6B)',
                opacity: 0.3,
                filter: 'blur(20px)',
                transform: 'scale(1.2)',
              }} />

              {/* Wheel container */}
              <div 
                className="w-[360px] h-[360px] md:w-[420px] md:h-[420px] rounded-full overflow-hidden relative"
                style={{
                  boxShadow: '0 0 0 8px rgba(255,215,0,0.5), 0 0 0 16px rgba(255,255,255,0.3), 0 15px 40px rgba(0, 0, 0, 0.4)',
                  border: '6px solid #FFD700',
                  animation: spinning ? 'pulse 0.5s infinite' : 'none',
                }}
              >
                <svg
                  viewBox={`0 0 ${size} ${size}`}
                  className="w-full h-full block"
                >
                  <g>
                    {slices.map((s, i) => {
                      const startAngle = i * anglePer;
                      const endAngle = startAngle + anglePer;
                      const path = describeArc(cx, cy, radius, startAngle, endAngle);
                      // position icon roughly at slice center
                      const midAngle = startAngle + anglePer / 2;
                      const iconPos = polarToCartesian(cx, cy, radius * 0.6, midAngle);
                      return (
                        <g key={s.id}>
                          <path d={path} fill={s.color} stroke="#111827" strokeWidth={0.5} />
                          <g transform={`translate(${iconPos.x - 10}, ${iconPos.y - 10})`}>
                            <rect x={0} y={0} width={40} height={40} rx={8} ry={8} fill="rgba(255,255,255,0.06)" />
                            <g transform={`translate(10,10)`}>{s.icon}</g>
                            <text x={20} y={34} fontSize={10} fill="#ffffff" textAnchor="middle"></text>
                          </g>
                        </g>
                      );
                    })}
                  </g>
                </svg>

                {/* center label - clickable bottle */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                  <img
                    ref={bottleRef}
                    src="https://rizatoledodistribuciones.es/wp-content/uploads/2024/06/Victoria-Malacati.png"
                    alt="botella"
                    onClick={startSpin}
                    className={`w-64 h-64 md:w-72 md:h-72 object-contain cursor-pointer transition-opacity duration-300 ${spinning ? '' : 'hover:scale-110'}`}
                    style={{ 
                      transform: `rotate(${rotation}deg)`,
                      filter: spinning ? 'brightness(1.2)' : 'none',
                      transition: spinning ? bottleRef.current?.style.transition : 'transform 0.3s ease',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Controls and result */}
            <div className="w-full max-w-md">
              <div className="text-center mb-6 p-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, #FFE66D 0%, #FF6B6B 100%)' }}>
                <div 
                  className="text-xl font-black mb-2"
                  style={{ 
                    color: '#333',
                    textShadow: '0 2px 4px rgba(255,255,255,0.5)',
                  }}
                >
                  🎪 ¡PULSA LA BOTELLA PARA GIRAR! 🎪
                </div>
                <p style={{ color: '#555', fontSize: '1rem', fontWeight: '600' }}>
                  ¡Acepta tu destino! 🍀
                </p>
              </div>

              {result ? (
                <div 
                  className="p-6 rounded-3xl animate-bounce-in relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #fff3cd 0%, #ffe69c 100%)',
                    border: '6px solid #ffc107',
                    boxShadow: '0 20px 50px rgba(255, 193, 7, 0.4), 0 0 0 4px white',
                  }}
                >
                  {/* Confetti effect */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-4 h-4 bg-red-500 rounded-full animate-ping" />
                    <div className="absolute top-0 right-0 w-4 h-4 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: '0.2s' }} />
                    <div className="absolute bottom-0 left-0 w-4 h-4 bg-green-500 rounded-full animate-ping" style={{ animationDelay: '0.4s' }} />
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-purple-500 rounded-full animate-ping" style={{ animationDelay: '0.6s' }} />
                  </div>
                  
                  <div className="flex items-center gap-4 relative z-10">
                    <div 
                      className="w-20 h-20 flex items-center justify-center rounded-2xl flex-shrink-0 transform rotate-12"
                      style={{ 
                        background: result.color,
                        boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                      }}
                    >
                      <div style={{ transform: 'scale(2)' }}>{result.icon}</div>
                    </div>
                    <div className="text-left">
                      <div 
                        className="font-black text-2xl mb-2"
                        style={{ 
                          color: '#ff6b35',
                          textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                        }}
                      >
                        ¡TU RETO! 🎉
                      </div>
                      <div 
                        className="text-xl font-bold"
                        style={{ color: '#333' }}
                      >
                        {result.label}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div 
                  className="p-6 rounded-3xl text-center"
                  style={{
                    background: 'linear-gradient(135deg, rgb(180, 180, 180) 0%, rgb(140, 140, 140) 100%)',
                    border: '3px dashed #999',
                  }}
                >
                  <p style={{ color: '#666', fontSize: '1.1rem', fontWeight: '600' }}>
                    🎲 Gira la ruleta para descubrir tu destino... 🎲
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ruleta;
