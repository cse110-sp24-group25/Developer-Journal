# Amount of Puppeteer Files for our Tests

Decision occured during weekly meeting on May 31, Friday

Decision: How many files should the puppeteer tests belong in 
- We are creating tests for the homepage, calendar, and tasklist
- Many of the tests associate with multiple difference facets of the app at once
- The tests should follow the user's path of interaction where the user interacts with many features in a single sitting
- The tests should be able pass even after changes to other facets of the system have been interacted with

Team decided that the all the puppeteer tests should be in a single file. Our first reason is that it will provide a stronger representation of the user flow. 
This is because the user may interact with every feature in a single sitting and so the tests should represent how certain features respond to other feature interactions.
The second reason is that it is easier to integrate multiple difference aspects of the website in a test if there is no problem with a certain file only associating with a certain test.
