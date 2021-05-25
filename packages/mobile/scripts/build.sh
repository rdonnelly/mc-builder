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

clean() {
  xcodebuild -workspace $PWD/ios/MCBuilder.xcworkspace \
             -scheme MCBuilder \
             clean
  rm -rf $PWD/ios/build
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
  bumpBuild && podInstall && clean && build && archive && exportArchive && upload $@
}

android() {
  # update versionCode and versionName in android/app/build.gradle
  clean && cd android && ./gradlew bundleRelease && cd ..
}

# we must have exactly one task, and maybe some arguments for that task
# checking for emptiness of the command line argument string is a convenient
# way to bail out early if we weren't told what to do
[[ -n $@ ]] || exit 1

$@
