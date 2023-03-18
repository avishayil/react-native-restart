import { NativeModules } from "react-native";

const { RNRestart } = NativeModules;

type RestartType = {
  /**
   * @deprecated use `restart` instead
   */
  Restart(): void;
  restart(): void;
};

export default RNRestart as RestartType;
