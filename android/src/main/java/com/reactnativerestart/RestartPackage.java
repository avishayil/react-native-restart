package com.reactnativerestart;

import androidx.annotation.Nullable;
import com.facebook.fbreact.specs.NativeRNRestartSpec;
import com.facebook.react.BaseReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;

import java.util.HashMap;
import java.util.Map;

public class RestartPackage extends BaseReactPackage {

    @Nullable
    @Override
    public NativeModule getModule(String name, ReactApplicationContext reactContext) {
        if (name.equals(NativeRNRestartSpec.NAME)) {
            return new RestartModule(reactContext);
        }
        return null;
    }

    @Override
    public ReactModuleInfoProvider getReactModuleInfoProvider() {
        return () -> {
            Map<String, ReactModuleInfo> moduleInfos = new HashMap<>();
            moduleInfos.put(
                NativeRNRestartSpec.NAME,
                new ReactModuleInfo(
                    NativeRNRestartSpec.NAME, // name
                    NativeRNRestartSpec.NAME, // className
                    false, // canOverrideExistingModule
                    false, // needsEagerInit
                    false, // isCxxModule
                    true   // isTurboModule
                )
            );
            return moduleInfos;
        };
    }
}
