describe('Update Account', () => {
  const user = cy;
  beforeEach(() => {
    user.login({ email: 'abc@abc.com', password: '1234' });
  });
  it('can go to update account using the header', () => {
    user.get('a[href="/update-account"]').click();
    user.title().should('eq', 'Update Account | Nuber Eats');
  });
  it('can change email', () => {
    user.intercept('POST', 'http://192.168.1.15:3001/graphql', (req) => {
      if (req.body.operationName === 'UpdateAccountMutation') {
        req.body.variables.updateAccountInput.email = 'abc@abc.com';
      }
    });
    user.visit('/update-account');
    user.findByPlaceholderText('이메일').clear().type('new@abc.com');
    user.findByText('Update Account').click();
  });
});
