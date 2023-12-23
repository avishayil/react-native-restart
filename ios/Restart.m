#import "Restart.h"

@implementation Restart

RCT_EXPORT_MODULE(RNRestart)
NSString  *restartReason = nil;

- (void)loadBundle
{
    RCTTriggerReloadCommandListeners(@"react-native-restart: Restart");
}

RCT_EXPORT_METHOD(Restart: (NSString *)reason) {
    restartReason = reason;
    if ([NSThread isMainThread]) {
        [self loadBundle];
    } else {
        dispatch_sync(dispatch_get_main_queue(), ^{
            [self loadBundle];
        });
    }
    return;
}

RCT_EXPORT_METHOD(restart: (NSString *)reason) {
    restartReason = reason;
    if ([NSThread isMainThread]) {
        [self loadBundle];
    } else {
        dispatch_sync(dispatch_get_main_queue(), ^{
            [self loadBundle];
        });
    }
    return;
}

@end
