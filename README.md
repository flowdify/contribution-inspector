# Contribution Inspector
A GitHub Action to validate submitted issues & PRs.

## Features
- Provides standard templates such as `Bug Report`, `Feature Request` and `Discussion` for Issues and one standard for PRs.
- Validates submitted issues & PRs against the provided templates.
- Adds relevant labels such as `Bug`, `Feature` and `Discussion` on issues based on the template used.
- Adds relevant labels such as `Small Change`, `Medium Change` and `Large Change` on PRs based on the number of lines changed.
- Greets users for their contribution using a provided custom message.

## Documentation

Read the documentation carefully before making changes in configuration YAML file and templates.

### Introduction
- The **Contribuion Inspector** considers an Issue and a Pull Request (PR) as a **Contribution**.
- It will trigger everytime a new issue or pull request is `opened`, `edited` or `reopened`.
- The **Contribuion Inspector** responds with an 'Issue Comment' for its output.

### Standard Rules for Issues & PRs

#### Issue
- Every `opened`, `edited` or `reopened` issue will be **closed** immediately, if it did not validate against its template.
- Every issue will have either a `Bug :shield:`, `Feature :shield:` or `Discussion :shield:` tag based on the template selected.

#### Pull Request
- Every PR will have either a `Small Change :shield:`, `Medium Change :shield:` and `Large Change :shield:` tag to represent the lines of code changed by PR based on the user's input given in the configuration YAML file.

### Template Configuration

#### Template Path:

- Template paths are hardcoded and cannot be changed.
- The `name` and `labels` property inside the issue templates must not be changed.
- Headers inside these templates can be changed, inserted or deleted to match your needs.
- For issues 3 standard templates are provided: 
    1. **Bug Report** - Path: `.github/ISSUE_TEMPLATE/bug_report.md`.
    2. **Feature Request** - Path: `.github/ISSUE_TEMPLATE/feature_request.md`.
    3. **Discussion** - Path: `.github/ISSUE_TEMPLATE/discussion.md`.
- For PRs, one standard template is created, Path: `.github/PULL_REQUEST_TEMPLATE.md`.

#### Headers

- Sentences starting with `###` in the issue and PR templates are considered as **Headers**.
- Headers are the primary element against which the issue or PR body is validated. 
- Headers should always represent 'Points' to describe an issue or a PR. 
- Atleast one header ust be present inside a template.
- A header example would be `Describe the bug:` or `Steps to reproduce:` 
- It is a best practice to add `:` at the end of each header to represent that ot should be elaborated.

### Properties

| Name | Datatype | Description | Example |
|------|----------|-------------|---------|
| token | string | GitHub secret access token. | ${{ secrets.GITHUB_TOKEN }} |
| issue--greeting-message | string | Greeting message for issue authors. | 'Thanks you!' |
| pull-request--size-small | integer | Lines of code threshold for a PR with small change. | 50 |
| pull-request--medium-small | integer | Lines of code threshold for a PR with medium change. | 200 |
| pull-request--large-small | integer | Lines of code threshold for a PR with large change. | 400 |

### Example

```
name: Example

on: 
  issues:
    types: [opened, edited, reopened]
  pull_request:
    types: [opened, edited, reopened]

jobs:
  contribution_inspector:
    runs-on: ubuntu-latest
    name: Contribution Inspector
    steps:
    - name: All Checks
      uses: flowdify/contribution-inspector@main
      with:
        token: ${{ secrets.GITHUB_TOKEN }}

        issue--greeting-message: 'Thanks for your contribution! :)'
        pull-request--greeting-message: 'Thanks for your contribution! :)'

        pull-request--size-small: 50
        pull-request--size-medium: 200
        pull-request--size-large: 400
```

## Future Plans

- Adding a functionality of **One Commit per PR** for PRs with small change.
- Validate the actual body of the submitted issue and PR to check if it is not some gibberish.
- Provide more customization for template paths and number of templates.

#### More Updates will be added soon...