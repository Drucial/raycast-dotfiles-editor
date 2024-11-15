import { exportToJson, importFromJson } from '../../utils/importExport';
import fs from 'fs';
import { showToast } from '@raycast/api';

jest.mock('fs');
jest.mock('@raycast/api');

describe('Import/Export functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('exportToJson', () => {
    it('should export files to JSON correctly', async () => {
      const mockFiles = [
        {
          id: '1',
          name: 'test',
          path: '/test/path',
          type: 'file' as const,
          application: 'vscode',
        },
      ];

      await exportToJson(mockFiles);

      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('"id":"1"'),
        'utf-8'
      );
      expect(showToast).toHaveBeenCalledWith(
        expect.any(String),
        'Configuration exported successfully'
      );
    });
  });

  // Add more tests...
}); 
