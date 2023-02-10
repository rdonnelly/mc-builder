#!/usr/bin/env bash
# Run from project root!

podInstall() {
  cd ios && bundle exec pod install && cd ..
}

cleanAndroid() {
  rm -rf $PWD/android/.gradle
  rm -rf $PWD/android/build
  cd $PWD/android && ./gradlew clean && cd ..
}

cleanXcode() {
  xcodebuild -workspace $PWD/ios/MCBuilder.xcworkspace \
             -scheme MCBuilder \
             clean
  rm -rf $PWD/ios/build
}

build() {
  npx eas-cli build --platform all
}

submit() {
  npx eas-cli submit --platform all
}

push() {
  build && submit
}

# we must have exactly one task, and maybe some arguments for that task
# checking for emptiness of the command line argument string is a convenient
# way to bail out early if we weren't told what to do
[[ -n $@ ]] || exit 1

$@
