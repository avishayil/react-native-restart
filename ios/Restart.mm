#import "Restart.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <RNRestartSpec/RNRestartSpec.h>
#endif

@implementation Restart

RCT_EXPORT_MODULE(RNRestart)

NSString *restartReason = nil;

- (void)loadBundle
{
    RCTTriggerReloadCommandListeners(@"react-native-restart: Restart");
}

- (void)restartWithReason:(NSString *)reason
{
    restartReason = reason;
    if ([NSThread isMainThread]) {
        [self loadBundle];
    } else {
        dispatch_sync(dispatch_get_main_queue(), ^{
            [self loadBundle];
        });
    }
}

RCT_EXPORT_METHOD(Restart:(NSString *)reason)
{
    [self restartWithReason:reason];
}

RCT_EXPORT_METHOD(restart:(NSString *)reason)
{
    [self restartWithReason:reason];
}

RCT_EXPORT_METHOD(getReason:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    resolve(restartReason);
}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeRNRestartSpecJSI>(params);
}
#endif

@end
