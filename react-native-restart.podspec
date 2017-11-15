require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name        = 'react-native-restart'
  s.version     = package['version']
  s.summary     = package['description']
  s.homepage    = 'https://github.com/avishayil/react-native-restart'
  s.license     = package['license']
  s.author      = 'Avishay Bar'
  s.platform    = :ios, "8.0"
  s.source      = { :git => "https://github.com/avishayil/react-native-restart.git", :tag => "#{s.version}" }

  s.source_files  = "ios/RCTRestart/*.{h,m}"

  s.dependency "React"
end
