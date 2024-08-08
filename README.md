# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.


# To Do asap
- Make functional on iphone (forms mainly id say)
- Make functional on android (forms mainly id say)
- Make functional on Web (forms mainly id say)
- Go through profile, then exchanges, then exchange viewing ()
- Think about styling

# To Do features
- add friends option
- delete all exchanges when changing language
- Organizer cant leave
- range picker
- push notifications
- Exchange View Map
- profile pic upload
- push to app store

# Envs
Developement, Preview, test, Production
Expo Go / Live simulator: .env file
Preview Build: eas.json preview config
Preview Build: eas.json preview config

# Building methods
https://expo.dev/accounts/greallra/projects/exchanges-expo/builds (where all builds will appear)
EAS BUILD PREVIEW: These builds don't include developer tools. They are intended to be installed by your team and other stakeholders. will make a downloadable tar.gz file that i can download from expo.dev and drag onto simulator
EAS BUILD PRODUCTION: apple store builds, test flight uses prod build

# Building ios
eas build --platform ios;
eas submit -p ios; (Selected the build)
go to apple dev and accept conditions, testflight will automatically update

# Building android
eas build --platform android;
eas submit -p android
will need to do this: https://github.com/expo/fyi/blob/main/creating-google-service-account.md

# Usefull links
debug on https://www.youtube.com/watch?v=LvCci4Bwmpc&t=310s
app dev site: https://appstoreconnect.apple.com/apps/6587568112/testflight/ios