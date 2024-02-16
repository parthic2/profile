import React, { useEffect, useState } from 'react'
import { LinkedInApi, NodeServer } from "./config";
import axios from 'axios';

const App = () => {
  const initialState = {
    user: {},
    loggedIn: false,
  };

  const [state, setState] = useState(initialState);

  useEffect(() => {
    const handlePostMessage = (event) => {
      if (event.data.type === 'code') {
        const { code } = event.data;
        getUserCredentials(code);
      }
    };

    const getUserCredentials = (code) => {
      axios.get(`${NodeServer.baseURL}${NodeServer.getUserCredentials}?code=${code}`)
        .then((res) => {
          const user = res.data;
          setState({
            ...state,
            user,
            loggedIn: true
          });
        });
    };

    const getCodeFromWindowURL = (url) => {
      const popupWindowURL = new URL(url);
      return popupWindowURL.searchParams.get('code');
    };

    if (window.opener && window.opener !== window) {
      const code = getCodeFromWindowURL(window.location.href);
      window.opener.postMessage({ type: 'code', code }, '*');
      window.close();
    }
    window.addEventListener('message', handlePostMessage);

    // clean up the event listeners on components unmount
    return () => {
      window.removeEventListener('message', handlePostMessage);
    }
  }, [state]);

  const showPopup = () => {
    const { clientId, redirectUrl, oauthUrl, scope, state } = LinkedInApi;
    const oauthUrlWithParams = `${oauthUrl}&client_id=${clientId}&scope=${scope}&state=${state}&redirect_url=${redirectUrl}`;
    const width = 450,
      height = 730,
      left = window.screen.width / 2 - width / 2,
      top = window.screen.height / 2 - height / 2;

    window.open(
      oauthUrlWithParams,
      'Linkedin',
      `menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=${width}, height=${height}, top=${top}, left=${left}`
    );
  };

  const { loggedIn, user } = state;

  const contentWhenLoggedIn = (
    <>
      <img src={user.profileImageURL} alt="Profile" />
      <h3>{`${user.firstName} ${user.lastName}`}</h3>
      <h3>{user.email}</h3>
    </>
  );

  const contentWhenLoggedOut = (
    <>
      <h2>Sign in with LinkedIn</h2>
      <img src="linkedInLoginImage" alt="Sign in with LinkedIn" onClick={showPopup} />
    </>
  );

  return (
    <div>
      {loggedIn && user !== {} ? contentWhenLoggedIn : contentWhenLoggedOut}
    </div>
  )
}

export default App