#pragma once

#include <sstream>
#include "JSValue.h"
#include "NativeModules.h"
#include "winrt/Windows.ApplicationModel.Core.h"

using namespace winrt::Microsoft::ReactNative;
using namespace winrt::Windows::ApplicationModel::Core;

namespace winrt::ReactNativeRestart
{

  REACT_MODULE(RNRestart, L"RNRestart")
    struct RNRestart
  {

    REACT_METHOD(Restart)
      void Restart(ReactPromise<void> promise) noexcept
    {
      auto asyncOp = RequestRestartAsync(promise);
      asyncOp.Completed(MakeAsyncActionCompletedHandler(promise));
    }

    static IAsyncAction RequestRestartAsync(ReactPromise<void> promise) {
      auto capturedPromise = promise;
      auto reason = co_await CoreApplication::RequestRestartAsync(L"");
      if (reason == AppRestartFailureReason::NotInForeground ||
        reason == AppRestartFailureReason::Other) {
        capturedPromise.Reject("restart request rejected.");
      }
      capturedPromise.Resolve();
    }

    template <class TPromiseResult>
    winrt::AsyncActionCompletedHandler MakeAsyncActionCompletedHandler(
      winrt::Microsoft::ReactNative::ReactPromise<TPromiseResult> const& promise) {
      return [promise](winrt::IAsyncAction action, winrt::AsyncStatus status) {
        if (status == winrt::AsyncStatus::Error) {
          std::stringstream errorCode;
          errorCode << "0x" << std::hex << action.ErrorCode() << std::endl;

          auto error = winrt::Microsoft::ReactNative::ReactError();
          error.Message = "HRESULT " + errorCode.str() + ": " + std::system_category().message(action.ErrorCode());
          promise.Reject(error);
        }
      };
    }

  };

} // namespace winrt::ReactNativeRestart
