#!/bin/bash
# you should be in main branch to do this and also after a fresh clone
# Fetch all remote branches
git fetch --all
echo 'Fetched all remote branches'

# Loop through each remote branch and create a local branch
for branch in $(git branch -r | grep -v '\->'); do
    git branch --track "${branch#origin/}" "$branch" || true
done

# Pull the latest changes for all branches
git pull --all
echo 'Pulled the latest changes for all branches'