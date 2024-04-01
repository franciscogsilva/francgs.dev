---
  title: 'How to Install MongoDB on Ubuntu 20.04'
  author: 'Francisco Gonzalez'
  description: 'How to Install MongoDB on Ubuntu 20.04, a complete guide'
  pubDate: 2024-02-05
  image:
    url: 'https://docs.astro.build/assets/full-logo-light.png'
    alt: 'The full Astro logo.'
  tags: ["linux", 'mongodb']
  layout: ./../../layouts/MarkdownPostLayout.astro
---

<!-- # How to Install MongoDB on Ubuntu 20.04 -->

### ERROR

```
The following packages have unmet dependencies:
 mongodb-org-mongos : Depends: libssl1.1 (>= 1.1.0) but it is not installable
 mongodb-org-server : Depends: libssl1.1 (>= 1.1.0) but it is not installable
 mongodb-org-shell : Depends: libssl1.1 (>= 1.1.0) but it is not installable
E: Unable to correct problems, you have held broken packages.
```

SOLUTION: https://askubuntu.com/questions/1403619/mongodb-install-fails-on-ubuntu-22-04-depends-on-libssl1-1-but-it-is-not-insta


## Install 

https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-20-04

1. `curl -fsSL https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -`

This command will return OK if the key was added successfully:

Output:
```
OK
```

2. `echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list`



3. `sudo apt update`