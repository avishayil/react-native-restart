require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-restart"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "15.1", :tvos => "15.1" }
  s.source       = { :git => "https://github.com/avishayil/react-native-restart.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm}"

  # `install_modules_dependencies` (react-native >= 0.71) wires up React-Core, Fabric and
  # TurboModule dependencies and the RCT_NEW_ARCH_ENABLED compiler flags, so the same podspec
  # works on both the legacy and the New Architecture. Fall back to React-Core on older RN.
  if respond_to?(:install_modules_dependencies, true)
    install_modules_dependencies(s)
  else
    s.dependency "React-Core"
  end
end
