package com.reactnativerestart;

import android.content.Context;
import android.content.SharedPreferences;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.jakewharton.processphoenix.ProcessPhoenix;

public class RestartModule extends ReactContextBaseJavaModule {

    private static final String PREFERENCES_NAME = "react-native-restart";
    private static final String RESTART_REASON_KEY = "restartReason";
    private static String restartReason = null;
    private static boolean restartReasonInitialized = false;

    public RestartModule(ReactApplicationContext reactContext) {
        super(reactContext);
        initializeRestartReason();
    }

    private SharedPreferences getPreferences() {
        return getReactApplicationContext().getSharedPreferences(
            PREFERENCES_NAME,
            Context.MODE_PRIVATE
        );
    }

    private void initializeRestartReason() {
        if (restartReasonInitialized) {
            return;
        }

        SharedPreferences preferences = getPreferences();
        if (preferences.contains(RESTART_REASON_KEY)) {
            restartReason = preferences.getString(RESTART_REASON_KEY, null);
            preferences.edit().remove(RESTART_REASON_KEY).commit();
        }
        restartReasonInitialized = true;
    }

    private void restartApp(String reason) {
        restartReason = reason;
        SharedPreferences.Editor editor = getPreferences().edit();

        if (reason == null) {
            editor.remove(RESTART_REASON_KEY);
        } else {
            editor.putString(RESTART_REASON_KEY, reason);
        }

        // ProcessPhoenix terminates the process immediately, so persist synchronously.
        editor.commit();
        ProcessPhoenix.triggerRebirth(getReactApplicationContext());
    }

    @ReactMethod
    public void Restart(String reason) {
        restartApp(reason);
    }

    @ReactMethod
    public void restart(String reason) {
        restartApp(reason);
    }

    @ReactMethod
    public void getReason(Promise promise) {
        promise.resolve(restartReason);
    }

    @Override
    public String getName() {
        return "RNRestart";
    }
}
