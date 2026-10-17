import { useState } from 'react';
import { dismissInstallBanner, promptInstall, useInstall } from './install';

/** Tombol "Pasang" kecil untuk bar atas; muncul selama aplikasi bisa dipasang. */
export function InstallButton() {
  const { canInstall, needsIosGuide } = useInstall();
  const [guide, setGuide] = useState(false);
  if (!canInstall && !needsIosGuide) return null;
  return (
    <>
      <button className="btn small install-btn" onClick={() => (canInstall ? promptInstall() : setGuide(true))}>
        ⬇ Pasang aplikasi
      </button>
      {guide && <IosGuide onClose={() => setGuide(false)} />}
    </>
  );
}

/** Pop-up ajakan memasang Her Book sebagai aplikasi (PWA). */
export function InstallBanner() {
  const { canInstall, needsIosGuide, showBanner } = useInstall();
  const [guide, setGuide] = useState(false);

  if (guide) return <IosGuide onClose={() => { setGuide(false); dismissInstallBanner(); }} />;
  if (!showBanner) return null;

  return (
    <div className="install-banner" role="dialog" aria-label="Pasang aplikasi Her Book">
      <img src="/icons/icon-192.png" alt="" width="52" height="52" />
      <div className="install-text">
        <strong>Pasang Her Book di perangkatmu</strong>
        <span>Buka seperti aplikasi, layar lebih lega, dan buku yang pernah dibaca tetap bisa dibuka tanpa internet.</span>
      </div>
      <div className="install-actions">
        <button
          className="btn primary small"
          onClick={async () => {
            if (canInstall) await promptInstall();
            else if (needsIosGuide) setGuide(true);
          }}
        >
          Pasang
        </button>
        <button className="btn small" onClick={dismissInstallBanner}>Nanti</button>
      </div>
    </div>
  );
}

function IosGuide({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Cara memasang di iPhone" onClick={(e) => e.stopPropagation()}>
        <h2>Pasang di iPhone / iPad</h2>
        <ol>
          <li>
            Ketuk tombol <strong>Bagikan</strong>{' '}
            <svg className="ios-share" viewBox="0 0 24 24" width="22" height="22" aria-hidden>
              <path d="M12 3v12M8 7l4-4 4 4M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>{' '}
            di bagian bawah Safari.
          </li>
          <li>Gulir ke bawah, pilih <strong>Tambah ke Layar Utama</strong>.</li>
          <li>Ketuk <strong>Tambah</strong>. Ikon Her Book akan muncul di layar utama.</li>
        </ol>
        <button className="btn primary" onClick={onClose}>Mengerti</button>
      </div>
    </div>
  );
}
