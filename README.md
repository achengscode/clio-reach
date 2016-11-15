# Clio REACH

This is an internal search application based on the work that the folks have done over
at Aloglia, inspired by the story [here](https://stories.algolia.com/how-algolia-uses-electron-to-improve-internal-productivity-8e89efe60b59#.mpzj6h9wd).

At a high level, it works with the same premise, the user activates the application with a global shortcut, and then proceeds to search
various internal stores of information (i.e. Confluence, JIRA etc...).

## Usage
1. If this is your first time running this application, clio-reach will ask you for your login credentials for the
   services you want to use (mainly any Atlassian-related products)
2. After typing in your credentials, you will be logged in, and clio-reach can be summoned via a global shortcut
   (which can be modified)

## Technical Details

`clio-reach` is an application that was developed using Angular2 and Typescript, as well as the Electron framework.
The codebase itself is split into JavaScript, TypeScript, CSS and HTML files.

This application is also designed to run in the background; it shouldn't be present on the user's Taskbar (for Windows)
or the Dock (Mac OS X). It should only be present in the user's Tray (in Windows) or Menubar (Mac OSX / Linux)
