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

  // Start the spin by rotating the bottle image in the center. The bottle's pointing
  // direction determines the selected slice.
  const startSpin = () => {
    if (spinning) return;
    setResult(null);
    setSpinning(true);

    const spins = 6; // full spins for visual effect
    // random final angle between 0 and 360 added to full spins
    const randomOffset = Math.random() * 360;
    const finalRotation = spins * 360 + randomOffset;
    const duration = 4 + Math.random() * 2; // seconds

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
    }, duration * 1000 + 150);
  };

  const reset = () => {
    setRotation(0);
    setResult(null);
    if (bottleRef.current) {
      bottleRef.current.style.transition = '';
      bottleRef.current.style.transform = `rotate(0deg)`;
    }
  };

  // SVG sizing
  const size = 360;
  const radius = size / 2 - 8;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="game-card p-6 max-w-xl w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Juego de la ruleta</h1>
        {bar ? (
          <h2 className="text-xl font-semibold mb-2">en {bar.name}</h2>
        ) : (
          <p className="mb-6 text-muted-foreground">Bar no encontrado</p>
        )}

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="relative">
            {/* Pointer */}
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-6 z-20">
              <div className="w-0 h-0 border-l-8 border-r-8 border-b-12 border-transparent border-b-accent-foreground" style={{borderBottomColor: 'rgba(30,41,59,0.9)'}} />
            </div>

            {/* Wheel container */}
            <div className="w-[360px] h-[360px] md:w-[420px] md:h-[420px] rounded-full shadow-lg overflow-hidden relative">
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
                  className={`w-24 h-24 object-contain cursor-pointer ${spinning ? 'opacity-80' : ''}`}
                  style={{ transform: `rotate(${rotation}deg)` }}
                />
                <div className="text-xs text-muted-foreground mt-2">Pulsa la botella para girar</div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-xs">
            <div className="mb-4">
              <Button onClick={() => navigate(-1)} variant="outline" className="w-full">Volver</Button>
            </div>

            <div className="mb-4">
              <Button onClick={startSpin} disabled={spinning} className="w-full">
                {spinning ? 'Girando...' : 'Iniciar Ruleta'}
              </Button>
            </div>

            {result ? (
              <div className="p-4 bg-muted rounded-md text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-md" style={{background: result.color}}>
                    {result.icon}
                  </div>
                  <div>
                    <div className="font-semibold">Resultado</div>
                    <div className="text-sm">{result.label}</div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button onClick={reset} variant="outline">Jugar otra vez</Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Pulsa "Iniciar Ruleta" para girar y recibir un reto.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ruleta;
