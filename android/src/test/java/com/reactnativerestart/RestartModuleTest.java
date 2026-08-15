package com.reactnativerestart;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

import android.content.Context;
import android.content.SharedPreferences;
import androidx.test.core.app.ApplicationProvider;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.jakewharton.processphoenix.ProcessPhoenix;
import java.lang.reflect.Field;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockedStatic;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;

@RunWith(RobolectricTestRunner.class)
@Config(sdk = 34)
public class RestartModuleTest {

    private static final String PREFS = "react-native-restart";
    private static final String KEY = "restartReason";

    private Context appContext;
    private ReactApplicationContext reactContext;

    @Before
    public void setUp() throws Exception {
        appContext = ApplicationProvider.getApplicationContext();
        appContext.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().clear().commit();
        resetStatics();

        reactContext = mock(ReactApplicationContext.class);
        when(reactContext.getSharedPreferences(anyString(), anyInt()))
                .thenAnswer(inv -> appContext.getSharedPreferences(inv.getArgument(0), inv.getArgument(1)));
    }

    // The reason is stored in static fields (so it survives the process restart); reset them
    // between tests to keep cases independent.
    private void resetStatics() throws Exception {
        Field reason = RestartModule.class.getDeclaredField("restartReason");
        reason.setAccessible(true);
        reason.set(null, null);
        Field initialized = RestartModule.class.getDeclaredField("restartReasonInitialized");
        initialized.setAccessible(true);
        initialized.set(null, false);
    }

    private Promise capturingPromise(Object[] out) {
        Promise promise = mock(Promise.class);
        doAnswer(inv -> {
            out[0] = inv.getArgument(0);
            return null;
        }).when(promise).resolve(any());
        return promise;
    }

    private SharedPreferences prefs() {
        return appContext.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    @Test
    public void getReasonResolvesNullByDefault() {
        RestartModule module = new RestartModule(reactContext);
        Object[] out = new Object[1];
        module.getReason(capturingPromise(out));
        assertNull(out[0]);
    }

    @Test
    public void moduleNameIsRNRestart() {
        RestartModule module = new RestartModule(reactContext);
        assertEquals("RNRestart", module.getName());
    }

    @Test
    public void restartPersistsReasonAndTriggersRebirth() {
        try (MockedStatic<ProcessPhoenix> phoenix = mockStatic(ProcessPhoenix.class)) {
            RestartModule module = new RestartModule(reactContext);
            module.restart("language-change");

            assertEquals("language-change", prefs().getString(KEY, null));
            phoenix.verify(() -> ProcessPhoenix.triggerRebirth(any()), times(1));

            Object[] out = new Object[1];
            module.getReason(capturingPromise(out));
            assertEquals("language-change", out[0]);
        }
    }

    @Test
    public void restartWithNullClearsPersistedReason() {
        try (MockedStatic<ProcessPhoenix> phoenix = mockStatic(ProcessPhoenix.class)) {
            prefs().edit().putString(KEY, "old").commit();
            RestartModule module = new RestartModule(reactContext);
            module.restart(null);
            assertFalse(prefs().contains(KEY));
        }
    }

    @Test
    public void deprecatedRestartAliasBehavesLikeRestart() {
        try (MockedStatic<ProcessPhoenix> phoenix = mockStatic(ProcessPhoenix.class)) {
            RestartModule module = new RestartModule(reactContext);
            module.Restart("legacy");
            phoenix.verify(() -> ProcessPhoenix.triggerRebirth(any()), times(1));
            assertEquals("legacy", prefs().getString(KEY, null));
        }
    }

    @Test
    public void initializeReadsAndClearsPersistedReasonOnConstruction() {
        // Simulate a reason persisted by the process that requested the restart.
        prefs().edit().putString(KEY, "boot").commit();

        RestartModule module = new RestartModule(reactContext);

        // The key is consumed (read once) on construction...
        assertFalse(prefs().contains(KEY));
        // ...and exposed to JS via getReason().
        Object[] out = new Object[1];
        module.getReason(capturingPromise(out));
        assertEquals("boot", out[0]);
    }
}
