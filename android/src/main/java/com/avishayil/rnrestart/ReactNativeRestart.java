package com.avishayil.rnrestart;

import android.app.Activity;
import android.os.Handler;
import android.os.Looper;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * Created by Avishay on 7/17/16.
 */
public class ReactNativeRestart extends ReactContextBaseJavaModule {

    private static final String REACT_APPLICATION_CLASS_NAME = "com.facebook.react.ReactApplication";
    private static final String REACT_NATIVE_HOST_CLASS_NAME = "com.facebook.react.ReactNativeHost";


    public ReactNativeRestart(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    private void loadBundleLegacy() {
        final Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            // The currentActivity can be null if it is backgrounded / destroyed, so we simply
            // no-op to prevent any null pointer exceptions.
            return;
        }

        currentActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                currentActivity.recreate();
            }
        });
    }

    private void loadBundle() {
        final Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            return;
        }

        ReactApplication reactApplication = (ReactApplication) currentActivity.getApplication();
        final ReactInstanceManager instanceManager = reactApplication.getReactNativeHost().getReactInstanceManager();
        if (instanceManager == null) {
            return;
        }

        new Handler(Looper.getMainLooper()).post(new Runnable() {
            @Override
            public void run() {
                try {
                    instanceManager.recreateReactContextInBackground();
                } catch (Exception e) {
                    // The recreation method threw an unknown exception
                    // so just simply fallback to restarting the Activity (if it exists)
                    loadBundleLegacy();
                }
            }
        });
    }

    @ReactMethod
    public void Restart() {
        loadBundle();
    }

    @Override
    public String getName() {
        return "RNRestart";
    }

}
