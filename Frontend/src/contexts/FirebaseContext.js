import { initializeApp } from 'firebase/app';
import { FacebookAuthProvider, getAuth, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useState } from 'react';
//
import { FIREBASE_API } from '../config';
import axios from '../utils/axios';
import { isValidToken, setSession, setUser } from '../utils/jwt';

// ----------------------------------------------------------------------

const firebaseApp = initializeApp(FIREBASE_API);

const AUTH = getAuth(firebaseApp);

const provider = new FacebookAuthProvider();

// const DB = getFirestore(firebaseApp);

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
  loginFacebook: () => Promise.resolve(),
  registerUser: () => Promise.resolve(),
  verifyOTP: () => Promise.resolve(),
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(AUTH, async (user) => {
      if (user) {
        const accessToken = await user.getIdToken();

        const response = await axios.get('/api/v1/user/checkUserExist', { params: { uid: user?.uid } });
        if (response.data.data !== null) {
          const response = await axios.get('/api/v1/user/getUserUID', { params: { uid: user?.uid } });
          setSession(accessToken);
          setUser(response.data.data);
          dispatch({
            type: 'INITIALISE',
            payload: { isAuthenticated: true, user: response.data.data },
          });
        } else {
          const accessToken = await user.getIdToken();
          const data = {
            user: {
              googleId: user.email && user?.uid,
              phoneId: user.phoneNumber && user?.uid,
              email: user?.email,
              photoURL:
                user?.photoURL ||
                'https://res.cloudinary.com/web-app-shoes/image/upload/v1700406437/qcoepcjavj4ixnhrck9k.png',
              displayName: user?.displayName,
              role: user?.role || 'khách hàng',
              phoneNumber: (user.phoneNumber && user?.phoneNumber.slice(3)) || '',
            },
          };

          setSession(accessToken);
          setUser(data);
          dispatch({
            type: 'INITIALISE',
            payload: { isAuthenticated: true, user },
          });
        }
      }
    });

    return () => {
      // Unsubscribe from the onAuthStateChanged listener when the component unmounts
      unsubscribe();
    };
  }, [dispatch]);

  const login = async (email, password) => {
    const response = await axios.post('/api/v1/auth/login', {
      email,
      password,
    });
    const { accessToken, user } = response.data;
    setSession(accessToken);
    setUser(user);
    dispatch({
      type: 'LOGIN',
      payload: { isAuthenticated: true, user },
    });
  };

  const loginFacebook = () => {
    signInWithPopup(AUTH, provider)
      .then((result) => {
        // setUser(result.user);
        console.log('result', result);
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        // const credential = FacebookAuthProvider.credentialFromResult(result);
        // const accessToken = credential.accessToken;
        // fetch facebook graph api to get user actual profile picture
        // fetch(
        //   `https://graph.facebook.com/${result.user.providerData[0].uid}/picture?type=large&access_token=${accessToken}`
        // )
        //   .then((response) => response.blob())
        //   .then((blob) => {
        //     setProfilePicture(URL.createObjectURL(blob));
        //   });
      })
      .catch((err) => {
        console.log(err);
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
    const response = await axios.post('/api/v1/user/createUser', data);
    const { user } = response.data;

    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    });
  };

  const verifyOTP = async (phoneNumber) => {
    const response = await axios.post('/api/v1/otps/verifyOTP', phoneNumber);
    const { accessToken, user } = response.data;
    setSession(accessToken);
    dispatch({
      type: 'LOGIN',
      payload: { isAuthenticated: true, user },
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
          googleId: state?.user?.email && (state?.user?.uid || state?.user?.googleId),
          phoneId: state?.user?.phoneNumber && state?.user?.uid,
          email: state?.user?.email,
          dateOfBirth: state?.user?.dateOfBirth,
          gender: state?.user?.gender,
          photoURL:
            state?.user?.photoURL ||
            profile?.photoURL ||
            'https://res.cloudinary.com/web-app-shoes/image/upload/v1700406437/qcoepcjavj4ixnhrck9k.png',
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
        loginFacebook,
        verifyOTP,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider, AUTH, provider };
