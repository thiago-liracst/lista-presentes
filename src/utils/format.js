/**
 * Formata um valor numérico como moeda brasileira (BRL).
 * @param {number} val
 * @returns {string}  Ex: "R$ 1.250,00"
 */
export const fmt = (val) =>
  Number(val).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });