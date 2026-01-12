"use client";

import React from "react";
import { useAppDispatch } from "@/app/redux";
import { logout, setAuth } from "@/state";
import { useGetAuthUserQuery } from "@/state/api";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import { fetchAuthSession, fetchUserAttributes } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "",
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || "",
      loginWith: {
        email: true,
      },
    },
  },
});

const formFields = {
  signUp: {
    username: {
      order: 1,
      placeholder: "Choose a username",
      label: "Username",
      required: true,
    },
    email: {
      order: 2,
      placeholder: "Enter your email address",
      label: "Email",
      required: true,
    },
    password: {
      order: 3,
      placeholder: "Enter your password",
      label: "Password",
      required: true,
    },
    confirm_password: {
      order: 4,
      placeholder: "Confirm your password",
      label: "Confirm Password",
      required: true,
    },
  },
};

const AuthSync = ({ user }: { user: any }) => {
  const dispatch = useAppDispatch();
  const { data: dbUser, isSuccess: isDbUserLoaded } = useGetAuthUserQuery(undefined, {
    skip: !user,
  });

  React.useEffect(() => {
    const syncToken = async () => {
      if (user) {
        try {
          const session = await fetchAuthSession();
          const token = session.tokens?.idToken?.toString() || null;
          
          dispatch(
            setAuth({
              token: token,
            })
          );
        } catch (error) {
          console.error("Error syncing Cognito session:", error);
        }
      } else {
        dispatch(logout());
      }
    };

    syncToken();
  }, [user, dispatch]);

  React.useEffect(() => {
    if (isDbUserLoaded && dbUser) {
      // Final display check: Ensure we don't show a UUID as the username
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(dbUser.username);
      
      const displayUser = {
        ...dbUser,
        username: isUUID ? (dbUser.email?.split("@")[0] || dbUser.username) : dbUser.username
      };

      dispatch(
        setAuth({
          user: displayUser,
        })
      );
    }
  }, [dbUser, isDbUserLoaded, dispatch]);

  return null;
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  React.useEffect(() => {
    const hubListenerCancel = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signedIn":
        case "signedOut":
          window.location.reload();
          break;
      }
    });

    return () => hubListenerCancel();
  }, []);

  return (
    <div className="mt-5">
      <Authenticator loginMechanisms={["email"]} formFields={formFields}>
        {({ signOut, user }) => (
          <>
            <AuthSync user={user} />
            {user ? (
              <div>{children}</div>
            ) : (
              <div>
                <h1>Please Sign In</h1>
              </div>
            )}
          </>
        )}
      </Authenticator>
    </div>
  );
};

export default AuthProvider;
