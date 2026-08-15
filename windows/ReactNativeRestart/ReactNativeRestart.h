#pragma once

#include "pch.h"
#include "resource.h"

#if __has_include("codegen/NativeRNRestartDataTypes.g.h")
  #include "codegen/NativeRNRestartDataTypes.g.h"
#endif
#include "codegen/NativeRNRestartSpec.g.h"

#include "NativeModules.h"

namespace winrt::ReactNativeRestart
{

// See https://microsoft.github.io/react-native-windows/docs/native-platform for help writing native modules

REACT_MODULE(RNRestart)
struct RNRestart
{
  using ModuleSpec = ReactNativeRestartCodegen::RNRestartSpec;

  REACT_INIT(Initialize)
  void Initialize(React::ReactContext const &reactContext) noexcept;

  REACT_METHOD(Restart)
  void Restart(std::optional<std::string> reason) noexcept;

  REACT_METHOD(restart)
  void restart(std::optional<std::string> reason) noexcept;

  REACT_METHOD(getReason)
  void getReason(React::ReactPromise<std::optional<std::string>> &&result) noexcept;

private:
  void loadBundle() noexcept;

  React::ReactContext m_context;
};

} // namespace winrt::ReactNativeRestart