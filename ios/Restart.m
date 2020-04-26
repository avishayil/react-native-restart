#import "Restart.h"

@implementation Restart

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE(RNRestart)

- (void)loadBundle
{
    [_bridge reload];
}

RCT_EXPORT_METHOD(Restart) {
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
