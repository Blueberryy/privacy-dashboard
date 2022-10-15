// swift-tools-version:5.5
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "PrivacyDashboardResources",
    platforms: [
        .iOS("14.0"),
        .macOS("10.15")
    ],
    products: [
        .library(
            name: "PrivacyDashboardResources",
            targets: ["PrivacyDashboardResources"]),
    ],
    dependencies: [
    ],
    targets: [
        .target(
            name: "PrivacyDashboardResources",
            dependencies: [
                           .target(name: "PrivacyDashboard-resources-for-ios", condition: .when(platforms: [.iOS])),
                           .target(name: "PrivacyDashboard-resources-for-macos", condition: .when(platforms: [.macOS]))
                          ],
            path: "swift-package/Sources"),
        
        .target(
            name: "PrivacyDashboard-resources-for-ios",
            path: "swift-package/Resources/ios",
            resources: [.copy("assets")]),
    
        .target(
            name: "PrivacyDashboard-resources-for-macos",
            path: "swift-package/Resources/macos",
            resources: [.copy("assets")]),
    
        .testTarget(
            name: "PrivacyDashboardTests",
            dependencies: ["PrivacyDashboardResources"],
            path: "swift-package/Tests"),
    ]
)
