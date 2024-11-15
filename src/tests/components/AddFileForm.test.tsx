import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import AddFileForm from '../../components/AddFileForm';
import { showToast } from '@raycast/api';

jest.mock('@raycast/api');

describe('AddFileForm', () => {
  it('should validate required fields', async () => {
    const onSubmit = jest.fn();
    const { getByRole } = render(
      <AddFileForm existingFiles={[]} onSubmit={onSubmit} />
    );

    fireEvent.click(getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(getByRole('alert')).toHaveTextContent('Name is required');
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  // Add more tests...
}); 
