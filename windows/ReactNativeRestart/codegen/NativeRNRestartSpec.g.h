
/*
 * This file is auto-generated from a NativeModule spec file in js.
 *
 * This is a C++ Spec class that should be used with MakeTurboModuleProvider to register native modules
 * in a way that also verifies at compile time that the native module matches the interface required
 * by the TurboModule JS spec.
 */
#pragma once
// clang-format off


#include <NativeModules.h>
#include <tuple>

namespace ReactNativeRestartCodegen {

struct RNRestartSpec : winrt::Microsoft::ReactNative::TurboModuleSpec {
  static constexpr auto methods = std::tuple{
      Method<void(std::optional<std::string>) noexcept>{0, L"Restart"},
      Method<void(std::optional<std::string>) noexcept>{1, L"restart"},
      Method<void(Promise<std::optional<std::string>>) noexcept>{2, L"getReason"},
  };

  template <class TModule>
  static constexpr void ValidateModule() noexcept {
    constexpr auto methodCheckResults = CheckMethods<TModule, RNRestartSpec>();

    REACT_SHOW_METHOD_SPEC_ERRORS(
          0,
          "Restart",
          "    REACT_METHOD(Restart) void Restart(std::optional<std::string> reason) noexcept { /* implementation */ }\n"
          "    REACT_METHOD(Restart) static void Restart(std::optional<std::string> reason) noexcept { /* implementation */ }\n");
    REACT_SHOW_METHOD_SPEC_ERRORS(
          1,
          "restart",
          "    REACT_METHOD(restart) void restart(std::optional<std::string> reason) noexcept { /* implementation */ }\n"
          "    REACT_METHOD(restart) static void restart(std::optional<std::string> reason) noexcept { /* implementation */ }\n");
    REACT_SHOW_METHOD_SPEC_ERRORS(
          2,
          "getReason",
          "    REACT_METHOD(getReason) void getReason(::React::ReactPromise<std::optional<std::string>> &&result) noexcept { /* implementation */ }\n"
          "    REACT_METHOD(getReason) static void getReason(::React::ReactPromise<std::optional<std::string>> &&result) noexcept { /* implementation */ }\n");
  }
};

} // namespace ReactNativeRestartCodegen
