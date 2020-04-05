import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { Authenticator } from 'aws-amplify-react';
import { CognitoUser } from 'amazon-cognito-identity-js';

import SignIn from './components/SignIn';
import Room from './components/Room';
import configureStore from './store/configureStore';

const store = configureStore();

function App() {
  const [authState, setAuthState] = useState<string>('');
  // const [authData, setAuthData] = useState<CognitoUser | null>(null);
  const onStateChange = (state: string, _: CognitoUser) => {
    setAuthState(state);
    // setAuthData(data);
  };

  return (
    <React.Fragment>
      {
        authState === 'signedIn'
          ?
            <Provider store={store}>
              <Room />
            </Provider>
          :
            <Authenticator hideDefault={true} onStateChange={onStateChange}>
              <SignIn />
            </Authenticator>
      }
    </React.Fragment>
  );
}

export default App;
