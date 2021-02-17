import { gql, useApolloClient, useMutation } from '@apollo/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../components/common/buttons/button';
import ApolloError from '../../components/common/errors/apollo-error';
import FormError from '../../components/common/errors/form-error';
import ReactHelmet from '../../components/common/helmets/react-helmet';
import { useMe } from '../../hooks/useMe';
import { EMAIL_REGEXP } from '../../services/RegExp/account';
import {
  UpdateAccountMutation,
  UpdateAccountMutationVariables,
} from '../../__generated__/UpdateAccountMutation';

interface IUpdateAccountForm {
  email?: string;
  password?: string;
}

const UPDATE_ACCOUNT_MUTATION = gql`
  mutation UpdateAccountMutation($updateAccountInput: UpdateAccountInput!) {
    updateAccount(input: $updateAccountInput) {
      result
      error
    }
  }
`;

function UpdateAccount() {
  const client = useApolloClient();
  const onCompleted = (data: UpdateAccountMutation) => {
    const {
      updateAccount: { result },
    } = data;
    if (result && userData) {
      // update the cache
      const {
        me: { email: previousEmail, id },
      } = userData;
      const { email: newEmail } = getValues();

      if (previousEmail !== newEmail) {
        client.writeFragment({
          id: `User:${id}`,
          fragment: gql`
            fragment UpdatedUser on User {
              email
              verified
            }
          `,
          data: {
            email: newEmail,
            verified: false,
          },
        });
      }
    }
  };
  const { data: userData } = useMe();
  const [updateAccount, { loading, error }] = useMutation<
    UpdateAccountMutation,
    UpdateAccountMutationVariables
  >(UPDATE_ACCOUNT_MUTATION, {
    onCompleted,
  });
  const {
    register,
    handleSubmit,
    errors,
    getValues,
    formState,
  } = useForm<IUpdateAccountForm>({
    mode: 'onChange',
    defaultValues: {
      email: userData?.me.email,
    },
  });
  const onSubmit = () => {
    const { email, password } = getValues();
    updateAccount({
      variables: {
        updateAccountInput: {
          email,
          ...(password !== '' && { password }),
        },
      },
    });
  };
  if (error) {
    return <ApolloError errorMessage={error.message} />;
  }
  return (
    <>
      <ReactHelmet title="Update Account" />
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center justify-center mx-auto mt-52">
        <h4 className="w-full font-medium text-center text-xl mb-3">
          Edit Profile
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
            <FormError
              title="email-validation-error"
              errorMessage={errors.email?.message}
            />
          )}
          {errors.email?.type === 'pattern' && (
            <FormError
              title="email-validation-error"
              errorMessage="이메일 형식으로 입력해주세요."
            />
          )}
          <input
            ref={register}
            name="password"
            type="password"
            placeholder="비밀번호"
            className="input"
          />
          <Button
            canClick={formState.isValid}
            loading={loading}
            actionText="Update Account"
            name="update-account-btn"
          />
        </form>
      </div>
    </>
  );
}

export default UpdateAccount;
