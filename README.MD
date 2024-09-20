## Note:

You must be setup enviorment for react native. If you are not setup then please follow the link below.
[React Native - Getting Started](https://reactnative.dev/docs/environment-setup)

## Step 1: Install denpency and generate android folder

```bash
yarn install
npx react-native eject
```

## To add permission for internet, camera and storage. Add some config in android/app/src/main/AndroidManifest.xml

```
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES"/>
<uses-permission android:name="android.permission.CAMERA"/>
<uses-feature android:name="android.hardware.camera" android:required="false" />
<uses-feature android:name="android.hardware.camera.front" android:required="false" />
```

## To add vector icon for app. In android/app/src/build.gradle add this config

```
apply from: file("../../node_modules/react-native-vector-icons/fonts.gradle")
```

## Set up FCM

Download the google-services.json file and place it inside of your project at the following location: /android/app/google-services.json.

First, add the google-services plugin as a dependency inside of your /android/build.gradle file:

```
buildscript {
  dependencies {
    // ... other dependencies
    // NOTE: if you are on react-native 0.71 or below, you must not update
    //       the google-services plugin past version 4.3.15 as it requires gradle >= 7.3.0
    classpath 'com.google.gms:google-services:4.4.1'
    // Add me --- /\
  }
}
```

Lastly, execute the plugin by adding the following to your /android/app/build.gradle file:

```
apply plugin: 'com.android.application'
apply plugin: 'com.google.gms.google-services' // <- Add this line
```

## To avoid conflict library. In android/app/build.gradle add this config

```
android {
	  ...
	  packagingOptions {
       		pickFirst 'lib/x86/libc++_shared.so'
       		pickFirst 'lib/x86_64/libjsc.so'
       		pickFirst 'lib/arm64-v8a/libjsc.so'
      		pickFirst 'lib/arm64-v8a/libc++_shared.so'
       		pickFirst 'lib/x86_64/libc++_shared.so'
       		pickFirst 'lib/armeabi-v7a/libc++_shared.so'
     	}
```

## Set up react native file system

https://github.com/joltup/rn-fetch-blob/wiki/Manually-Link-Package#index

android/app/build.gradle

```
dependencies {
    ...
+    implementation project(':rn-fetch-blob')
}
```

android/app/src/main/AndroidManifest.xml

```
+   <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
+   <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
+   <uses-permission android:name="android.permission.DOWNLOAD_WITHOUT_NOTIFICATION" />

    <intent-filter>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LAUNCHER" />
+           <action android:name="android.intent.action.DOWNLOAD_COMPLETE"/>
    </intent-filter>
```

IMPORTANT
b/node_modules/rn-fetch-blob/android/src/main/java/com/RNFetchBlob/RNFetchBlobReq.java

```
                @@ -196,7 +196,11 @@ public class RNFetchBlobReq extends BroadcastReceiver implements Runnable {
                                DownloadManager dm = (DownloadManager) appCtx.getSystemService(Context.DOWNLOAD_SERVICE);
                                downloadManagerId = dm.enqueue(req);
                                androidDownloadManagerTaskTable.put(taskId, Long.valueOf(downloadManagerId));
                -                appCtx.registerReceiver(this, new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE));
                +                if (Build.VERSION.SDK_INT >= 34 && appCtx.getApplicationInfo().targetSdkVersion >= 34) {
                +                  appCtx.registerReceiver(this, new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE), Context.RECEIVER_EXPORTED);
                +                }else{
                +                  appCtx.registerReceiver(this, new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE));
                +                }
```

## To set light mode is default for app

```

In android/app/src/main/res/values/styles.xml

Change this line
<style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">
to
<style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar">
```

## Step 2: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# link vector icon
npx react-native-asset

# using npm
npm start

# OR using Yarn
yarn start
```

## Step 3: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```
