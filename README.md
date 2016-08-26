# A booking app

This application is a multi-user friendly booking app for individual items. The app utilize **firebase** as a back end server with the ability to book an item with a real time update for other users logged in to the same app.

It can also be used in an offline mode with the use of **service workers**, but then only showing the items visually, not with the capablility to book anything.

The app has **filter** option which allows the user to filter between different categories by either tabbing or clicking images or buttons. When one category is selected the focus automatically goes to the first bookable item in the list.

To book an item, one has to select an image by clicking on it. A **modal window** will show up with an image and a form to fill in. The form and buttons uses **polymer elements** and is validated upon keypress. 

The app uses a **responsive design** with the recommendations of **accesibility** from ARIA including roles, focus and labelling.

The application can be **installed to user's homescreen** and it is setup to be able to use **push notifications** when new items are added.

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular) version 0.15.1.

## Installation

* `git clone` [this repository](https://github.com/lhellborg/bookingSite)
* change into the new directory
* type and run `npm install`
* type and run `bower install`

##Running
Run `grunt serve` for preview on `http://localhost:9000/` of development code in the web browser or `grunt serve dist` for preview on `http://localhost:9000/` of production code.

## Build & development

Run `grunt` or `grunt build` for minimizing and concatenating files into `dist folder.