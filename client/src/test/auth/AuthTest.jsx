import React from 'react';
import SignIn from './SignIn.jsx'
import SignUp from './SignUp.jsx'
import Status from './Status.jsx'
import Logout from './Logout.jsx'

function AuthTest() {
  return (
    <>
      <h1>AUTH API TEST</h1>
      <SignUp />    
      <SignIn />
      <Status />
      <Logout />
    </>
  );
}

export default AuthTest;
