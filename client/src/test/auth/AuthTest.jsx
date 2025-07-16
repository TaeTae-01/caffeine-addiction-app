import React from 'react';
import SignIn from './SignIn.jsx'
import SignUp from './SignUp.jsx'
import Token from './Token.jsx'
import Logout from './Logout.jsx'
import UserInfo from './UserInfo.jsx';

function AuthTest() {
  return (
    <>
      <h1>AUTH API TEST</h1>
      <SignUp />    
      <SignIn />
      <Token />
      <UserInfo />
      <Logout />
    </>
  );
}

export default AuthTest;
