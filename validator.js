const REPO_NAME = 'hw3_grid_23'; // Change this repo 
const DUE_DATE = '2023-10-09'; // Change the due date
const DUE_TIME = '23:59'; // Change the due time
const PAT = ''; // Paste your personal access token here
//Create your own PAT from Github > Profile > Settings > Developer Settings > Personal Access Token



// imports 
const fs = require('fs');
const csv = require('csv-parser');
const { Octokit } = require("octokit");
const octokit = new Octokit({ auth: PAT });


let profiles = [];

// puts the github user names into profiles[]
const getUserNames = () => {
    return profiles.filter((profile) => {
        if (!profile.profile_url) {
            console.log(`🔴🔴🔴🔴 Skipping. No repo link given for %c${profile.name}`, `font-weight: bold`);
            return false;
        } else {
            return true;
        }
    }).map((profile) => {
        const url = profile.profile_url;
        return url.substring(url.lastIndexOf('/') + 1);
    });
}

const checkRepoExistence = async (owner) => {
    try {
        const response = await octokit.rest.repos.get({
          owner: owner,
          repo: REPO_NAME
        }); 
        // If the repository exists, the status will be 200
        const pushedAt = response.data.pushed_at;
        if (!pushedAt) {
            console.log(`🔴 ${owner}: No commits yet!`);
            return;
        }
        const pushedDate = new Date(response.data.pushed_at);
        if (pushedDate < dueDate) {
            console.log(`🟢 ${owner}: Last commit at ${pushedDate}`);
        } else {
            console.log(`🟡 ${owner}: Commit date is past ${pushedDate}`);
        }
        return;
      } catch (error) {
        // If the repository doesn't exist or there's an error, catch the error
        if (error.status === 404) {
            console.log(`🔴 ${owner}: 404`);
          return false; // Repository doesn't exist
        } else {
            console.log(`🔴 ${owner}: ${error.status}`);
        }
      }
}

const validateProfiles = () => {
    console.log('Validating profiles...');
    const users = getUserNames();
    console.log(users);
    users.forEach((user) => checkRepoExistence(user));
    
}


// Parse due date and time
const dateParts = DUE_DATE.split('-');
const year = parseInt(dateParts[0], 10);
const month = parseInt(dateParts[1], 10) - 1; // Month is 0-based (0 = January, 1 = February, etc.)
const day = parseInt(dateParts[2], 10);
const dueDate = new Date(year, month, day);
const timeParts = DUE_TIME.split(':');
const hour = parseInt(timeParts[0], 10);
const minute = parseInt(timeParts[1], 10);
dueDate.setHours(hour);
dueDate.setMinutes(minute);

// Reads github_profiles.csv and pushes them into the profiles array
console.log(`Repository: ${REPO_NAME}`);
console.log(`Due Date: ${dueDate}`);
console.log('Reading CSV...');
fs.createReadStream('github_profiles.csv')
  .pipe(csv())
  .on('data', (data) => profiles.push(data))
  .on('end', () => {
    validateProfiles();
});