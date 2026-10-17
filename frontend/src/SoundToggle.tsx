import { setSoundEnabled, useSoundEnabled } from './sound';

export function SoundToggle() {
  const on = useSoundEnabled();
  return (
    <button className="sound-btn" onClick={() => setSoundEnabled(!on)} aria-pressed={on} aria-label={on ? 'Matikan suara' : 'Nyalakan suara'} title={on ? 'Suara menyala' : 'Suara mati'}>
      {on ? '🔊' : '🔇'}
    </button>
  );
}
