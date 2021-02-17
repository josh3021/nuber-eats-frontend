import { ApolloProvider } from '@apollo/client';
import userEvent from '@testing-library/user-event';
import { createMockClient, MockApolloClient } from 'mock-apollo-client';
import { render, RenderResult, waitFor } from '../../test-utils';
import { UserRole } from '../../__generated__/globalTypes';
import CreateAccount, { CREATE_ACCOUNT_MUTATION } from '../create-account';

const mockPush = jest.fn();

jest.mock('react-router-dom', () => {
  const realModule = jest.requireActual('react-router-dom');
  return {
    ...realModule,
    useHistory: () => {
      return {
        push: mockPush,
      };
    },
  };
});

describe('<CreateAccount />', () => {
  let mockApolloClient: MockApolloClient;
  let renderResult: RenderResult;
  beforeEach(async () => {
    await waitFor(() => {
      mockApolloClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockApolloClient}>
          <CreateAccount />
        </ApolloProvider>,
      );
    });
  });
  it('renders OK', async () => {
    await waitFor(() => {
      expect(document.title).toBe('Create Account | Nuber Eats');
    });
  });
  it('renders Validation Errors', async () => {
    let errorMessage: HTMLElement;
    const { getByPlaceholderText, getByTitle } = renderResult;
    const email = getByPlaceholderText('이메일');
    const password = getByPlaceholderText('비밀번호');
    await waitFor(() => {
      userEvent.type(email, 'nonono');
    });
    errorMessage = getByTitle('email-validation-error');
    expect(errorMessage).toHaveTextContent('이메일 형식으로 입력해주세요.');
    await waitFor(() => {
      userEvent.clear(email);
    });
    errorMessage = getByTitle('email-validation-error');
    expect(errorMessage).toHaveTextContent('이메일은 필수항목입니다.');
    await waitFor(() => {
      userEvent.type(password, '123123123');
      userEvent.clear(password);
    });
    errorMessage = getByTitle('password-validation-error');
    expect(errorMessage).toHaveTextContent('비밀번호는 필수항목입니다.');
  });
  it('mutation works OK', async () => {
    const { getByText, getByPlaceholderText } = renderResult;
    const email = getByPlaceholderText('이메일');
    const password = getByPlaceholderText('비밀번호');
    const createAccountBtn = getByText('Create Account');
    const formData = {
      email: 'abc@abc.com',
      password: '123123',
      role: UserRole.Client,
    };
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          result: true,
          error: null,
        },
      },
    });
    mockApolloClient.setRequestHandler(
      CREATE_ACCOUNT_MUTATION,
      mockedMutationResponse,
    );
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(createAccountBtn);
    });
    expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      createAccountInput: {
        email: formData.email,
        password: formData.password,
        role: formData.role,
      },
    });
    expect(mockPush).toHaveBeenCalledWith('/');
  });
  it('will show ERROR when apollo mutation THROWS ERROR', async () => {
    let errorMessage: HTMLElement;
    const { getByText, getByPlaceholderText, getByTitle } = renderResult;
    const email = getByPlaceholderText('이메일');
    const password = getByPlaceholderText('비밀번호');
    const createAccountBtn = getByText('Create Account');
    const formData = {
      email: 'abc@abc.com',
      password: '123123',
      role: UserRole.Client,
    };
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          result: null,
          error: 'MOCKED_ERROR',
        },
      },
    });
    mockApolloClient.setRequestHandler(
      CREATE_ACCOUNT_MUTATION,
      mockedMutationResponse,
    );
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(createAccountBtn);
    });
    expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      createAccountInput: {
        email: 'abc@abc.com',
        password: '123123',
        role: UserRole.Client,
      },
    });
    errorMessage = getByTitle('create-account-mutation-error');
    expect(errorMessage).toHaveTextContent('MOCKED_ERROR');
  });
  afterAll(() => {
    jest.clearAllMocks();
  });
});
