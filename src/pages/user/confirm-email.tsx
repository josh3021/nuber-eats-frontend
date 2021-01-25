import { gql, useApolloClient, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import ReactHelmet from '../../components/common/helmets/react-helmet';
import { useMe } from '../../hooks/useMe';
import {
  VerifyEmailMutation,
  VerifyEmailMutationVariables,
} from '../../__generated__/VerifyEmailMutation';

const VERIFY_EMAIL_MUTATION = gql`
  mutation VerifyEmailMutation($verifyEmailInput: VerifyEmailInput!) {
    verifyEmail(input: $verifyEmailInput) {
      result
      error
    }
  }
`;

function ConfirmEmail() {
  const client = useApolloClient();
  const { data: userData } = useMe();
  const onCompleted = (data: VerifyEmailMutation) => {
    const {
      verifyEmail: { result },
    } = data;
    if (result && userData?.me.id) {
      client.writeFragment({
        id: `User:${userData?.me.id + ''}`,
        fragment: gql`
          fragment VerifiedUser on User {
            verified
          }
        `,
        data: {
          verified: true,
        },
      });
      history.push('/');
    }
  };
  const [verifyEmail] = useMutation<
    VerifyEmailMutation,
    VerifyEmailMutationVariables
  >(VERIFY_EMAIL_MUTATION, {
    onCompleted,
  });
  const location = useLocation();
  const history = useHistory();
  useEffect(() => {
    const code = location.search.replace('?code=', '');
    verifyEmail({
      variables: {
        verifyEmailInput: {
          code,
        },
      },
    });
  }, [location.search, verifyEmail]);
  return (
    <>
      <ReactHelmet title="Confrim Email" />
      <div className="mt-52 flex flex-col items-center justify-center">
        <h2 className="text-lg mb-2 font-medium">Confirming Email</h2>
        <h4 className="text-gray-700 text-sm">
          Please wait... Do not leave this page.
        </h4>
      </div>
    </>
  );
}

export default ConfirmEmail;
