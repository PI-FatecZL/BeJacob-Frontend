import { useState, useEffect } from 'react';
import { useScreenReader } from '../../hooks/useScreenReader';
import { useFontSize } from '../../hooks/useFontSize';
import { useColorTheme } from '../../hooks/useColorTheme';
import type { ColorTheme } from '../../hooks/useColorTheme';

export const AccessibilityWidget: React.FC = () => {
    const { isSpeaking, speakElement, stop } = useScreenReader();
    const { fontSize, increaseFont, decreaseFont, resetFont } = useFontSize();
    const { theme, changeTheme } = useColorTheme();

    const [isOpen, setIsOpen] = useState(false);
    const [rate, setRate] = useState<number>(1.0);

    useEffect(() => {
        const handleRouteChange = () => {
            stop();
        };

        window.addEventListener('popstate', handleRouteChange);
        return () => {
            window.removeEventListener('popstate', handleRouteChange);
        };
    }, [stop]);

    const handleToggleSpeak = () => {
        if (isSpeaking) {
            stop();
        } else {
            speakElement(null, { rate });
        }
    };

    return (
        <div className="no-read position-fixed bottom-0 end-0 p-4" style={{ zIndex: 9999 }}>
            {isOpen && (
                <div
                    className="card shadow-lg mb-3 p-3 position-absolute bottom-100 end-0"
                    style={{ width: '280px' }}
                >
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <strong className="fs-6">Acessibilidade</strong>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setIsOpen(false)}
                            aria-label="Fechar menu"
                        />
                    </div>

                    <div className="d-flex flex-column gap-3">
                        <div className="d-flex flex-column gap-1">
                            <label htmlFor="themeSelect" className="form-label small fw-semibold text-secondary mb-1">
                                Modo de Cor
                            </label>
                            <select
                                id="themeSelect"
                                value={theme}
                                onChange={(e) => changeTheme(e.target.value as ColorTheme)}
                                className="form-select form-select-sm"
                                aria-label="Selecione o esquema de cores ou filtro para daltonismo"
                            >
                                <option value="default">Padrão</option>
                                <option value="protanopia">Protanopia (Sem Vermelho)</option>
                                <option value="deuteranopia">Deuteranopia (Sem Verde)</option>
                                <option value="tritanopia">Tritanopia (Sem Azul)</option>
                            </select>
                        </div>

                        <hr className="my-1 text-muted" />

                        <div className="d-flex flex-column gap-1">
                            <span className="small fw-semibold text-secondary">Tamanho do Texto</span>
                            <div className="btn-group w-100" role="group" aria-label="Controle de tamanho de fonte">
                                <button
                                    type="button"
                                    onClick={decreaseFont}
                                    className="btn btn-outline-secondary btn-sm"
                                    title="Diminuir fonte"
                                >
                                    A-
                                </button>
                                <button
                                    type="button"
                                    onClick={resetFont}
                                    className="btn btn-outline-secondary btn-sm fw-bold"
                                    title="Tamanho normal"
                                >
                                    A
                                </button>
                                <button
                                    type="button"
                                    onClick={increaseFont}
                                    className="btn btn-outline-secondary btn-sm"
                                    title="Aumentar fonte"
                                >
                                    A+
                                </button>
                            </div>
                            <span className="text-center text-muted small mt-1">{fontSize}%</span>
                        </div>

                        <hr className="my-1 text-muted" />

                        <div className="d-flex flex-column gap-2">
                            <span className="small fw-semibold text-secondary">Leitor de Voz</span>
                            <button
                                type="button"
                                onClick={handleToggleSpeak}
                                className={`btn btn-sm text-white fw-bold w-100 ${isSpeaking ? 'btn-danger' : 'btn-success'}`}
                            >
                                {isSpeaking ? '⏹ Parar Leitura' : '▶ Ouvir Tela'}
                            </button>

                            <div className="d-flex flex-column gap-1">
                                <label htmlFor="speechRate" className="form-label small text-secondary mb-0">
                                    Velocidade: {rate}x
                                </label>
                                <input
                                    id="speechRate"
                                    type="range"
                                    className="form-range"
                                    min="0.5"
                                    max="2"
                                    step="0.25"
                                    value={rate}
                                    onChange={(e) => setRate(parseFloat(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Menu de Acessibilidade"
                className="btn btn-warning rounded-circle shadow d-flex align-items-center justify-content-center p-0 ms-auto fs-3"
                style={{ width: '56px', height: '56px' }}
            >
                <i className="bi bi-universal-access"></i>
            </button>
        </div>
    );
};