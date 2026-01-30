'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import {
  exportUserData,
  importUserData,
  readFileAsText,
  STORAGE_KEY_LABELS,
  type ExportResult,
  type ImportResult,
} from '@/lib/storage/exportImport';

interface HeaderProps {
  className?: string;
}

type ModalState =
  | { type: 'none' }
  | { type: 'export-info' }
  | { type: 'export-result'; result: ExportResult }
  | { type: 'import-info' }
  | { type: 'import-confirm'; file: File }
  | { type: 'import-result'; result: ImportResult };

export function Header({ className }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [modalState, setModalState] = useState<ModalState>({ type: 'none' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const closeModal = () => {
    setModalState({ type: 'none' });
  };

  const handleExportClick = () => {
    setModalState({ type: 'export-info' });
    setIsMobileMenuOpen(false);
  };

  const handleExportConfirm = () => {
    const result = exportUserData();
    setModalState({ type: 'export-result', result });
  };

  const handleImportClick = () => {
    setModalState({ type: 'import-info' });
    setIsMobileMenuOpen(false);
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setModalState({ type: 'import-confirm', file });
    }
    // Reset input so same file can be selected again
    event.target.value = '';
  };

  const handleImportConfirm = async (file: File) => {
    try {
      const content = await readFileAsText(file);
      const result = importUserData(content);
      setModalState({ type: 'import-result', result });

      // Reload page if import was successful to refresh all state
      if (result.success) {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      setModalState({
        type: 'import-result',
        result: {
          success: false,
          error: 'Villa kom upp við lestur skráar.',
          keysImported: [],
          keysSkipped: [],
        },
      });
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <>
      <header
        className={cn(
          'border-b border-neutral-200 bg-white shadow-sm',
          className
        )}
      >
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex h-20 md:h-24 items-center justify-between">
            {/* Logo/Title - Links to Raunverulegt Tímakaup (home page) */}
            <Link
              href="/"
              className="flex items-center gap-3 flex-shrink-0 hover:opacity-80 transition-opacity"
              aria-label="Fara á forsíðu - Raunverulegt tímakaup"
            >
              <Image
                src="/logo-v2.png"
                alt="Peningana eða lífið logo"
                width={72}
                height={72}
                className="h-[60px] w-auto md:h-[72px]"
                priority
              />
              <h1 className="text-lg font-bold text-primary-700 md:text-xl lg:text-2xl">
                Peningana eða lífið
              </h1>
            </Link>

            {/* Desktop Navigation - Hidden on mobile */}
            <nav className="hidden items-center gap-3 md:flex">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExportClick}
                aria-label="Flytja út gögn"
              >
                Flytja út
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleImportClick}
                aria-label="Flytja inn gögn"
              >
                Flytja inn
              </Button>
            </nav>

            {/* Mobile Menu Button - Hidden on desktop */}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
              aria-label="Opna/loka valmynd"
            >
              {/* Hamburger icon */}
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isMobileMenuOpen ? (
                  // X icon when menu is open
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  // Hamburger icon when menu is closed
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu - Shown when hamburger is clicked */}
          {isMobileMenuOpen && (
            <div className="border-t border-neutral-200 py-4 md:hidden">
              <nav className="flex flex-col gap-2">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleExportClick}
                  className="w-full"
                  aria-label="Flytja út gögn"
                >
                  Flytja út
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleImportClick}
                  className="w-full"
                  aria-label="Flytja inn gögn"
                >
                  Flytja inn
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />

      {/* Export Info Modal */}
      <Modal
        isOpen={modalState.type === 'export-info'}
        onClose={closeModal}
        title="Flytja út gögn"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-neutral-700">
            Þú getur flutt út öll gögnin þín í JSON-skrá sem þú getur geymt á tölvunni þinni.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Hvað er flutt út?</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Útgjaldagrunnlína og allar stillingar</li>
              <li>• FI-tala og sparnaðarskýrsla</li>
              <li>• Sparnaðarmarkmið</li>
              <li>• Stillingar allra reiknivéla (FIRE, LeanFIRE, o.fl.)</li>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-semibold text-amber-800 mb-2">Af hverju að flytja út?</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Til öryggis ef þú eyðir vafragögnum</li>
              <li>• Til að flytja gögn í annan vafra eða tölvu</li>
              <li>• Til að deila stillingum milli tækja</li>
            </ul>
          </div>
        </div>

        <ModalFooter>
          <Button variant="secondary" onClick={closeModal}>
            Hætta við
          </Button>
          <Button variant="primary" onClick={handleExportConfirm}>
            Flytja út gögn
          </Button>
        </ModalFooter>
      </Modal>

      {/* Export Result Modal */}
      <Modal
        isOpen={modalState.type === 'export-result'}
        onClose={closeModal}
        title={
          modalState.type === 'export-result' && modalState.result.success
            ? 'Útflutningur tókst!'
            : 'Villa við útflutning'
        }
        size="md"
      >
        {modalState.type === 'export-result' && (
          <div className="space-y-4">
            {modalState.result.success ? (
              <>
                <div className="flex items-center gap-3 text-green-700">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p>Skráin <strong>{modalState.result.filename}</strong> hefur verið sótt.</p>
                </div>
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                  <h4 className="font-semibold text-neutral-800 mb-2">Flutt út:</h4>
                  <ul className="text-sm text-neutral-600 space-y-1">
                    {modalState.result.keysExported.map((key) => (
                      <li key={key}>• {STORAGE_KEY_LABELS[key] || key}</li>
                    ))}
                  </ul>
                </div>
                <p className="text-sm text-neutral-500">
                  Geymdu skrána á öruggum stað. Þú getur flutt hana inn síðar með &quot;Flytja inn&quot; hnappinum.
                </p>
              </>
            ) : (
              <div className="flex items-center gap-3 text-red-700">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <p>{modalState.result.error}</p>
              </div>
            )}
          </div>
        )}

        <ModalFooter>
          <Button variant="primary" onClick={closeModal}>
            Loka
          </Button>
        </ModalFooter>
      </Modal>

      {/* Import Info Modal */}
      <Modal
        isOpen={modalState.type === 'import-info'}
        onClose={closeModal}
        title="Flytja inn gögn"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-neutral-700">
            Þú getur flutt inn gögn úr skrá sem þú hefur áður flutt út.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Hvernig virkar þetta?</h4>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Smelltu á &quot;Velja skrá&quot; og veldu útflutningsskrána þína</li>
              <li>Staðfestu innflutninginn</li>
              <li>Gögnin þín verða hlaðin inn og síðan endurhlaðin</li>
            </ol>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-semibold text-amber-800 mb-2">Athugið</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Innflutningur yfirskrifar núverandi gögn</li>
              <li>• Skráin verður að vera frá Peningana eða lífið</li>
              <li>• Síðan endurhleðst sjálfkrafa eftir innflutning</li>
            </ul>
          </div>
        </div>

        <ModalFooter>
          <Button variant="secondary" onClick={closeModal}>
            Hætta við
          </Button>
          <Button variant="primary" onClick={handleFileSelect}>
            Velja skrá
          </Button>
        </ModalFooter>
      </Modal>

      {/* Import Confirm Modal */}
      <Modal
        isOpen={modalState.type === 'import-confirm'}
        onClose={closeModal}
        title="Staðfesta innflutning"
        size="md"
      >
        {modalState.type === 'import-confirm' && (
          <div className="space-y-4">
            <p className="text-neutral-700">
              Þú ert að fara að flytja inn gögn úr skránni:
            </p>
            <div className="bg-neutral-100 rounded-lg p-3">
              <p className="font-medium text-neutral-800">{modalState.file.name}</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-700">
                <strong>Athugið:</strong> Þetta mun yfirskrifa öll núverandi gögn í vafranum.
                Síðan endurhleðst sjálfkrafa eftir innflutning.
              </p>
            </div>
          </div>
        )}

        <ModalFooter>
          <Button variant="secondary" onClick={closeModal}>
            Hætta við
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (modalState.type === 'import-confirm') {
                handleImportConfirm(modalState.file);
              }
            }}
          >
            Flytja inn
          </Button>
        </ModalFooter>
      </Modal>

      {/* Import Result Modal */}
      <Modal
        isOpen={modalState.type === 'import-result'}
        onClose={closeModal}
        title={
          modalState.type === 'import-result' && modalState.result.success
            ? 'Innflutningur tókst!'
            : 'Villa við innflutning'
        }
        size="md"
      >
        {modalState.type === 'import-result' && (
          <div className="space-y-4">
            {modalState.result.success ? (
              <>
                <div className="flex items-center gap-3 text-green-700">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p>Gögnin þín hafa verið flutt inn!</p>
                </div>
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                  <h4 className="font-semibold text-neutral-800 mb-2">Flutt inn:</h4>
                  <ul className="text-sm text-neutral-600 space-y-1">
                    {modalState.result.keysImported.map((key) => (
                      <li key={key}>• {STORAGE_KEY_LABELS[key] || key}</li>
                    ))}
                  </ul>
                </div>
                <p className="text-sm text-neutral-500">
                  Síðan endurhleðst nú til að sýna innfluttu gögnin...
                </p>
              </>
            ) : (
              <div className="flex items-center gap-3 text-red-700">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <p>{modalState.result.error}</p>
              </div>
            )}
          </div>
        )}

        <ModalFooter>
          <Button variant="primary" onClick={closeModal}>
            Loka
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
