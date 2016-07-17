# React Native Restart

Restart Your React Native Project

[![npm version](https://img.shields.io/npm/v/react-native-restart.svg?style=flat-square)](https://www.npmjs.com/package/react-native-restart)
[![npm downloads](https://img.shields.io/npm/dm/react-native-restart.svg?style=flat-square)](https://www.npmjs.com/package/react-native-restart)

<!-- TOC depthFrom:1 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [React Native Restart](#react-native-restart)
	- [Installation](#installation)
	- [Android Installation](#android-installation)
		- [RN < 0.29](#rn-029)
		- [RN >= 0.29](#rn-029)
	- [iOS Installation](#ios-installation)
		- [Importing The Library](#importing-the-library)
		- [Adding the Code](#adding-the-code)
	- [Usage](#usage)
	- [CREDITS](#credits)
	- [TODO](#todo)

<!-- /TOC -->

## Installation
`npm install react-native-restart --save`

## Android Installation

In `android/settings.gradle`
```gradle
...

include ':react-native-restart'
project(':react-native-restart').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-restart/android')
```

In `android/app/build.gradle`

```gradle
...

dependencies {
    ...

    compile project(':react-native-restart')
}
```

### RN < 0.29

Register module (in `MainActivity.java`)

```java
import com.avishayil.rnrestart.ReactNativeRestartPackage;  // <--- Import

public class MainActivity extends ReactActivity {
  ......

      /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    @Override
    protected List<ReactPackage> getPackages() {
        ...
        return Arrays.<ReactPackage>asList(
                new MainReactPackage(),
                new ReactNativeRestartPackage() // Add this line
        );
    }
  ......

}
```

### RN >= 0.29

Register module (in `MainApplication.java`)

```java
import com.avishayil.rnrestart.ReactNativeRestartPackage;  // <--- Import

public class MainApplication extends Application implements ReactApplication {

	private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
  		......

	      /**
	     * A list of packages used by the app. If the app uses additional views
	     * or modules besides the default ones, add more packages here.
	     */
	    @Override
	    protected List<ReactPackage> getPackages() {
	        ...
	        return Arrays.<ReactPackage>asList(
	                new MainReactPackage(),
	                new ReactNativeRestartPackage() // Add this line
	        );
	    }
	};
	......
	@Override
	public ReactNativeHost getReactNativeHost() {
    	return mReactNativeHost;
	}
};

```

## iOS Installation

### Importing The Library

 * Drag the file `RCTRestart.xcodeproj` from `/node_modules/react-native-restart/ios` into the `Libraries` group in the Project navigator. Ensure that `Copy items if needed` is UNCHECKED!

  ![Add Files To...](http://i.imgur.com/puxHiIg.png)

  ![Library Imported Successfully](http://i.imgur.com/toZUWg5.png)

 * Ensure that `libRCTRestart.a` is linked through `Link Binary With Libraries` on `Build Phases`:

  ![Library Linked](http://i.imgur.com/Sm1birt.png)

 * Ensure that `Header Search Paths` on `Build Settings` has the path `$(SRCROOT)/../node_modules/react-native-restart` set to `recursive`:

 * You're All Set!


## Usage

```javascript
import RNRestart from 'react-native-restart'; // Import package from node modules

// Immediately reload the React Native Bundle
RNRestart.Restart();
```

## CREDITS
Thanks to Microsoft CodePush library. I simply extracted the code from their library's logic to reload the React Native Bundle.

## TODO
 * [ ] Tell me?
