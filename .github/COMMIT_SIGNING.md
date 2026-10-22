# QSLC / EVE 1010 — Verified Commit Signing

GitHub API-based commits and automated service commits are not automatically signed by the repository owner's local GPG/SSH key. A commit must be signed by a key controlled by the actual author or a supported signing service. Do not invent a private signing key or represent an unsigned commit as Verified.

## One-time setup on an authorized development computer

1. Create an SSH **signing** key dedicated to Git (do not reuse or export a private key in the repository):

```bash
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_qslc_signing -C "QSLC Git commit signing"
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519_qslc_signing.pub
git config --global commit.gpgsign true
```

2. Register the contents of `~/.ssh/id_ed25519_qslc_signing.pub` as a **Signing key** in GitHub account Settings → SSH and GPG keys. Never upload the private key.
3. Configure the author name/email to match the GitHub identity or a verified email address.
4. Make and push a signed commit:

```bash
git add -A
git commit -S -m "feat(qslc-eve): harden sovereign gallery and governance"
git push origin main
git log -1 --show-signature
```

5. Inspect the commit on GitHub and confirm the **Verified** badge. Key registration, the actual signature and GitHub's verification are all required.

## Repository rules

- Require signed commits in branch rulesets **only after** a verified signing path exists for all maintainers and approved automation bots.
- A repo write through the GitHub Contents API does **not** imply owner GPG/SSH signing.
- If a managed builder, Cloudflare deployment, or bot creates commits, record the actor and check its signature separately.
- Do not weaken branch protection, bypass billing/permission checks, or commit keys/secrets to force a green status.
