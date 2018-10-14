using ReactNative;
using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using System.Threading;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;
using Windows.UI.Xaml;

namespace React.Native.Restart.ReactNativeRestart
{
    /// <summary>
    /// A module that allows JS to share data.
    /// </summary>
    class ReactNativeRestartModule : NativeModuleBase
    {
        /// <summary>
        /// Instantiates the <see cref="ReactNativeRestartModule"/>.
        /// </summary>
        internal ReactNativeRestartModule()
        {

        }

        /// <summary>
        /// The name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "RNRestart";
            }
        }

        private void LoadBundle() 
        {
            try
            {
                this.ReloadReactBundle();
            }
            catch (Exception e)
            {
                this.ReloadWindowsApp();
            }
        }

        private void ReloadReactBundle() //Can Throw Exception 
        {
            var reactApp = (ReactApplication) Application.Current;
            var instanceManager = reactApp.Host.ReactInstanceManager;
            var tokenSource = new CancellationTokenSource();
            CoreApplication.MainView.Dispatcher.RunAsync(CoreDispatcherPriority.Normal, () => {
                instanceManager.RecreateReactContextAsync(tokenSource.Token);
            });
        }

        private async void ReloadWindowsApp()
        {
            await CoreApplication.RequestRestartAsync("RNRestart");
        }

        [ReactMethod]
        public void restart() 
        {
            LoadBundle();
        }
    }
}
