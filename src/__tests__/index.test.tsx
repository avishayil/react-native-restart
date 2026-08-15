jest.mock("react-native", () => {
    const nativeModule = {
        Restart: jest.fn(),
        restart: jest.fn(),
        getReason: jest.fn(),
    };

    return {
        NativeModules: {RNRestart: nativeModule},
        TurboModuleRegistry: {get: jest.fn(() => nativeModule)},
    };
});

import {NativeModules} from "react-native";

import RNRestart from "../index";

const native = NativeModules.RNRestart as {
  Restart: jest.Mock;
  restart: jest.Mock;
  getReason: jest.Mock;
};

describe("RNRestart", () => {
    beforeEach(() => {
        native.Restart.mockClear();
        native.restart.mockClear();
        native.getReason.mockClear();
    });

    it("restarts without a reason and passes null to the native module", () => {
        RNRestart.restart();

        expect(native.restart).toHaveBeenCalledWith(null);
    });

    it("passes the restart reason to the native module", () => {
        RNRestart.restart("language-change");

        expect(native.restart).toHaveBeenCalledWith("language-change");
    });

    it("routes restart() to the non-deprecated native restart, not Restart", () => {
        RNRestart.restart("x");

        expect(native.restart).toHaveBeenCalledTimes(1);
        expect(native.Restart).not.toHaveBeenCalled();
    });

    it("supports the deprecated Restart alias", () => {
        RNRestart.Restart("legacy");

        expect(native.Restart).toHaveBeenCalledWith("legacy");
    });

    it("resolves the persisted reason via getReason", async () => {
        native.getReason.mockResolvedValueOnce("boot-reason");

        await expect(RNRestart.getReason()).resolves.toBe("boot-reason");
        expect(native.getReason).toHaveBeenCalledTimes(1);
    });
});
