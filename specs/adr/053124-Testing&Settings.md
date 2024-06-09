# Testing and Settings Page

Decision occured during weekly meeting on May 31, Friday

Decision #1: What should we do about unit tests vs e2e testing
- We would like to include both unit tests and e2e/frontend interaction testing
- Our JS funcitons mainly interact with the webpage; there is not much computation involved
- Unit tests test individual functions, e2e testing tests user interface interactions

Team decided that the majority of our testing will be using Puppeteer as e2e testing. Although, we will
also employ unit tests on the individual functions that we're able to test using Jest.

Decision #2: Do we have time to implement the Settings page we talked about
- We are on track with respect to our timeline, but our timeline did not include extra time for supplementary features
- Our settings page would not consist of much apart from color theme choices and character limit on tasks

Team decided that given the time constraints and the fact that the settings page is an additional, nonvital
feature, we will not implement a settings page.
