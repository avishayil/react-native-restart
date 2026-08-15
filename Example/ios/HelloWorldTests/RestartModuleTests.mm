#import <XCTest/XCTest.h>

#import "Restart.h"

// Unit tests for the iOS native module. These exercise the reason-storage contract and the
// module name without depending on a live bridge. The actual bundle reload
// (RCTTriggerReloadCommandListeners) is covered by the Maestro end-to-end test.
@interface RestartModuleTests : XCTestCase
@end

@implementation RestartModuleTests

- (void)testModuleNameIsRNRestart
{
    XCTAssertEqualObjects([Restart moduleName], @"RNRestart");
}

- (void)testGetReasonResolvesStoredReason
{
    Restart *module = [Restart new];
    [module restart:@"language-change"];

    XCTestExpectation *expectation = [self expectationWithDescription:@"getReason resolves"];
    [module getReason:^(id result) {
        XCTAssertEqualObjects(result, @"language-change");
        [expectation fulfill];
    }
        reject:^(NSString *code, NSString *message, NSError *error) {
            XCTFail(@"getReason rejected: %@", message);
        }];
    [self waitForExpectationsWithTimeout:2.0 handler:nil];
}

- (void)testDeprecatedRestartAliasStoresReason
{
    Restart *module = [Restart new];
    [module Restart:@"legacy"];

    XCTestExpectation *expectation = [self expectationWithDescription:@"getReason resolves"];
    [module getReason:^(id result) {
        XCTAssertEqualObjects(result, @"legacy");
        [expectation fulfill];
    }
        reject:^(NSString *code, NSString *message, NSError *error) {
            XCTFail(@"getReason rejected: %@", message);
        }];
    [self waitForExpectationsWithTimeout:2.0 handler:nil];
}

@end
