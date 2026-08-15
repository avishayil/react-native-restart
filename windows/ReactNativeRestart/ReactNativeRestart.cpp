#include "pch.h"

#include "ReactNativeRestart.h"

namespace winrt::ReactNativeRestart
{

// See https://microsoft.github.io/react-native-windows/docs/native-platform for help writing native modules

// The restart reason is stored statically so it survives React instance
// reloads (native modules are re-created on reload). This mirrors the
// static storage used by the Android implementation.
static std::optional<std::string> s_restartReason;

void RNRestart::Initialize(React::ReactContext const &reactContext) noexcept {
  m_context = reactContext;
}

void RNRestart::loadBundle() noexcept {
  auto host = Microsoft::ReactNative::ReactNativeHost::FromContext(m_context.Handle());
  if (host) {
    host.ReloadInstance();
  }
}

void RNRestart::Restart(std::optional<std::string> reason) noexcept {
  s_restartReason = std::move(reason);
  loadBundle();
}

void RNRestart::restart(std::optional<std::string> reason) noexcept {
  s_restartReason = std::move(reason);
  loadBundle();
}

void RNRestart::getReason(React::ReactPromise<std::optional<std::string>> &&result) noexcept {
  result.Resolve(s_restartReason);
}

} // namespace winrt::ReactNativeRestart