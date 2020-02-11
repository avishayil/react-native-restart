require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = package['name']
  s.version      = package['version']
  s.summary      = package['description']
  s.license      = { :type => package['license'], :file => 'LICENSE' }
  
  s.authors      = package['author']
  s.homepage     = package['homepage']
  s.platform     = :ios, "8.0"
  
  s.source       = { :git => package['repository']['url'], :tag => "v#{package['version']}" }
  s.source_files = 'ios/**/*.{h,m}'
  
  s.requires_arc = true

  s.dependency 'React'
end  
