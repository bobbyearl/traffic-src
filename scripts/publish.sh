# Fail the build if this step fails
set -e

if [[ "$TRAVIS_PULL_REQUEST" == "false" ]]; then

  # Setup git and clone our repo
  git config --global user.email "bobby@simplyearl.com"
  git config --global user.name "Bobby Earl"
  git clone --quiet https://${GITHUB_PAT}@github.com/bobbyearl/traffic.git > /dev/null

  # Delete all current files
  rm -rf traffic/*

  # https://github.com/isaacs/github/issues/408
  cp -a custom/. traffic/

  # Copy our "built" files into our clone and add them
  cp -a dist/. traffic/
  cd traffic
  git add .

  # Make sure there are any changes.
  # git commit will fail if there are no changes
  if [ -z "$(git status --porcelain)" ]; then
    echo -e "No changes to commit\n."
  else
    git commit -m "Pushing commit $TRAVIS_COMMIT via Travis build $TRAVIS_BUILD_NUMBER to master."
    git push -fq origin master > /dev/null
    echo -e "Successfully updated.\n"
  fi
fi
