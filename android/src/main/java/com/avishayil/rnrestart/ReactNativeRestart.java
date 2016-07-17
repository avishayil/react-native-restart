package com.avishayil.rnrestart;

import android.app.Activity;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.lang.reflect.Field;
import java.lang.reflect.Method;

/**
 * Created by Avishay on 7/17/16.
 */
public class ReactNativeRestart extends ReactContextBaseJavaModule {

    private static final String REACT_APPLICATION_CLASS_NAME = "com.facebook.react.ReactApplication";
    private static final String REACT_NATIVE_HOST_CLASS_NAME = "com.facebook.react.ReactNativeHost";


    public ReactNativeRestart(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    private void loadBundleLegacy(final Activity currentActivity) {
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
            // The currentActivity can be null if it is backgrounded / destroyed, so we simply
            // no-op to prevent any null pointer exceptions.
            return;
        } else if (!ReactActivity.class.isInstance(currentActivity)) {
            // Our preferred reload logic relies on the user's Activity inheriting
            // from the core ReactActivity class, so if it doesn't, we fallback
            // early to our legacy behavior.
            loadBundleLegacy(currentActivity);
        } else {
            try {
                ReactActivity reactActivity = (ReactActivity)currentActivity;
                ReactInstanceManager instanceManager;

                // #1) Get the ReactInstanceManager instance, which is what includes the
                //     logic to reload the current React context.
                try {
                    // In RN 0.29, the "mReactInstanceManager" field yields a null value, so we try
                    // to get the instance manager via the ReactNativeHost, which only exists in 0.29.
                    Method getApplicationMethod = ReactActivity.class.getMethod("getApplication");
                    Object reactApplication = getApplicationMethod.invoke(reactActivity);
                    Class<?> reactApplicationClass = tryGetClass(REACT_APPLICATION_CLASS_NAME);
                    Method getReactNativeHostMethod = reactApplicationClass.getMethod("getReactNativeHost");
                    Object reactNativeHost = getReactNativeHostMethod.invoke(reactApplication);
                    Class<?> reactNativeHostClass = tryGetClass(REACT_NATIVE_HOST_CLASS_NAME);
                    Method getReactInstanceManagerMethod = reactNativeHostClass.getMethod("getReactInstanceManager");
                    instanceManager = (ReactInstanceManager)getReactInstanceManagerMethod.invoke(reactNativeHost);
                } catch (Exception e) {
                    // The React Native version might be older than 0.29, so we try to get the
                    // instance manager via the "mReactInstanceManager" field.
                    Field instanceManagerField = ReactActivity.class.getDeclaredField("mReactInstanceManager");
                    instanceManagerField.setAccessible(true);
                    instanceManager = (ReactInstanceManager)instanceManagerField.get(reactActivity);
                }

                // #3) Get the context creation method and fire it on the UI thread (which RN enforces)
                final Method recreateMethod = instanceManager.getClass().getMethod("recreateReactContextInBackground");

                final ReactInstanceManager finalizedInstanceManager = instanceManager;
                reactActivity.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            recreateMethod.invoke(finalizedInstanceManager);
                        }
                        catch (Exception e) {
                            // The recreation method threw an unknown exception
                            // so just simply fallback to restarting the Activity
                            loadBundleLegacy(currentActivity);
                        }
                    }
                });
            } catch (Exception e) {
                // Our reflection logic failed somewhere
                // so fall back to restarting the Activity
                loadBundleLegacy(currentActivity);
            }
        }
    }

    private Class tryGetClass(String className) {
        try {
            return Class.forName(className);
        } catch (ClassNotFoundException e) {
            return null;
        }
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
