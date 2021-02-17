import { ApolloProvider } from '@apollo/client';
import userEvent from '@testing-library/user-event';
import { createMockClient, MockApolloClient } from 'mock-apollo-client';
import React from 'react';
import { render, RenderResult, waitFor } from '../../test-utils';
import Login, { LOGIN_MUTATION } from '../login';

describe('<Login />', () => {
  let renderResult: RenderResult;
  let mockApolloClient: MockApolloClient;
  beforeEach(async () => {
    await waitFor(() => {
      mockApolloClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockApolloClient}>
          <Login />
        </ApolloProvider>,
      );
    });
  });
  it('should render OK', async () => {
    await waitFor(() => {
      expect(document.title).toBe('Login | Nuber Eats');
    });
  });

  it('displays email validation errors', async () => {
    const { getByPlaceholderText, getByTitle } = renderResult;
    const email = getByPlaceholderText(/이메일/i);
    await waitFor(() => {
      userEvent.type(email, 'this');
    });
    let errorMessage = getByTitle('email-validation-error');
    expect(errorMessage).toHaveTextContent(/이메일 형식으로 입력해주세요./i);
    await waitFor(() => {
      userEvent.clear(email);
    });
    errorMessage = getByTitle('email-validation-error');
    expect(errorMessage).toHaveTextContent(/이메일은 필수항목입니다./i);
  });

  it('displays password required errors', async () => {
    const { getByPlaceholderText, getByTitle, getByText } = renderResult;
    const email = getByPlaceholderText(/이메일/i);
    const loginBtn = getByText('Login');
    await waitFor(() => {
      userEvent.type(email, 'this@wont');
      userEvent.click(loginBtn);
    });
    let errorMessage = getByTitle('password-validation-error');
    expect(errorMessage).toHaveTextContent(/비밀번호는 필수항목입니다./i);
  });

  it('submits form and calls mutation', async () => {
    const { getByPlaceholderText, getByText, getByTitle } = renderResult;
    const email = getByPlaceholderText(/이메일/i);
    const password = getByPlaceholderText(/비밀번호/i);
    const loginBtn = getByText('Login');
    const formData = {
      email: 'jest@test.com',
      password: 'jest12!',
    };
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        login: {
          result: true,
          token: 'MOCKED_TOKEN',
          error: null,
        },
      },
    });
    mockApolloClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);
    jest.spyOn(Storage.prototype, 'setItem');
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(loginBtn);
    });
    expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      loginInput: {
        email: 'jest@test.com',
        password: 'jest12!',
      },
    });
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'nuber-token',
      'MOCKED_TOKEN',
    );
  });

  it('will NOT submit form when account does not match', async () => {
    const { getByPlaceholderText, getByText, getByTitle } = renderResult;
    const email = getByPlaceholderText(/이메일/i);
    const password = getByPlaceholderText(/비밀번호/i);
    const loginBtn = getByText('Login');
    const formData = {
      email: 'jest@test.com',
      password: 'jest12!',
    };
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        login: {
          result: false,
          token: null,
          error: 'password does not match.',
        },
      },
    });
    mockApolloClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(loginBtn);
    });
    expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      loginInput: {
        email: 'jest@test.com',
        password: 'jest12!',
      },
    });
    const errorMessage = getByTitle('login-mutation-error');
    expect(errorMessage).toHaveTextContent(/password does not match./i);
  });

  it('will show ERROR when apollo mutation THROWS ERROR', async () => {
    const { getByPlaceholderText, getByText, getByRole } = renderResult;
    const email = getByPlaceholderText(/이메일/i);
    const password = getByPlaceholderText(/비밀번호/i);
    const loginBtn = getByText('Login');
    const formData = {
      email: 'jest@test.com',
      password: 'jest12!',
    };
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: null,
      error: 'MOCKED_ERROR',
    });
    mockApolloClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(loginBtn);
    });
    expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      loginInput: {
        email: 'jest@test.com',
        password: 'jest12!',
      },
    });
    // const errorMessage = getByRole('alert');
    // expect(mockedMutationResponse).toHaveTextContent(/Error Occured./i);
  });
});
