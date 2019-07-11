require "json"

package = JSON.parse(File.read(File.join(__dir__, "../package.json")))

Pod::Spec.new do |s|
  s.name         = "RCTRestart"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = { :type => package["license"], :file => "../LICENSE" }
  s.author       = package["author"]
  s.platform     = :ios, "8.0"
  s.source       = { :git => package["repository"]["url"], :tag => "v#{package["version"]}" }
  s.source_files = 'RCTRestart/**/*.{h,m}'
  s.requires_arc = true

  s.dependency "React"
end

  
