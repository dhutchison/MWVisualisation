# MWVisualisation

MWVisualisation is a companion application for [MoneyWell](https://moneywellapp.com).

This application can open the SQLite database used by MoneyWell and provide reporting functionality. 

This exists for two reasons:
1. As a project for (re-)learning Angular
2. To provide better metrics on my financial health than MoneyWell provides natively. 


Originally this was intended to be an in-browser application, but in order to open files locally I had to change this to use the [Electron](https://electronjs.org) application framework. In theory, this application would work on operating systems other than MacOs, although this has never been tested. 

## Project build
Setting up something based on this:
https://yuriburger.net/2018/06/18/improving-angular-style-and-code-quality/ 

This, or more the sample repository related to this post, came second in the google search results for "ng sonar".

Adding sonar rules:
npm install tslint-sonarts --save-dev 

Notes on the post:

> Tip: hooks are not copied over when you clone a directory so team members have to do that themselves.

This is not correct, hooks are supposed to be configured server side then clients will pull them. Git does not allow pushing of ".git" content as a security precaution.



## Project Structure

This is not expected to be the final structure, but it works for now. I hit some issues with the compilation of the two sides of the application when putting everything in `src`.

### electronSrc
This directory contains all the code for the backend of the electron application. This side interacts with the SQLite database. 

### src
This directory contains all the code for the Angular application front end. 
All communication with the backend is provided through the service file "app/data/data-access.service.ts".

## Running

Run `npm run electron-tsc` to compile and run an instance of the application.

## Packaging for Distribution
TODO: Need to define this

## Running test suites
TODO: Not there at all yet
