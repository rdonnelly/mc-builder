/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"MCBuilder"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  UIView *loadingView = [[UIView alloc] initWithFrame:rootView.bounds];

  UIImageView* launchBackgroundImageView = [[UIImageView alloc] initWithFrame:loadingView.bounds];
  [launchBackgroundImageView setImage:[UIImage imageNamed:@"Launch-Background"]];
  [launchBackgroundImageView setContentMode:UIViewContentModeScaleAspectFill];
  [loadingView addSubview:launchBackgroundImageView];

  UIImageView* launchImageView = [[UIImageView alloc] initWithFrame:loadingView.bounds];
  [launchImageView setImage:[UIImage imageNamed:@"Launch"]];
  [launchImageView setContentMode:UIViewContentModeCenter];
  [loadingView addSubview:launchImageView];

  UIActivityIndicatorView *spinner = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleWhiteLarge];
  spinner.color = [[UIColor alloc] initWithRed:255.0/255.0 green:255.0/255.0 blue:255.0/255.0 alpha:1.0];
  spinner.center = CGPointMake(loadingView.frame.size.width * 0.5, loadingView.frame.size.height * 0.85);
  [spinner startAnimating];
  [loadingView addSubview:spinner];


  rootView.loadingView = loadingView;
  rootView.loadingViewFadeDelay = 0.5;
  rootView.loadingViewFadeDuration = 0.5;

  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
