package com.avishayil.rnrestart;

import com.facebook.react.ReactInstanceManager;

/**
 * Created by avishay on 11/20/17.
 */

public interface ReactInstanceHolder {

    /**
     * Get the current {@link ReactInstanceManager} instance. May return null.
     */
    ReactInstanceManager getReactInstanceManager();
}