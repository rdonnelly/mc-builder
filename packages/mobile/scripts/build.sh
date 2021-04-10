#!/usr/bin/env bash
# Run from project root!

getVersion() {
  cd ios && xcrun agvtool what-marketing-version && cd ..
}

getBuild() {
  cd ios && xcrun agvtool what-version && cd ..
}

setVersion() {
  cd ios && xcrun agvtool new-marketing-version $@ && cd .. && getVersion
}

bumpBuild() {
  cd ios && xcrun agvtool next-version -all && cd ..
}

podInstall() {
  cd ios && pod install && cd ..
}

build() {
  xcodebuild -workspace $PWD/ios/MCBuilder.xcworkspace \
             -scheme MCBuilder \
             -destination generic/platform=iOS \
             build
}

archive() {
  xcodebuild -workspace $PWD/ios/MCBuilder.xcworkspace \
             -scheme MCBuilder \
             -sdk iphoneos \
             -configuration AppStoreDistribution \
             -archivePath $PWD/ios/build/MCBuilder.xcarchive \
             archive
}

exportArchive() {
  xcodebuild -exportArchive \
             -archivePath $PWD/ios/build/MCBuilder.xcarchive \
             -exportOptionsPlist $PWD/ios/exportOptions.plist \
             -exportPath $PWD/ios/build \
             -allowProvisioningUpdates
}

upload() {
  xcrun altool --upload-app \
               -f $PWD/ios/build/MCBuilder.ipa \
               -u $@ \
               -p "@keychain:AC_PASSWORD"
}

ios() {
  bumpBuild && podInstall && build && archive && exportArchive && upload $@ && mapsIos
}

android() {
  # update versionCode and versionName in android/app/build.gradle
  cd android && ./gradlew bundleRelease && cd .. && mapsAndroid
}

mapsAndroid() {
  export $(grep '^BUGSNAG_API_KEY' .env | xargs)
  VERSION="0.4"

  npx bugsnag-sourcemaps upload --api-key=$BUGSNAG_API_KEY \
                                --app-version=$VERSION \
                                --minifiedFile=android/app/build/generated/assets/react/release/index.android.bundle \
                                --source-map=android/app/build/generated/sourcemaps/react/release/index.android.bundle.map \
                                --minified-url=index.android.bundle \
                                --upload-sources \
                                --overwrite
}

mapsIos() {
  export $(grep '^BUGSNAG_API_KEY' .env | xargs)
  VERSION="0.4"

  yarn react-native bundle --platform ios \
                           --dev false \
                           --reset-cache \
                           --entry-file $PWD/index.js \
                           --bundle-output ios-release.bundle \
                           --sourcemap-output ios-release.bundle.map

  curl --http1.1 https://upload.bugsnag.com/react-native-source-map \
       -F apiKey=$BUGSNAG_API_KEY \
       -F appVersion=$VERSION \
       -F dev=false \
       -F platform=ios \
       -F sourceMap=@ios-release.bundle.map \
       -F bundle=@ios-release.bundle \
       -F projectRoot=`pwd`
}


# we must have exactly one task, and maybe some arguments for that task
# checking for emptiness of the command line argument string is a convenient
# way to bail out early if we weren't told what to do
[[ -n $@ ]] || exit 1

$@
