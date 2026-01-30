/**
 * Storage utilities
 *
 * Safe wrappers for browser storage with error handling and SSR compatibility
 */

export { safeGetItem, safeSetItem, safeRemoveItem } from './localStorage';
export {
  exportUserData,
  importUserData,
  readFileAsText,
  validateImportData,
  getExportableData,
  EXPORTABLE_STORAGE_KEYS,
  STORAGE_KEY_LABELS,
  type ExportData,
  type ExportResult,
  type ImportResult,
} from './exportImport';
