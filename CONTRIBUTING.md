## Branch Naming Rules

- Use lowercase letters and hyphens (`-`) to separate words.
- Branch names should be descriptive and concise.
- Use prefixes to indicate the type of work:
  - `feature/` for new features (e.g., `feature/user-authentication`)
  - `bugfix/` for bug fixes (e.g., `bugfix/login-error`)
  - `hotfix/` for urgent fixes (e.g., `hotfix/payment-crash`)
  - `chore/` for maintenance or chores (e.g., `chore/update-deps`)
- Avoid using spaces or special characters.
- Reference issue numbers when possible (e.g., `feature/123-user-profile`).

## Commit Message Rules

- Use the present tense (e.g., "add login page" not "added login page").
- Start with a short summary (max 50 characters), followed by a blank line and a detailed description if needed.
- Reference related issues by number (e.g., `Fixes #45`).
- Example:

  ```
  feat: add user authentication (#12)

  Implemented login and registration forms with validation.
  ```
