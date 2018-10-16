package com.nextywallet;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.oblador.vectoricons.VectorIconsPackage;
import com.tradle.react.UdpSocketsModule;
import com.peel.react.TcpSocketsModule;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.bitgo.randombytes.RandomBytesPackage;
import com.peel.react.rnos.RNOSModule;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.rnfs.RNFSPackage;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;
import org.reactnative.camera.RNCameraPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.horcrux.svg.SvgPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.tradle.react.UdpSocketsModule;
import com.peel.react.TcpSocketsModule;
import com.bitgo.randombytes.RandomBytesPackage;
import com.peel.react.rnos.RNOSModule;
import com.rnfs.RNFSPackage;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;
import org.reactnative.camera.RNCameraPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
              new MainReactPackage(),
              new RNI18nPackage(),
              new SplashScreenReactPackage(),
              new SvgPackage(),
              new VectorIconsPackage(),
              new UdpSocketsModule(),
              new TcpSocketsModule(),
              new RandomBytesPackage(),
              new RNOSModule(),
              new RNFSPackage(),
              new ReactNativeDocumentPicker(),
              new RNCameraPackage());
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
