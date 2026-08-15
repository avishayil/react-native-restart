// Simulates the native module not being linked (no TurboModule, nothing on
// NativeModules) and verifies we surface a helpful error instead of crashing.
jest.mock("react-native", () => ({
    NativeModules: {},
    TurboModuleRegistry: {get: jest.fn(() => null)},
}));

import RNRestart from "../index";

describe("RNRestart when the native module is unavailable", () => {
    it("throws a helpful linking error from restart()", () => {
        expect(() => RNRestart.restart()).toThrow(/doesn't seem to be linked/);
    });

    it("throws a helpful linking error from Restart()", () => {
        expect(() => RNRestart.Restart()).toThrow(/doesn't seem to be linked/);
    });

    it("throws a helpful linking error from getReason()", () => {
        expect(() => RNRestart.getReason()).toThrow(/doesn't seem to be linked/);
    });
});
