# cs-website

## What is this thing?
This is a website for a company I'm working for. Their current website can be found at https://www.computer-steiner.com (which may or may not be a descendant of what's in this repo).

The site seems to be broken now if no `Referer` header is sent in HTTP requests for it. (Which is not my fault.) This applies when navigating away from GitHub so links on this page won't work. A workaround is to search for "Computer Steiner", then visit the site from the search results.

## Why does it have this weird project architecture?
Because it's a Visual Studio 2017 project. I don't like it either but it was a requirement. You can, however, use any text editor to make changes to it.

## How do I set this up in my local workspace?
To get this project up and running you need to install a few things first:
 - **Componser:** A dependency manager for PHP
 - **NPM:** A package manager for Node.js (Note that Node.js isn't used in this project, but it's still necessary because you can't install NPM without Node)
 - **TypeScript:** More specifically, the TypeScript compiler; Can be downloaded through NPM
 
### I've just downloaded all of that cr**. What now?
Execute these steps:
 1. Clone the repo (if you haven't already)
 2. Open the command prompt on the folder `cs-website/` (the one that contains the `composer.json` and `composer.lock` files) in the cloned repo
 3. Run `composer install`. This will download the PHP dependencies of this project. A folder called `vendor/` should appear.
 4. Run `tsc`. This will translate the TypeScript files into JavaScript.
 
 If you plan on editing the TypeScript files you can also run `tsc -w`, which will start an instance of the compiler that looks for file changes and then automatically recompiles the files.
