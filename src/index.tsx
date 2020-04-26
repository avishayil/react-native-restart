import { NativeModules } from 'react-native';

type RestartType = {
  Restart(): void;
};

const { RNRestart } = NativeModules;

export default RNRestart as RestartType;
