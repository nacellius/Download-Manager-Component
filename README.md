# Download-Manager-Component
Example implementation of a download manager component

## Requirements
Created with React 18.2.0, and added ESLint for code formatting

## Running the App
Ensure all dependencies are installed with `npm install`, then run the app with `npm start`

## Running Unit Tests
Unit tests can be run with `npm run test`

## Changes Notes
- after an email discussion:
  - changed download management such that only items with the status "available" are able to be selected and downloaded 
  - selecting all items only selects items available for download
  - changed download button to be disabled when no items are selected
