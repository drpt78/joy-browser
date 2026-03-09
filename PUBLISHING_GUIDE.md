# Publishing Joy Browser to the AUR (Manjaro / Arch)

## Step 1 — Fix your project structure

Make sure your project folder looks like this:

```
joy-browser/
├── src/
│   ├── main.js
│   └── preload.js
├── index.html
├── icon.png
└── package.json        ← use the updated one provided
```

> If your main.js and preload.js are currently in the root folder
> (not inside src/), either move them into src/ or change
> "main": "src/main.js" back to "main": "main.js" in package.json.


## Step 2 — Create a GitHub repository

1. Go to https://github.com and sign in (or create a free account)
2. Click "New repository"
3. Name it exactly: joy-browser
4. Set it to Public
5. Don't add a README or .gitignore yet

Then in your project folder on your machine, run:

```bash
git init
git add .
git commit -m "Initial release v0.0.1"
git remote add origin https://github.com/YOUR_USERNAME/joy-browser.git
git push -u origin main
```

Then create a release tag:

```bash
git tag v0.0.1
git push origin v0.0.1
```

This creates a downloadable .tar.gz at:
https://github.com/YOUR_USERNAME/joy-browser/archive/refs/tags/v0.0.1.tar.gz


## Step 3 — Get the sha256 checksum

After pushing your tag, run:

```bash
curl -sL https://github.com/YOUR_USERNAME/joy-browser/archive/refs/tags/v0.0.1.tar.gz | sha256sum
```

Copy the hash and replace SKIP in the PKGBUILD:
  sha256sums=('paste-your-hash-here')


## Step 4 — Update PKGBUILD placeholders

Open PKGBUILD and replace:
- YOUR_USERNAME  → your actual GitHub username
- Your Name      → your name
- your@email.com → your email


## Step 5 — Test the PKGBUILD locally on Manjaro

```bash
mkdir ~/aur-test && cd ~/aur-test
cp /path/to/PKGBUILD .
makepkg -si
```

This builds and installs it locally. Check that Joy Browser appears
in your app menu and launches correctly before publishing.


## Step 6 — Create an AUR account

1. Go to https://aur.archlinux.org
2. Register for an account
3. Add your SSH public key under "My Account"
   (generate one with: ssh-keygen -t ed25519)


## Step 7 — Publish to the AUR

```bash
# Clone the (empty) AUR repo for your package name
git clone ssh://aur@aur.archlinux.org/joy-browser.git
cd joy-browser

# Copy your PKGBUILD in
cp /path/to/PKGBUILD .

# Generate the .SRCINFO file (required by AUR)
makepkg --printsrcinfo > .SRCINFO

# Commit and push
git add PKGBUILD .SRCINFO
git commit -m "Initial release v0.0.1"
git push
```

Your package is now live at:
https://aur.archlinux.org/packages/joy-browser

Manjaro users can install it via Pamac ("Add/Remove Software")
by searching "Joy Browser", or via terminal:
  pamac install joy-browser


## Updating in the future

When you release a new version:
1. Bump pkgver in PKGBUILD
2. Update the sha256sum
3. Push a new git tag to GitHub
4. Run makepkg --printsrcinfo > .SRCINFO in the AUR repo
5. Commit and push to AUR
