import { useState, useEffect, useCallback, useRef } from 'react';

interface ScreenReaderOptions {
  rate?: number;
  lang?: string;
}

const SECTION_LABELS: Record<string, string> = {
  HEADER: 'Cabeçalho',
  NAV: 'Menu de Navegação',
  MAIN: 'Conteúdo Principal',
  SECTION: 'Seção',
  ARTICLE: 'Artigo',
  ASIDE: 'Barra Lateral',
  FOOTER: 'Rodapé da página',
};

export const useScreenReader = () => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Coleta o texto de forma recursiva item a item
  const collectTextFromElement = (element: Element): string[] => {
    const results: string[] = [];

    // Ignora elementos marcados como no-read ou aria-hidden
    if (
      element.classList.contains('no-read') ||
      element.getAttribute('aria-hidden') === 'true' ||
      element.tagName === 'SCRIPT' ||
      element.tagName === 'STYLE'
    ) {
      return results;
    }

    // Se o elemento tem aria-label (ex: botão de menu com ícone), usa o aria-label
    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel && element.children.length === 0) {
      results.push(`${ariaLabel.trim()},`);
      return results;
    }

    // Se for um nó interativo ou de texto (a, button, li, p, h1-h6, span isolado)
    const isInteractiveOrBlock = /^(A|BUTTON|LI|P|H1|H2|H3|H4|H5|H6|TD|TH)$/.test(
      element.tagName
    );

    if (isInteractiveOrBlock) {
      // Pega todo o texto visível desse bloco
      const text = (element as HTMLElement).innerText?.replace(/\s+/g, ' ').trim();
      if (text) {
        // Garante que o item termine com vírgula ou ponto para forçar a pausa na voz
        const formattedText = /[.,!?;:]$/.test(text) ? text : `${text},`;
        results.push(formattedText);
        return results; // Não entra nos filhos para evitar duplicar texto
      }
    }

    // Se for um container genérico (div, ul, container), continua descendo na árvore
    Array.from(element.children).forEach((child) => {
      results.push(...collectTextFromElement(child));
    });

    return results;
  };

  const extractTextWithSections = (root: HTMLElement): string => {
    const clone = root.cloneNode(true) as HTMLElement;

    // Remove elementos globais indesejados
    const elementsToRemove = clone.querySelectorAll(
      'script, style, [aria-hidden="true"], .no-read'
    );
    elementsToRemove.forEach((el) => el.remove());

    const regions = clone.querySelectorAll('header, nav, main, section, article, aside, footer');

    if (regions.length === 0) {
      return collectTextFromElement(clone).join(' ');
    }

    const outputParts: string[] = [];

    regions.forEach((region) => {
      const htmlRegion = region as HTMLElement;
      const tagName = htmlRegion.tagName;

      const customLabel = htmlRegion.getAttribute('aria-label');
      const sectionTitle = customLabel ? `Seção: ${customLabel}` : (SECTION_LABELS[tagName] || '');

      // Extrai os blocos textuais da região com as pausas individuais
      const items = collectTextFromElement(htmlRegion);

      if (items.length > 0) {
        const regionText = items.join(' ');
        if (sectionTitle) {
          outputParts.push(`${sectionTitle}, ${regionText}`);
        } else {
          outputParts.push(regionText);
        }
      }
    });

    return outputParts.join(' ');
  };

  const speakElement = useCallback(
    (element: HTMLElement | null, options: ScreenReaderOptions = {}) => {
      if (!synthRef.current) return;

      const { rate = 1.0, lang = 'pt-BR' } = options;

      if (synthRef.current.speaking) {
        stop();
      }

      const target = element || document.body;
      const textToRead = extractTextWithSections(target);

      if (!textToRead) return;

      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = lang;
      utterance.rate = rate;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current.cancel();
      synthRef.current.speak(utterance);
    },
    [stop]
  );

  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  return { isSpeaking, speakElement, stop };
};