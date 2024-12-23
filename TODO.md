# Repo general
- Convert files to TypeScript 
- Refine the tsconfig.json, .editorconfig
- Define .eslintrc.mjs
- Review the rest of the settings/definition files, e.g. `package.json`
- Determine why some inspections get stuck so badly
- Determine the code style, such as the order of class members (fields, constructors, etc.)

# Game general
- Determine what BitNodes to tackle first
- Determine what challenges to try
- Write a routine that goes through all eligible servers, and pushes them to 100% money, min sec
- Create a settings daemon - scripts check in with it, then it notifies if settings change.
    Basically, make it so that I can change settings on the fly, without relaunching programs.
- Look into implementing API hooks for arbitrary language runtime support, e.g. being able to use Blazor, JSPython/Brython, etc.
    Starting point: [CatLover's commit adding TS/TSX scripts](https://github.com/Nerdpie/bitburner-src/commit/864613c61632947be6ba0215253194c0a56d6259)

# Contracts to code:
- Hamming codes
- Overlapping sets
- Shortest path
- Matching parentheses

# Script changes
- Research script autocompletion options - https://github.com/bitburner-official/bitburner-src/blob/633da383016ad0521f9f1c17cdd99478d2701e41/src/Terminal/getTabCompletionPossibilities.ts#L290
- Evaluate making the pattern that sets up a tail window a library function
- Tweak `find_server` to show ALL servers in hierarchy, annotate pwned hosts
- Write script to show servers with contracts in a hierarchy
- Check the different array functions, such as `unshift`