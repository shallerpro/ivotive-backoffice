import packageInfo from "../../package.json";

export const environment = {
  appVersion: packageInfo.version,
  production: true,
    firebaseConfig: {
      apiKey: "AIzaSyAkxoq1L13F_LZ3SQ8Yzgxmq4MejdxUG7U",
      locationId: 'europe-west1',
      authDomain: "lyftr-prod.firebaseapp.com",
      projectId: "lyftr-prod",
      storageBucket: "lyftr-prod.appspot.com",
      messagingSenderId: "527018790151",
      appId: "1:527018790151:web:71d367f12bf9c0ed61c9a2",
      measurementId: "G-4HFEMYRJW7"
    }

};
