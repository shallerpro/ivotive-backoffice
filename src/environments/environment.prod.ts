import packageInfo from "../../package.json";

export const environment = {
  appVersion: packageInfo.version,
  production: true,
    firebaseConfig: {
      apiKey: "AIzaSyCWkqPPif-vGTzY10MNJ_wIG5LlF1nZ5EM",
      authDomain: "bao-app-prod.firebaseapp.com",
      projectId: "bao-app-prod",
      storageBucket: "bao-app-prod.appspot.com",
      messagingSenderId: "582079390872",
      appId: "1:582079390872:web:a823e86f40bc549449dced",
      measurementId: "G-8SGSZ28H4H"
    }

};
