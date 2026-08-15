#import <XCTest/XCTest.h>

#import "Restart.h"

// Expose the private reload hook so the test subclass can override it. This keeps the
// reason-storage tests from triggering a real bundle reload of the host app.
@interface Restart (Testing)
- (void)loadBundle;
@end

// A Restart subclass that records the reload attempt instead of calling
// RCTTriggerReloadCommandListeners, which would reload the live host-app bundle mid-test
// and crash the test runner. The real reload is covered by the Maestro end-to-end test.
@interface TestableRestart : Restart
@property (nonatomic, assign) BOOL didLoadBundle;
@end

@implementation TestableRestart
- (void)loadBundle
{
    self.didLoadBundle = YES;
}
@end

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
    TestableRestart *module = [TestableRestart new];
    [module restart:@"language-change"];
    XCTAssertTrue(module.didLoadBundle, @"restart should attempt a bundle reload");

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
    TestableRestart *module = [TestableRestart new];
    [module Restart:@"legacy"];
    XCTAssertTrue(module.didLoadBundle, @"Restart alias should attempt a bundle reload");

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
