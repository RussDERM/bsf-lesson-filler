import {css} from 'emotion';
import firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
import React, {useEffect, useState} from 'react';
import {auth} from '../Firebase';

export function FirebaseLogin(): JSX.Element {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  useEffect(() => {
    const ui = new firebaseui.auth.AuthUI(auth);
    const uiConfig = {
      signInOptions: [
        {
          provider: firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID,
        },
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          requireDisplayName: false,
          signInMethod:
            firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
        },
      ],
      autoUpgradeAnonymousUsers: true,
    };

    if (ui.isPendingRedirect()) {
      ui.start('#firebaseui-auth-container', uiConfig);
      setIsVisible(true);
    }

    return auth.onAuthStateChanged(user => {
      if (user) {
        setIsVisible(false);
      } else {
        ui.start('#firebaseui-auth-container', uiConfig);
        setIsVisible(true);
      }
    });
  }, []);

  return (
    <div
      className={styles.root}
      id="firebaseui-auth-container"
      style={{display: isVisible ? undefined : 'none'}}
    />
  );
}

const styles = {
  root: css`
    background: var(--control-background-active);
    bottom: 0;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;

    .firebaseui-id-page-blank,
    .firebaseui-page-provider-sign-in {
      background: none;
    }
  `,
};