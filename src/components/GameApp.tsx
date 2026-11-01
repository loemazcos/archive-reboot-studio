import { useEffect, useState, type CSSProperties } from 'react';
import Phone from '@/components/phone/Phone';
import NameScreen from '@/components/NameScreen';
import { usePhoneScale } from '@/hooks/usePhoneScale';
import { getDeviceId, getPlayerName } from '@/lib/device';
import { GameStateProvider } from '@/state/GameState';

function App() {
  const scale = usePhoneScale();
  const [name, setName] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    setName(getDeviceId() ? getPlayerName() : null);
  }, []);

  if (name === undefined) return <div className="game-loading" />;
  if (!name) return <NameScreen onReady={setName} />;

  return (
    <GameStateProvider key={name}>
      <div className="phone-stage" style={{ '--phone-scale': scale } as CSSProperties}>
        <Phone />
      </div>
    </GameStateProvider>
  );
}

export default App;
