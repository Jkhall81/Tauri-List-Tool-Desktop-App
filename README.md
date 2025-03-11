# Tauri + Nextjs + Typescript

## Setup

When using Nextjs, like in this project, make sure that your tauri.conf.json looks like this:

```jsx
{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "list_tools",
  "version": "0.1.0",
  "identifier": "com.list-tools.app",
  "build": {
    "beforeDevCommand": "npm run dev",
    "devUrl": "http://localhost:3000",
    "beforeBuildCommand": "npm run build",
    "frontendDist": "../src/out"
  },
  "app": {
    "windows": [
      {
        "title": "list_tools",
        "width": 1200,
        "height": 700
      }
    ],
    "security": {
      "csp": null
    }
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": ["icons/icon.ico"]
  }
}
```

## Developing the application

While developing you will need to dev servers up. If you are just working on the front end you just need to cd into the src folder, where the front end is, and run npm run dev or bun run dev.

If you are testing out your backend logic then you need your front end dev server running, and also in another terminal cd into the src-tauri folder and run npm tauri run dev.

## Building the application

Build your front end first. Note, tauri doesn't like the @/ used in nextjs imports. Once your front end is built, cd into the src-tauri folder and run npm run build. This will give you a .exe file and a msi installer, if you are using windows.
