import {NativeModules, TurboModuleRegistry} from "react-native";

import type {Spec} from "./NativeRNRestart";

const LINKING_ERROR =
  "The package 'react-native-restart' doesn't seem to be linked. Make sure:\n\n" +
  "- You rebuilt the app after installing the package\n" +
  "- You are not using Expo Go (this library requires a development build)";

// On the New Architecture the module is a TurboModule (resolved via
// TurboModuleRegistry); on the legacy architecture it lives on NativeModules.
// Support both, and fail loudly if the native module was never linked instead of
// throwing an opaque "cannot spread undefined" error.
const nativeModule: Spec | null =
  (TurboModuleRegistry?.get<Spec>?.("RNRestart") as Spec | null | undefined) ??
  (NativeModules.RNRestart as Spec | undefined) ??
  null;

function requireModule(): Spec {
    if (nativeModule == null) {
        throw new Error(LINKING_ERROR);
    }

    return nativeModule;
}

type RestartType = {
  /**
   * @deprecated use `restart` instead
   */
  Restart(reason?: string): void;
  restart(reason?: string): void;
  getReason(): Promise<string | null>;
};

const RNRestart: RestartType = {
    restart(reason?: string): void {
        requireModule().restart(reason ?? null);
    },
    Restart(reason?: string): void {
        requireModule().Restart(reason ?? null);
    },
    getReason(): Promise<string | null> {
        return requireModule().getReason();
    },
};

export default RNRestart;
