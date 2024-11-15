import { launchApplication } from '../../utils/launcher';
import { exec } from 'child_process';
import { showToast } from '@raycast/api';

jest.mock('child_process');
jest.mock('@raycast/api');

describe('launchApplication', () => {
  const mockExec = exec as jest.MockedFunction<typeof exec>;
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should launch VSCode correctly', async () => {
    const file = {
      id: '1',
      name: 'test',
      path: '/test/path',
      type: 'file' as const,
      application: 'vscode',
    };

    mockExec.mockImplementation((_, callback) => {
      callback?.(null, { stdout: '', stderr: '' }, '');
      return {} as any;
    });

    await launchApplication(file);

    expect(mockExec).toHaveBeenCalledWith(
      expect.stringContaining('Visual Studio Code'),
      expect.any(Function)
    );
    expect(showToast).toHaveBeenCalledWith(expect.any(String), 'Opened successfully');
  });

  // Add more tests for other applications...
}); 
