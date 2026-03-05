/**
 * Utilidades para el manejo de posts
 */

/**
 * Calcula el tiempo estimado de lectura basado en el contenido
 * @param content - Contenido del post en markdown
 * @param wordsPerMinute - Palabras por minuto (promedio 200-250)
 * @returns Tiempo estimado en formato legible
 */
export function calculateReadTime(content: string, wordsPerMinute: number = 200): string {
  if (!content) return '1 min lectura';

  // Remover markdown syntax para contar solo palabras
  const plainText = content
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]*`/g, '') // Remove inline code
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Replace links with text
    .replace(/[#*_~`]/g, '') // Remove markdown symbols
    .replace(/\n+/g, ' '); // Replace newlines with spaces

  const words = plainText.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);

  return `${minutes} min lectura`;
}

/**
 * Genera un slug a partir de un texto
 * @param text - Texto para convertir en slug
 * @returns Slug generado
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Extrae el primer párrafo del contenido markdown para usar como excerpt
 * @param content - Contenido markdown
 * @param maxLength - Longitud máxima del excerpt
 * @returns Excerpt generado
 */
export function generateExcerpt(content: string, maxLength: number = 160): string {
  if (!content) return '';

  // Remover markdown y obtener el primer párrafo
  const plainText = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/[#*_~`]/g, '')
    .trim();

  const firstParagraph = plainText.split('\n\n')[0];

  if (firstParagraph.length <= maxLength) {
    return firstParagraph;
  }

  return firstParagraph.substring(0, maxLength).trim() + '...';
}

/**
 * Cuenta palabras en el contenido
 * @param content - Contenido markdown
 * @returns Número de palabras
 */
export function countWords(content: string): number {
  if (!content) return 0;

  const plainText = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/[#*_~`]/g, '')
    .replace(/\n+/g, ' ');

  return plainText.trim().split(/\s+/).filter(word => word.length > 0).length;
}
