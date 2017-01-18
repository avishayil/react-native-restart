#import "RCTRestart.h"
#import <React/RCTBridge.h>

@interface RCTRestart()

@end

@implementation RCTRestart

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE(RNRestart)

- (void)loadBundle
{
    [_bridge reload];
}

RCT_EXPORT_METHOD(Restart) {
    [self loadBundle];
    return;
}

@end
