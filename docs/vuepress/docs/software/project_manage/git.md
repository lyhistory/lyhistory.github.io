---
sidebar: auto
sidebarDepth: 3
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《GIT》

## 1.Basic
### 1.1 Concepts
![](/docs/docs_image/software/project_manage/git/git01.png)
Tracking branch
Non-tracking branch
Understanding Tracking Branches in Git  https://lornajane.net/posts/2014/understanding-tracking-branches-in-git

### 1.2 Config
Basic
```
	git config --global user.name "***"
	git config --global user.email "***"
```
gitignore
```
	echo "**/.idea/*" >> .gitignore
	git status
	git add .gitignore
	git commit -m "ignore idea subfolders"
	
	Add to ignore after Commit and pushed 
	https://stackoverflow.com/questions/7927230/remove-directory-from-remote-repository-after-adding-them-to-gitignore
	git rm -r --cached desktop/res/
git commit -m "remove ignored directory /desktop/res"
git status
git add .
git commit -m "ignore /desktop/res"
git status
git push origin feature/desktop-magiclink


add and commit gitignore file
git rm -r --cached .
git add .
git commit -m ".gitignore fix"

```
display Chinese character
git config core.quotepath false

Adding a new SSH key to your GitHub account
https://help.github.com/en/github/authenticating-to-github/adding-a-new-ssh-key-to-your-github-account
```
for windows user .ssh is under c:/users/<username>/

ls -al ~/.ssh
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# start the ssh-agent in the background
$ eval $(ssh-agent -s)
ssh-add ~/.ssh/id_rsa

clip < ~/.ssh/id_rsa.pub
```

### 1.3 About repo
git remote -v

Change repo url:
git remote set-url origin git://test.com/repo.git

### 1.4 About branch
```
git branch -vv
git branch (-r/-a)
git checkout (-b) master

//make it tracking remote branch
git branch -u origin/branchname

//delete local
git branch -d <branch_name>
//delete remote branch
git push --delete <remote_name> <branch_name>

Pushing to a remote https://help.github.com/articles/pushing-to-a-remote/


tag
git tag
git checkout tags/v1.0.8
```

### 1.5 Clean up & reset 
http://sethrobertson.github.io/GitFixUm/fixup.html

**Git reflog**
	List commit history

**Git reset**
git reset --hard <sha-id>
git reset HEAD^ (unstage)
//un-commit last un-pushed git commit without losing the changes
git reset HEAD~1 --soft https://stackoverflow.com/questions/19859486/how-to-un-commit-last-un-pushed-git-commit-without-losing-the-changes/19859644

**Git revert**
a.to revert changes made to your working copy : git checkout .
b.to revert changes made to the index which also called as unstage (i.e., that you have added): git reset  (e.g. git reset HEAD index.html)
git reset did a great job of unstaging octodog.txt, but you'll notice that he's still there. He's just not staged anymore. It would be great if we could go back to how things were before octodog came around and ruined the party.
c.to revert a change that you have committed: git revert

git clean -f (remove untracked file: new files,generated files)
git clean -f (to remove the untracked changes) and -fd (to also remove untracked directories) http://stackoverflow.com/questions/61212/remove-local-untracked-files-from-my-current-git-branch

### 1.6 Status check
tig
git log
https://www.atlassian.com/git/tutorials/git-log

git log --graph --oneline --decorate --all
//recent commit log
git log -n 1 --pretty=format:%H -- clear-risk/src/main/java/com/quantdo/clear/risk/margin/impl/ApexSpanMarginJNICalculator.java
First git log -p | grep "Disruptor"
Then git log –S ‘search text’

git show commit-hash
git show REVISION:/path/to/file
git show 15928170ffecd7022301a***:****.java
https://stackoverflow.com/questions/1057564/pretty-git-branch-graphs

git diff master..standardised-meetup-contract-xml

### 1.7 cherry pick
git log
git show 60b3ccd807343ccce957aceecb36b1da81d34a45
git stash --include-untracked
git stash apply/pop
https://stackoverflow.com/questions/15286075/difference-between-git-stash-pop-and-git-stash-apply

git checkout master
git reset --hard origin/master
git cherry-pick 60b3ccd807343ccce957aceecb36b1da81d34a45
https://www.atlassian.com/git/tutorials/cherry-pick

## 2.Advance
### 2.1 About submodule/subtree/worktree
1) submodule
git submodule update --init --recursive
https://kalyanchakravarthy.net/blog/git-discard-submodule-changes/
git submodule update --recursive
https://www.youtube.com/watch?v=UQvXst5I41I


2) subtree
https://www.youtube.com/watch?v=t3Qhon7burE

3) worktree

### 2.2 about fork:
1) normal fork
https://www.youtube.com/watch?v=_NrSWLQsDL4

Sync with upstream
https://help.github.com/articles/syncing-a-fork/
https://help.github.com/articles/configuring-a-remote-for-a-fork/

git remote add upstream https://github.com/AlphaWallet/alpha-wallet-android.git
git fetch upstream
git checkout master
git merge upstream/master
git push
git checkout feature/desktop-magiclink
git merge master
git push

2) fork from other source
https://gist.github.com/DavideMontersino/810ebaa170a2aa2d2cad
https://stackoverflow.com/questions/6286571/are-git-forks-actually-git-clones
Example:
```
git clone https://github.com/lyhistory/xmlsectool.git
cd xmlsectool/
git remote rename origin upstream
git remote add origin git://git.shibboleth.net/xmlsectool
git remote -v
git pull origin master
git push upstream master

git add .
git status
git commit -m "add support for rfc4050"
git push upstream master
```
![](/docs/docs_image/software/project_manage/git/git02.png)

3) auto sync from upstream/origin
https://stackoverflow.com/questions/23793062/can-forks-be-synced-automatically-in-github

### 2.3 about workflow - wrap up all the previous knowledge
#### 2.3.1 Available tools
1) git cherry-pick
2) git stash
git stash list
git stash apply
shelve changes / git stack https://www.youtube.com/watch?v=Zb8k8q8n8Ao

3) git merge and git rebase
https://www.atlassian.com/git/tutorials/merging-vs-rebasing

Git merge
```
	Git pull origin master
	git merge --abort
	git checkout --theirs -- Lib/test.dll
```
git rebase
```
branch master & develop
commit changes in develop branch ( don't push!)
switch to master and git pull
switch to develop git rebase master
```
if got conflict follow instruction, manually resolve it and git add to mark it as resolved and then git rebase --continue
now is good to do merge

Basic Branching and Merging https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging
GIT: FETCH AND MERGE, DON’T PULL http://longair.net/blog/2009/04/16/git-fetch-and-merge/

4)  worktree
https://www.youtube.com/watch?v=h1bifLAnrXA

   	 tig
   	 git worktree add ../TestWT
   	 tig
   	 git worktree list
   	 git worktree remove --force TestWT

5) fork

6) git flow

### 2.4 Other low frequency stuff
create pull request
How to Git PR From The Command Line https://hackernoon.com/how-to-git-pr-from-the-command-line-a5b204a57ab1

## 3.Best Practice
The seven rules of a great git commit message:
https://chris.beams.io/posts/git-commit/

## 4.Troubleshooting 

?#1.If you are running git under a file system that is not case sensitive (Windows or OS X) this will occur if there are two branches with the same name but different capitalisation, e.g. user_model_changes and User_model_changes as both of the remote branches will match the same tracking ref. Delete the wrong remote branch (you shouldn't have branches that differ only by case) and then git remote prune origin and everything should work

?#2.The remote end hung up unexpectedly while git cloning
With this kind of error, I usually start by raising the postBuffer size by:
git config --global http.postBuffer 524288000
(some comments below report having to double the value):
git config --global http.postBuffer 1048576000
http://stackoverflow.com/questions/6842687/the-remote-end-hung-up-unexpectedly-while-git-cloning

?#3.error: Your local changes to the following files would be overwritten by merge: ****** Please, commit your changes or stash them before you can merge.
a.give up all local changes, and force update with latest source from remote
git fetch --all git reset --hard origin/master
b.only discard specific files which have conflicts
git checkout folderName/fileName.ext  (ext: git checkout <branch_name> -- <paths>)
c.fetch and merge
d.git stash git stash pop (By default git stash will not stash files for which there are no history. So if you have files which you have not yet added but which would be overwritten or "created" by the merge, then the merge will still block. In that situation, you can use git stash -u to stash uncommitted files)
http://www.cppblog.com/deercoder/archive/2011/11/13/160007.html

--

Apendix:<<Merging and Branching Strategy>>
![](/docs/docs_image/software/project_manage/git/git03.png)
![](/docs/docs_image/software/project_manage/git/git04.png)

```
1. introduce git flow
Because most of us have to deal with GIT every day, it’s necessary to level up a little bit in order to collaborate with each other more efficiently.
git enables people working from a remote place, streamlining the development process, maintain all the code changes history, it keeps all the states of the application at each time point of commits, so it’s easier for us to find bugs and blame the people who made the changes.

Let’s first look at git flow, so we can have a basic idea of how git may help our application development.
This one is a relatively general git flow.
Git flow is a well-known method to manage git branches.

the development will happen in feature branches, here we have features for future release and feature for next release, when programmer starts to develop a module or a feature, he will create a new feature branch initialled from develop branch, once done the development, feature branch owner will do the merge to develop, after develop branch has some features or reach a milestone, it will be merged to release branch, and QA will do the testing, if any issue is found, it will be fixed in release and merge back to develop, and once the release branch is fully tested, someone will create a pull request for merging to master, after reviewer or project leader reviewed the code changes, he may approve the request and do the merge, ideally master branch should be ready for product deployment at any point of time, but if any defects detected or urgent changes required, we will do it in hotfix branch, once done, it will be merged to master branch and merge back to develop branch as well.

2. common scenario - git merge & git rebase
Consider what happens when you start working on a new feature in a dedicated branch, then another team member updates the develop branch with new commits. This results in a forked history.
Assume now you have done the development work on feature,  you want to merge it to develop branch: how many options you have: cherry-pick or merge or rebasing+merge
because cherry-pick is not a structured way to do the merge, so I'm not going to discuss it.
this is what happens behind the scene when you git merge in command line or use GUI tool.
it will merge between  C3&C4 and their most recent common ancestor C2 and create a new commit C5
rebase works by going to the common ancestor of the two branches C2, getting the diff introduced by each commit of feature C4 , saving those diffs to temporary files, resetting feature branch to the same commit as develop (the branch you are rebasing onto), and finally applying each change in turn C4 prime.Now you switch to develop branch, and do git merge, it will do a fast-forward merge.
but what will happen if someone updated develop branch in between, I mean between you have done rebase and start to do merge on develop.
if your purpose is to keep a linear clean commit history on an active branch, rebase can help you .
 
3. when to use rebase
Bad practice
rebase develop onto your feature.
The problem is that this only happened in your repository. All of the other developers are still working with the original develop. Since rebasing results in brand new commits, Git will think that your develop branch’s history has diverged from everybody else’s.
Golden rule - never use it on public branch(Is anyone looking at this branch?)
Good practice (go to previous slide)
Now, let’s say that the new commits in develop are relevant to the feature that you’re working on.
One typical situation,
when someone has done a hot-fix for master,
by right, this hot-fix will be merged back to develop branch,
and you cannot continue with your development without this hot-fix in your feature branch,
then you may consider using rebase to get latest from develop
To incorporate the new commits into your feature branch,.
most of the time you may work solely on one feature branch, but if more than one developer working on same feature branch
you want to keep updated with latest changes or you want to keep a clean graph/commit history
conclusion:
conflict is inevitable, by adopting appropriate merging strategy, we can mitigate the risk of getting too many conflicts.
another suggestion is always examine your current status, which branch you are in,is there any other people working on this branch, and are you behind remote branches or ahead of remote branches with how many commits
hopefully you may have a better understanding of the merging strategy and understand what happens behind the scene.
https://git-scm.com/book/en/v2/Git-Branching-Rebasing
1. rebase is in local
all changes apply onto parent's latest changes
then can do the merge
question: 1.how abt someone push new changes to parent branch
2.before rebase you pushed to remote, cannot do the fast-forward merge
2. merge in remote - pull request
latest changes and common ancestor changes
A forked commit history
active 'parent' branch
https://www.atlassian.com/git/tutorials/merging-vs-rebasing/conceptual-overview
git rebase is good for local cleanup,
local cleanup? team policy?
https://www.atlassian.com/git/articles/git-team-workflows-merge-or-rebase/
don't commit so frequently, like writing 1 line code then commit, other people who commit later will suffer
 
https://steemit.com/bitcoin/@sblue/what-is-git-github-the-3-minute-journey-through-bitcoins-github-history
http://csci221.artifice.cc/lecture/collaboration-with-git.html

http://flsilva.com/blog/git-branching-and-merging/
https://longair.net/blog/2009/04/16/git-fetch-and-merge/

# what’s Git
GIT stores the state of your application at points in time known as commits. It does this in a clever way that means you don't have to store the whole state of your application, it just records a series of changes.
In GIT you have a master branch which (usually) stores the working, production state of your application. You can also create other branches for working on specific things such as features or bug fixes. This allows you and other developers to continue development without affecting the master branch.
Once testing is complete, you can merge these branches into your master/production branch. If you are developing a website using GIT, you might have the repository stored on a server somewhere. You can set up a hook in GIT that pushes your master commits to this repository, but no others.
One advantage this has over FTP is that GIT will just push the changes and not the files themselves, making uploading new versions a lot quicker.
GIT, however, has a few other fantastic features. Finding the source of bugs in GIT is extremely easy. It has built in tools for finding where a piece of code stopped working.

# Git vs SVN
Git is not better than Subversion. But is also not worse. It's different.
The key difference is that it is decentralized. Imagine you are a developer on the road, you develop on your laptop and you want to have source control so that you can go back 3 hours.
With Subversion, you have a Problem: The SVN Repository may be in a location you can't reach (in your company, and you don't have internet at the moment), you cannot commit. If you want to make a copy of your code, you have to literally copy/paste it.
With Git, you do not have this problem. Your local copy is a repository, and you can commit to it and get all benefits of source control. When you regain connectivity to the main repository, you can commit against it.
# bitcoin team
Team
The Bitcoin Core project has a large open source developer community with many casual contributors to the codebase. There are many more who contribute research, peer review, testing, documentation, and translation.
Maintainers
Project maintainers have commit access and are responsible for merging patches from contributors. They perform a janitorial role merging patches that the team agrees should be merged. They also act as a final check to ensure that patches are safe and in line with the project goals. The maintainers’ role is by agreement of project contributors.
Contributors
Everyone is free to propose code changes and to test, review and comment on open Pull Requests. Anyone who contributes code, review, test, translation or documentation to the Bitcoin Core project is considered a contributor. The release notes for each Bitcoin Core software release contain a credits section to recognize all those who have contributed to the project over the previous release cycle. A list of code contributors for the last year can be found on Github.

```

---
Ref:
Cheatsheet
https://illustrated-git.readthedocs.io/en/latest/
Take your Git practice to the next level    
    https://www.youtube.com/watch?v=eZRJyduqGuQ