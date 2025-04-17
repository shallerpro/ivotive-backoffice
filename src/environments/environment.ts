import packageInfo from "../../package.json";

export const environment = {
  appVersion: packageInfo.version,
  production : false ,
  firebaseConfig: {
    apiKey: "AIzaSyCKp0LgpD-qhhKTy3SMrtrxRyFPoc1zL9U",
    authDomain: "bao-app-staging.firebaseapp.com",
    projectId: "bao-app-staging",
    storageBucket: "bao-app-staging.appspot.com",
    messagingSenderId: "947005594443",
    appId: "1:947005594443:web:ab6192613020f1bc8fa6ce",
    measurementId: "G-0R8S70V4Y0"
  }
};

