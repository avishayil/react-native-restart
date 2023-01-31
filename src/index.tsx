import { NativeModules } from "react-native";

const { RNRestart } = NativeModules;

type RestartType = {
  Restart(): void;
  restart(): void;
};

export default RNRestart as RestartType;
