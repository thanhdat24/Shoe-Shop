import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useState } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { getFirestore, collection, doc, getDoc, setDoc } from 'firebase/firestore';
//
import Hex from 'crypto-js/enc-hex';
import hmacSHA256 from 'crypto-js/hmac-sha256';
import { FIREBASE_API } from '../config';
import { isValidToken, setSession, setUser } from '../utils/jwt';
import axios from '../utils/axios';

// ----------------------------------------------------------------------

const ADMIN_EMAILS = ['demo@minimals.cc'];

const firebaseApp = initializeApp(FIREBASE_API);

const AUTH = getAuth(firebaseApp);

const DB = getFirestore(firebaseApp);

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const reducer = (state, action) => {
  if (action.type === 'INITIALISE') {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  }
  const { isAuthenticated, user } = action.payload;
  return {
    ...state,
    isAuthenticated,
    isInitialized: true,
    user,
  };
};

const AuthContext = createContext({
  ...initialState,
  method: 'firebase',
  login: () => Promise.resolve(),
  loginShipper: () => Promise.resolve(),
  registerUser: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  logoutAdmin: () => Promise.resolve(),
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');
        const user = window.localStorage.getItem('user');

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);
          setUser(user);
          const response = await axios.get('/api/v1/admin/getMe');
          const { data } = response.data;

          dispatch({
            type: 'INITIALISE',
            payload: {
              isAuthenticated: true,
              user: data,
            },
          });
        } else {
          dispatch({
            type: 'INITIALISE',
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALISE',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (email, password) => {
    const response = await axios.post('/api/v1/auth/login', {
      email,
      password,
    });
    const { accessToken, user } = response.data;
    console.log('user123', user);
    setSession(accessToken);
    setUser(user);
    dispatch({
      type: 'LOGIN',
      payload: { isAuthenticated: true, user },
    });
  };

  const loginShipper = async (email, password) => {
    const response = await axios.post('/api/v1/shippers/login-shipper', {
      email,
      password,
    });
    const { accessToken, user } = response.data;
    setSession(accessToken);
    dispatch({
      type: 'LOGIN',
      payload: { isAuthenticated: true, user },
    });
  };

  // const register = (email, password, firstName, lastName) =>
  //   createUserWithEmailAndPassword(AUTH, email, password).then(async (res) => {
  //     const userRef = doc(collection(DB, 'users'), res.user?.uid);

  //     await setDoc(userRef, {
  //       uid: res.user?.uid,
  //       email,
  //       displayName: `${firstName} ${lastName}`,
  //     });
  //   });

  const registerUser = async (data) => {
    console.log('data', data);
    const response = await axios.post('/api/v1/user/createUser', data);
    const { user } = response.data;

    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    });
  };

  const logout = () => {
    setSession(null);
    setUser(null);
    signOut(AUTH);
  };
  const logoutAdmin = async () => {
    setSession(null);
    dispatch({
      type: 'INITIALISE',
      payload: {
        isAuthenticated: false,
        user: null,
      },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'firebase',
        user: {
          googleId: state?.user?.uid,
          email: state?.user?.email,
          photoURL: state?.user?.photoURL || profile?.photoURL,
          displayName: state?.user?.displayName || profile?.displayName,
          role: state?.user?.role || 'khách hàng',
          phoneNumber: state?.user?.phoneNumber || profile?.phoneNumber || '',
          country: profile?.country || '',
          address: profile?.address || '',
          about: profile?.about || '',
          licensePlates: state?.user?.licensePlates,
          isPublic: profile?.isPublic || false,
          _id: state?.user?._id,
        },
        login,
        registerUser,
        logout,
        logoutAdmin,
        loginShipper,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider, AUTH };
