import { useState, useEffect, useCallback } from 'react';

const MIN_FONT_SIZE = 80;  // 80% do tamanho padrão
const MAX_FONT_SIZE = 150; // 150% do tamanho padrão
const STEP = 10;            // Incremento de 10% por clique

export const useFontSize = () => {
  const [fontSize, setFontSize] = useState<number>(() => {
    // Recupera a preferência salva no localStorage ou usa 100% como padrão
    const saved = localStorage.getItem('app_font_size');
    return saved ? Number(saved) : 100;
  });

  useEffect(() => {
    // Altera a porcentagem do font-size na tag <html>
    document.documentElement.style.fontSize = `${fontSize}%`;
    localStorage.setItem('app_font_size', String(fontSize));
  }, [fontSize]);

  const increaseFont = useCallback(() => {
    setFontSize((prev) => Math.min(prev + STEP, MAX_FONT_SIZE));
  }, []);

  const decreaseFont = useCallback(() => {
    setFontSize((prev) => Math.max(prev - STEP, MIN_FONT_SIZE));
  }, []);

  const resetFont = useCallback(() => {
    setFontSize(100);
  }, []);

  return { fontSize, increaseFont, decreaseFont, resetFont };
};