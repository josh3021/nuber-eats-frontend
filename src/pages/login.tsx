import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { authorizedTokenVar, isLoggedInVar } from '../apollo';
import Button from '../components/button';
import ApolloError from '../components/errors/apollo-error';
import FormError from '../components/form-error';
import { LOCALSTORAGE_TOKEN } from '../constants';
import { EMAIL_REGEXP } from '../services/RegExp/account';
import {
  LoginMutation,
  LoginMutationVariables,
} from '../__generated__/LoginMutation';

interface ILoginForm {
  email: string;
  password: string;
}

const LOGIN_MUTATION = gql`
  mutation LoginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
      result
      error
      token
    }
  }
`;

function Login() {
  const {
    register,
    getValues,
    errors,
    handleSubmit,
    formState,
  } = useForm<ILoginForm>({
    mode: 'onChange',
  });
  const onCompleted = (data: LoginMutation) => {
    const {
      login: { result, token },
    } = data;
    if (result && token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, token);
      authorizedTokenVar(token);
      isLoggedInVar(true);
    }
  };
  const [
    loginMutation,
    { loading, error, data: loginMutationResult },
  ] = useMutation<LoginMutation, LoginMutationVariables>(LOGIN_MUTATION, {
    onCompleted,
  });
  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues();
      loginMutation({ variables: { loginInput: { email, password } } });
    }
  };
  if (error) {
    return <ApolloError errorMessage={error.message} />;
  }
  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <Helmet>
        <title>Login | Nuber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <h4 className="w-full font-medium text-left text-3xl mb-5">
          Welcome Back!
        </h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 w-full mb-3">
          <input
            ref={register({
              required: '이메일은 필수항목입니다.',
              pattern: EMAIL_REGEXP,
            })}
            name="email"
            type="email"
            placeholder="이메일"
            className="input"
            required
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
          )}
          {errors.email?.type === 'pattern' && (
            <FormError errorMessage="이메일 형식으로 입력해주세요." />
          )}
          <input
            ref={register({
              required: '비밀번호는 필수항목입니다.',
            })}
            name="password"
            type="password"
            placeholder="비밀번호"
            className="input"
            required
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          <Button
            canClick={formState.isValid}
            loading={loading}
            actionText="Login"
          />
          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult.login?.error} />
          )}
        </form>
        <div>
          <span className="mr-2">New to Nuber?</span>
          <Link to="/create-account" className="text-lime-600 hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
