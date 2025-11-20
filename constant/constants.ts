/**
 * Application-wide constants
 * Centralized location for all constants used across the application
 */

// Results reveal date - when the case results are announced
export const RESULTS_REVEAL_DATE = new Date('2025-11-24T00:00:00');

// Check if results are announced (current date >= reveal date)
export const isResultsAnnounced = (): boolean => {
  return new Date() >= RESULTS_REVEAL_DATE;
};

// Format reveal date for display
export const getRevealDateFormatted = (): string => {
  return RESULTS_REVEAL_DATE.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

// Real killer suspect ID (hardcoded for now, can be moved to case data later)
export const REAL_KILLER_ID = "2"; // Martín "Tano" López

