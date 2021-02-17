import React from 'react';
import { render, waitFor } from '../../test-utils';
import NotFound from '../404';

describe('<NotFound />', () => {
  it('should renders OK', async () => {
    render(<NotFound />);
    await waitFor(() => {
      expect(document.title).toBe('404 Not Found | Nuber Eats');
    });
  });
});
