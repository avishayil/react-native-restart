#import <React/RCTBridgeModule.h>
#import <React/RCTReloadCommand.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <RNRestartSpec/RNRestartSpec.h>

@interface Restart : NSObject <NativeRNRestartSpec>
#else
@interface Restart : NSObject <RCTBridgeModule>
#endif

@end
