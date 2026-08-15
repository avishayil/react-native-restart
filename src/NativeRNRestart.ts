import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  /**
   * @deprecated use `restart` instead
   */
  Restart(reason: string | null): void;
  restart(reason: string | null): void;
  getReason(): Promise<string | null>;
}

export default TurboModuleRegistry.get<Spec>("RNRestart");
