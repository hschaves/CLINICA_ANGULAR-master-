import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'ClinicaMassagem',
  webDir: 'www',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https'
  }
};

export default config;
