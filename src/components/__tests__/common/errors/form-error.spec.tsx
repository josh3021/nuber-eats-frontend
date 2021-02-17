import { render } from '@testing-library/react';
import FormError from '../../../common/errors/form-error';

const ERROR_MESSAGE = 'test error';

describe('<FormError />', () => {
  it('should render OK with props', () => {
    const { container, getByText } = render(
      <FormError errorMessage={ERROR_MESSAGE} />,
    );
    getByText(ERROR_MESSAGE);
    expect(container.firstChild).toHaveClass('font-medium text-red-500');
  });
});
