# Building
How the sausage is made.

# Overview
Each build is for a _target_ , _area_ and _objective_

- A _target_ is the host or platform the files are accessed from in the browser.
	- Usually a shorthand, codename or mascot
		- `octocat == github pages`
		- `jammy == netlify`
		- `tanuki == gitlab`
- An _area_ represents a variation of the target
	- fhost = file host (ex: `file://`)
	- lhost = local host (ex: `http://localhost:8080`)
	- staging = staging/test host (ex: `http://dev.somesite`)
	- prod = real host (ex: `https://somesite`)
- An _objective_ represents the version

Directory structure:
```
build
└── target
    └── objective
    		├── general_file
    		├── area1_somefile
    		├── area2_otherfile
    		├── area3_afile
    		└── area4_anotherfile
```
