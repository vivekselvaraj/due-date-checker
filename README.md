# due-date-checker
Checks if latest commit or a repo is past the due date

# How to use this tool
- Clone this repo or download the code as zip
- Run `npm install` in the root folder, to download all the dependecies
- Edit `validator.js` to configure `Repository Name`, `Due Date`, and your `Personal Access Token`
- Edit `github_profiles.csv` and add the names and GitHub profile link of the students. Do not include the trailing slash.
- Run `node validator.js` to get the status of their commits
