/* eslint max-len: 0 */

import "react-native";
import RNRestart from "react-native-restart";

describe("test RNRestart API functions", () => {
    it("calls the restart function", () => {
        RNRestart.restart();
    });
});
