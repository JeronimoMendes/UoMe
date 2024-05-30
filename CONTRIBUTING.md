# Contributing

First of all, thank you for considering contributing to the project. It's people like you that make it possible for this project to exist.

## How to contribute

1. Pick an issue from the issues tab or create a new one with a feature request or a bug report.
2. Fork the project.
3. Create a new branch with the name `issues/<issue_number>-<issue_title>`.
4. Make your changes.
5. Create a pull request with the changes.
6. Wait for the review.
7. Merge the changes.
8. Celebrate 🎉

## CI/CD

The project uses GitHub Actions to run tests and linting tools on every push to the repository. The checks are:

- `pytest` to run the tests
- `ruff` to lint the code
  - `ruff` will also complain about code formatting
