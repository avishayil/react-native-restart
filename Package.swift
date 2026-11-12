// swift-tools-version: 6.0

import PackageDescription

let package = Package(
    name: "RNRestart",
    platforms: [.iOS("15.1")],
    products: [
        .library(name: "RNRestart", targets: ["RNRestartTarget"]),
    ],
    // React Native links the package under ios/build/generated/autolinking/libs/.
    dependencies: [
        .package(name: "ReactNative", path: "../../../../xcframeworks"),
        .package(name: "React-GeneratedCode", path: "../../../ios"),
    ],
    targets: [
        .target(
            name: "RNRestartTarget",
            dependencies: [
                .product(name: "ReactHeaders", package: "ReactNative"),
                .product(name: "ReactNativeHeaders", package: "ReactNative"),
                .product(name: "ReactNativeDependenciesHeaders", package: "ReactNative"),
                .product(name: "ReactAppHeaders", package: "React-GeneratedCode"),
            ],
            path: "ios",
            exclude: ["Restart.xcodeproj", "Restart.xcworkspace"],
            sources: ["Restart.mm"],
            publicHeadersPath: ".",
            cSettings: [.define("RCT_NEW_ARCH_ENABLED", to: "1")],
            cxxSettings: [
                .define("RCT_NEW_ARCH_ENABLED", to: "1"),
                .define("DEBUG", .when(configuration: .debug)),
                .define("NDEBUG", .when(configuration: .release)),
            ],
            linkerSettings: [.linkedFramework("Foundation")]
        ),
    ],
    cxxLanguageStandard: .cxx20
)
