import {NativeModules} from "react-native";

const { RNRestart: rnRestart } = NativeModules;

type RestartType = {
  /**
   * @deprecated use `restart` instead
   */
  Restart(reason?: string): void;
  restart(reason?: string): void;
  getReason(): Promise<string | null>;
};

const Restart = (reason?: string) => {
    rnRestart.Restart(reason ?? null);
};

const RNRestart: RestartType = {
    ...rnRestart,
    restart: Restart,
    Restart,
};

export default RNRestart;
