describe('Log In', () => {
  const user = cy;
  it('should go to Log In Page', () => {
    user.visit('/').title().should('eq', 'Login | Nuber Eats');
  });
  it('can fill out form', () => {
    user.visit('/');
    user.findByPlaceholderText('이메일').type('abc@abc.com');
    user.findByPlaceholderText('비밀번호').type('1234');
    user.findByText('Login').should('not.have.class', 'pointer-events-none');
  });
  it('can see email, password validation errors', () => {
    user.visit('/');
    user.findByPlaceholderText('이메일').type('not gonna work');
    user
      .findByTitle('email-validation-error')
      .should('have.text', '이메일 형식으로 입력해주세요.');
    user.findByPlaceholderText('이메일').clear();
    user
      .findByTitle('email-validation-error')
      .should('have.text', '이메일은 필수항목입니다.');
    user.findByPlaceholderText('비밀번호').type('1').clear();
    user
      .findByTitle('password-validation-error')
      .should('have.text', '비밀번호는 필수항목입니다.');
  });
  it('should be Log In', () => {
    user.login({ email: 'abc@abc.com', password: '1234' });
  });
});
