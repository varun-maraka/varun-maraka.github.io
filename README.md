## Comments from Varun
Url of the web page
https://varun-maraka.github.io/
> npx webpack   -- to build the project
The bot in this is built from a different project show beelow
https://github.com/varun-maraka/watsonChatbot.git 
The built bot file goes to /ui/dist/bundle.js

ToDo tasks in this
1. Update icon correctly, currently few icons are not appearing.
2. Open chat by default, currently chat is minimised by default.
3. show all responses in the array and log them in google sheets.
4. Increase chat size, currently it is small, if possible make the UI as shown in embed script.
5. If session id don't  match with the response session id from heroku update it in UI
6. Save conversation id in local storage and reuse after refresh
7. change header and text.

## About UI
UI is coming from https://github.com/varun-maraka/watsonChatbot.git
issue "npm run build" command in above repository then we get "dist" folder with bundle.js and styles.css
.env file in that repository will be automatically updated into bundle.js
## Image

![](http://i.imgur.com/DUiL9yn.png)

# React/Sass/Redux Boilerplate

Boilerplate and guide for a React/Sass/Redux build.

## Getting Started

```
.babelrc file should be present before building the chatbot.
To build all the files into the destination.
> npm build
> npx webpack
```
To get started, first install all the necessary dependencies.
```
> npm install
```

Run an initial webpack build
```
> webpack
```

Start the development server (changes will now update live in browser)
```
> npm run start
```

To view your project, go to: [http://localhost:3000/](http://localhost:3000/)

## Links

- [Donate](https://www.patreon.com/thenewboston)
- [thenewboston.com](https://thenewboston.com/)
- [Facebook](https://www.facebook.com/TheNewBoston-464114846956315/)
- [Twitter](https://twitter.com/bucky_roberts)
- [Google+](https://plus.google.com/+BuckyRoberts)
- [reddit](https://www.reddit.com/r/thenewboston/)
