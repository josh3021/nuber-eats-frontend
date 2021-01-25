import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import Button from '../components/common/buttons/button';
import FormError from '../components/common/errors/form-error';
import ReactHelmet from '../components/common/helmets/react-helmet';
import MainLogo from '../components/common/logos/main-logo';
import { EMAIL_REGEXP } from '../services/RegExp/account';
import {
  CreateAccountMutation,
  CreateAccountMutationVariables
} from '../__generated__/CreateAccountMutation';
import { UserRole } from '../__generated__/globalTypes';

interface ICreateAccountForm {
  email: string;
  password: string;
  role: UserRole;
}

const CREATE_ACCOUNT_MUTATION = gql`
  mutation CreateAccountMutation($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      result
      error
    }
  }
`;

function CreateAccount() {
  const {
    register,
    getValues,
    errors,
    handleSubmit,
    formState,
  } = useForm<ICreateAccountForm>({
    mode: 'onChange',
    defaultValues: {
      role: UserRole.Client,
    },
  });
  const history = useHistory();
  const onCompleted = (data: CreateAccountMutation) => {
    const {
      createAccount: { result, error },
    } = data;
    if (result) {
      history.push('/');
    }
  };
  const [
    createAccountMutation,
    { loading, data: createAccountMutationResult },
  ] = useMutation<CreateAccountMutation, CreateAccountMutationVariables>(
    CREATE_ACCOUNT_MUTATION,
    {
      onCompleted,
    },
  );
  const onSubmit = () => {
    if (!loading) {
      const { email, password, role } = getValues();
      createAccountMutation({
        variables: {
          createAccountInput: { email, password, role },
        },
      });
    }
  };
  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <ReactHelmet title="Create Account" />
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <MainLogo />
        <h4 className="w-full font-medium text-left text-3xl mb-5">
          Let's get started!
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
          {errors.email?.type === 'pattern' && (
            <FormError errorMessage="이메일 형식으로 입력해주세요." />
          )}
          <select
            ref={register({ required: true })}
            name="role"
            className="input">
            {Object.keys(UserRole).map((role) => (
              <option key={role}>{role}</option>
            ))}
          </select>
          <Button
            canClick={formState.isValid}
            loading={loading}
            actionText="Create Account"
          />
          {createAccountMutationResult?.createAccount.error && (
            <FormError
              errorMessage={createAccountMutationResult.createAccount?.error}
            />
          )}
        </form>
        <div>
          <span className="mr-2">Already have an account?</span>
          <Link to="/" className="text-lime-600 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;
