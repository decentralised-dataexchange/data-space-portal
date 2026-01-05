// Image dimensions
export const IMAGE_DIMENSIONS = {
  COVER_WIDTH: 1500,
  COVER_HEIGHT: 500,
  COVER_ASPECT_RATIO: 3, // 1500/500
  LOGO_MIN_SIZE: 400,
  IMAGE_QUALITY: 0.82,
} as const;

// Timeouts (in milliseconds)
export const TIMEOUTS = {
  API_REQUEST: 15000,
  AUTH_POLL_INTERVAL: 10000,
  COPY_FEEDBACK: 1200,
  COPY_FEEDBACK_LONG: 1500,
  TOAST_DURATION: 3000,
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  DEFAULT_HOME_LIMIT: 12,
  ROWS_PER_PAGE_OPTIONS: [5, 10, 25] as const,
} as const;

// React Query configuration
export const QUERY_CONFIG = {
  STALE_TIME_SHORT: 5 * 60 * 1000, // 5 minutes
  STALE_TIME_LONG: 30 * 60 * 1000, // 30 minutes
  RETRY_COUNT: 2,
} as const;
