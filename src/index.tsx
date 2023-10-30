import { NativeModules } from "react-native";

const { RNRestart: rnRestart } = NativeModules;

type RestartType = {
  /**
   * @deprecated use `restart` instead
   */
  Restart(reason?: string): void;
  restart(reason?: string): void;
  getReason(): Promise<string>;
};

const Restart = (reason?: string) => {
    if (!reason) {
        rnRestart.Restart(null);
    } else {
        rnRestart.Restart(reason);
    }
};
const RNRestart: RestartType = {
    ...rnRestart,
    restart: Restart,
    Restart,
};

export default RNRestart;
