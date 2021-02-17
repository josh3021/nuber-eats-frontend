describe('Create Account', () => {
  const user = cy;
  it('should see email / password validation errors', () => {
    user.visit('/');
    user.findByText('Create an account').click();
    user.findByPlaceholderText('이메일').type('nonono');
    user
      .findByTitle('email-validation-error')
      .should('have.text', '이메일 형식으로 입력해주세요.');
    user.findByPlaceholderText('이메일').clear();
    user
      .findByTitle('email-validation-error')
      .should('have.text', '이메일은 필수항목입니다.');
    user.findByPlaceholderText('비밀번호').type('nononno').clear();
    user
      .findByTitle('password-validation-error')
      .should('have.text', '비밀번호는 필수항목입니다.');
  });
  it('should create an account, and login', () => {
    user.intercept('http://192.168.1.15:3001/graphql', (req) => {
      const { operationName } = req.body;
      if (operationName && operationName === 'CreateAccountMutation') {
        req.reply((res) => {
          res.send({
            data: {
              createAccount: {
                result: true,
                error: null,
                __typename: 'CreateAccountOutput',
              },
            },
          });
        });
      }
    });
    user.visit('/create-account');
    user.findByPlaceholderText('이메일').type('abc@abc.com');
    user.findByPlaceholderText('비밀번호').type('1234');
    user.findByText('Create Account').click();
    user.wait(1000);
    user.login({ email: 'abc@abc.com', password: '1234' });
  });
});
