jest.mock("react-native", () => ({
    NativeModules: {
        RNRestart: {
            Restart: jest.fn(),
            getReason: jest.fn(),
        },
    },
}));

import {NativeModules} from "react-native";
import RNRestart from "../index";

const nativeRestart = NativeModules.RNRestart as {
  Restart: jest.Mock;
};

describe("RNRestart", () => {
    beforeEach(() => {
        nativeRestart.Restart.mockClear();
    });

    it("restarts without a reason", () => {
        RNRestart.restart();

        expect(nativeRestart.Restart).toHaveBeenCalledWith(null);
    });

    it("passes the restart reason to the native module", () => {
        RNRestart.restart("language-change");

        expect(nativeRestart.Restart).toHaveBeenCalledWith("language-change");
    });
});
