export const escaparRegex = (texto: string): string => {
    return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
