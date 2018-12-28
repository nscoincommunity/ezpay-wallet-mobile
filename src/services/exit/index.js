import { NativeModules, BackHandler, Platform, requireNativeComponent, Linking, LinkingIOS } from 'react-native';
/**
 *
 * Exit the current application.
 * On Android uses the built-in RN BackHandler module
 * On iOS uses a custom NativeModule
 *
 * @param isError (iOS only: if true exit with status code = 1, else exit with status code = 0)
 * @return {void}
 */
export function exitApp(isError = false) {
    if (Platform.OS === 'android') {
        BackHandler.exitApp();
    } else {
        try {
            Linking.openURL('LuckyDrawer://')
            setTimeout(() => {
                NativeModules.RNCloseApp.exitApp(isError);
            }, 200)
        } catch (error) {
            console.log(error)
        }
    }
}