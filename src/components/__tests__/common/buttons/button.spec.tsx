import { render } from '@testing-library/react';
import React from 'react';
import Button from '../../../common/buttons/button';

const BUTTON_TEXT = 'test';

describe('<Button />', () => {
  it('should render OK with props', () => {
    const { getByText } = render(
      <Button
        canClick={true}
        loading={false}
        actionText={BUTTON_TEXT}
        name="1"
      />,
    );
    getByText(BUTTON_TEXT);
  });
  it('should render Loading', () => {
    const { getByText } = render(
      <Button
        canClick={true}
        loading={true}
        actionText={BUTTON_TEXT}
        name="1"
      />,
    );
    getByText('Loading...');
  });
  it('should render disabled button', () => {
    const { getByText, container } = render(
      <Button
        canClick={false}
        loading={false}
        actionText={BUTTON_TEXT}
        name="1"
      />,
    );
    getByText(BUTTON_TEXT);
    expect(container.firstChild).toHaveClass('bg-gray-300 pointer-events-none');
  });
});
