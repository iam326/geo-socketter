import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { CognitoUser } from 'amazon-cognito-identity-js';

interface Props {
  onStateChange?: (status: string, data: CognitoUser) => void;
}

export default function SignIn(props: Props) {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const onChangeUsername = (
    event: React.FormEvent<HTMLInputElement>
  ) => setUsername(event.currentTarget.value);

  const onChangePassword = (
    event: React.FormEvent<HTMLInputElement>
  ) => setPassword(event.currentTarget.value);

  const onClickSignIn = async () => {
    if (username === '' || password === '') {
      return;
    }
    try {
      let user = await Auth.signIn(username, password);
      if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
        const { email, phone_number } = user.challengeParam.userAttributes;
        user = await Auth.completeNewPassword(
          user,
          password,
          { email, phone_number }
        );
      }
      if (props.onStateChange) {
        props.onStateChange('signedIn', user);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div>
      <h1>SignIn Page</h1>
      <form>
        <p>username:
          <input
            type="text"
            value={username}
            onChange={onChangeUsername}
          />
        </p>
        <p>password:
          <input
            type="password"
            value={password}
            onChange={onChangePassword}
          />
        </p>
        <button
          type="button"
          onClick={onClickSignIn}
        >
          SignIn
        </button>
      </form>
    </div>
  );
}
