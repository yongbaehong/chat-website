# **`Community Chat App`** (Yong B. Hong - Graduate Project)


I created an app that can give alerts instantaneously and allows users to interact with each other. Some of the best known apps that have real time interaction is a chat application. I wanted to create an application that allowed users to interact with each other, and not just an app where the server stores general data. 

---

- [Major features](###Major-features-of-the-Community-Chat-App)
- [Installation dependencies](##installation-dependencies)
- [How to Use This App](##how-to-use-this-app)
- [Test Suites](##test-suites)
- [Folder Structure](##folder-structure)
- [Authors and Acknowledgments](###authors-and-acknowledgments)

---

## `Major features of the Community Chat App`

### ***Socket***
To have real time responsiveness, I implemented socket on the server side and socket.io-client on the front-end with React. Socket has built-in event listeners that can broadcast to all clients (chatroom) or a specific client (one-on-one). I used socket to send regular text messages, send images as binary data in base64 format for the 'src' attribute, not needing any link for the 'src' attribute on the image tag, displaying them in chatrooms. For one-on-one, I permanently saved images as a file (You can see the files in the 'dist/public/user-photos/:user._id'). Saving the images as file permanently allows me to statically serve an image from the public folder.

When you are not interacting with someone specifically, and another user sends you a message, the navigation will display an alert with the number of unread messages properly incrementing. Once you select a person who has sent you a message, the number in the nav will properly decrement from the total that is left to be seen.

### ***Passport for authentication***
I implemented Passport for authentication of users and express-sessions to save user sessions. Like most applications, signing up and logging in are important features to distinguish between users and storing specific data for each user. Passport allows me to use the built-in authentication method to identify the session requesting anything from the server based on the cookie it set with a specific credential string. I implemented this authentication method as middleware on most of the user routes, because changing anything that has to do with the user should be authenticated before the users action can be allowed. I can simply implement authentication on all routes by adding it as middleware to all routes.

Because express-sessions uses cookies to save a users current session, your browser should allow cookies to be received. Also using two different browsers (Chrome for one user, and Firefox for another user) to test the application would give a person a better experience using and testing the app. While one browser can be used with two tabs open, hard refreshing any of the tabs will use the last session to restore the user in the browser. Using two different browsers will prevent this side affect of express-sessions when hard refreshing a tab for any reason.

### ***Redux for state management***
I implemented Redux for state management because I learned that it would be better for scaling any app further when there is a need to add more features. Redux allows a programmer to add new branches to the redux tree, allowing for more modularized data structures. Redux also uses actions and reducers to handle the data's tree. Changing the whole tree to a branch or even a single leaf.

Using action functions best describes what part of the tree is going to be changed by providing the data and the specific action, and the reducer functions returns the new state received from the action function and updates the view layer appropriately.

The hard part of implementing redux was getting the boiler plate down and connecting any React component to the store by mapping state and dispatch functions. Getting a firm understanding of the concept of actions and reducers was another difficult hurdle but not as hard because of my understanding of functions. When using redux there is a need for thinking about the data structure in advance and learning about immutability. One benefit to redux was keeping state in one place and separate from React. The other option would have been to keep state in React and use the ContextAPI, but that would have required passing down other functions to update state. Redux allows for easier access to updating the data by using dispatch and calling the action function.

---
## `Installation dependencies`

> Make sure you start your **mongoDB** how ever it's done on your computer, so a database can be initalized with pre-seed data when the project is started.

Mount the project folder in your Code Editor. You will see two major folders: `client` and `server`.
```
hong-yong-f53855-thesis/
├── client/
├── server/
└── README.md
```

1.) Open a new terminal and cd into `server`, install server folder dependencies, and run server.
```bash
$ cd server
$ npm i
$ npm run dev
```
2.) Open a new terminal, then cd into `client`, install client folder dependencies, and start client side.
```bash
$ cd client
$ npm i
$ npm start
```

---
## `How to Use This App`

### `Home Page / Landing`
There are a couple of blurbs that describe what the app is for. With some testimonals from users of the site.

### `Signup`
*To create a new user:*
- Enter ***username***, ***passwords***, pick a ***gender***, ***age***, and ***choose a photo*** for your profile picture.
- Click on '***Join Now***' to create a user, and start using the site/app.

### `Login`
- If you have signed up and created a user account, enter **username** and **password**.
- Click '***Login***' to start using the site/app.
>  There are pre-seeded users. Please use the following for testing the app so you can communicate with another user.  

For example:  
1.) username: **Ruth**, password: **ruth**  
or  
2.) username: **David**, password: **david**
<!-- >>(skip to [Site Navigation and Features](##Site-Navigation-&-Features)) -->


>  `(Navigation Features)`  
> Once you are logged in, the site navigation is always placed at the bottom of the app. The navigation will dynamically show different icons depending on what part of the app you are viewing.
> - Dashboard displays: (Friends, Dashboard, Cog)  
> - Community displays: (All, Create, Friends, Dashboard, Cog)
> - Matches displays: (All, Prefs, Friends, Dashboard, Cog)


### `Dashboard`

You will land on the `Dashboard` where it displays choices of ***Community*** or ***Matches***. Click either one to display it.



### `Community`
1.) Selecting *`'Community'`* will allow the user to see a list of all the chatrooms. The Navigation will have `All`,`Create`, `FRIENDS`, `DASH`, and the `COG` icon.
  - **ALL** - will allow the user to see all the chatrooms available.
  - **CREATE** - allows the user to create a chatroom.
  - **FRIENDS** - displays Matches section and shows all people the user has friended.
  - **DASH** - takes user back to the dashboard.
  - **COG** - displays the Profile page, or allows the user to Logout.

2.) At the very top there is a search bar to look for a community (chatroom) based on the name or the city.

3.) Click any chatroom and it will display the chatroom.
  - Start typing in the input field at the bottom and click the 'paper plane' icon to send your message to the chatroom.
  - Click on the camera icon to send an image to the chatroom.
  - None of the messages in the chatroom are permanant. Once you leave and come back to a community, there will be no history of what was posted previously.
  - When the view is on mobile, click on the icon with users and a number to see/un-see the users list. The large view will automatically show the userlist.

---

### `Matches`
1.) Selecting `'Matches'` will show the user a list of active people on the site. The navigation will have `ALL`, `PREFS`, `FRIENDS`, `DASH`, and the `COG` icon.

  - **ALL** - gets all users active on the app.
  - **PREFS** - allows user to filter by certain preferences.
  - **FRIENDS** - displays Matches section and shows all people the user has friended.
  - **DASH** - displays the dashboard.
  - **COG** - displays the Profile page, or allows the user to Logout.

2.) Select a person to chat with directly one-on-one.
  - Start typing in the input field at the bottom and click the 'paper plane' icon to send your message to the other user.
  - Click on the camera icon to send an image to the other user, and click on the image to see a bigger version in a modal.
  - You can also "friend" a person by clicking on the plus icon next to their photo at the top.
  - Close the Direct Message with the user by clicking the "left-chevron", and you will be back to the Matches list.
  - When you get messages or want to talk to your friends, click on the friends icon in the nav and it will show a list of all users you friended, and any user messages you have not read from users who have sent you a message.
  - You can click back to any person you chatted with, and your chat history is permanant.

---

### `Profile`
  - Here the user can change their profile picture by choosing another picture and clicking the button.
  - The user can also delete their account by providing their password twice correctly.

### `Error Page / 404`
- Users will be directed to a custom 404 Page if url does not exist.

### `Footer`

The footer has social links that are related to the site, but are only placeholders as a visual representaion of the sites own social media links.

---

## `Test Suites`
> All test suites are made for the back-end server routes and socket handlers.  
> Before running any test scripts, please first run: ```$ npm run seed```

To run all the test suites type the following in the terminal in the server/ directory
```bash
$ npm run seed
$ npm run test
```

To run individual suites you can type the following in the terminal in the server/ directory.
```bash
$ npm run test-community
$ npm run test-user
$ npm run test-direct-message
$ npm run test-chatroom
```

## `Folder Structure`
###
```
hong-yong-graduate
|
├── client
|   └── public/
|   ├── src/
|   |   ├── components/
|   |   |   ├── ChatRoom/
|   |   |   ├── CreateCommuneModal/
|   |   |   ├── DirectMsg/
|   |   |   ├── Footer/
|   |   |   ├── Nav/
|   |   |   ├── PageTemplate/
|   |   |   ├── Popover/
|   |   |   ├── Preferences/
|   |   |   ├── SearchBar/
|   |   |   ├── Toast/
|   |   |   └── Userlist/
|   |   ├── lib/
|   |   |   └── fonts/
|   |   ├── pages/
|   |   |   ├── Commune/
|   |   |   ├── Error/
|   |   |   ├── Main/
|   |   |   ├── SignupLogin/
|   |   |   └── User/
|   |   ├── util/
|   |   |   ├── moment/
|   |   |   ├── redux-store/
|   |   |   └── socket/
|   |   └── index.js
|   └── package.json
|   └── .babelrc
|   
|
├── server/
|   ├── public/
|   └── src/
|       ├── auth/
|       ├── resources/
|       |   ├── communities/
|       |   ├── direct_msg/
|       |   ├── socket.emit.handlers/
|       |   └── user/
|       ├── util/
|       ├── index.js
|       └── server.js
|
|
└── README.md
```

---
### Authors and Acknowledgments

This was coded by Yong B. Hong at a LastMile classroom at PBSP. Thanks to the LastMile and PBSP staff for all their help and support. I was able to use the resources provided by the LastMile, such as [devdocs](https://devdocs.io/), [stack overflow](https://stackoverflow.com/), Learning React book by Alex Banks & Eve Porcello, and Express In Action by Evan Hahn to gain insight and knowledge of the basics of what I implemented in my Graduate Project and be inspired to create something new with my ideas.