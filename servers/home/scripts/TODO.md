# Repo general
- Convert files to TypeScript 
- Refine the tsconfig.json, .editorconfig
- Define .eslintrc.cjs
- Review the rest of the settings/definition files, e.g. `package.json`

# Game general
- Do the exploits - https://github.com/bitburner-official/bitburner-src/blob/stable/src/Exploits/Exploit.ts
  - [New Tokyo Noodle Bar](https://github.com/bitburner-official/bitburner-src/blob/dev/src/Locations/ui/SpecialLocation.tsx#L96)
  - [New Tokyo Arcade](https://github.com/bitburner-official/bitburner-src/blob/dev/src/Arcade/ui/BBCabinet.tsx#L18)

# Contracts to code:
- Caesar cypher offset
- Hamming codes
- Overlapping sets
- Number of paths
- Shortest path
- Matching parentheses

# Script changes
- Research script autocompletion options - https://github.com/bitburner-official/bitburner-src/blob/633da383016ad0521f9f1c17cdd99478d2701e41/src/Terminal/getTabCompletionPossibilities.ts#L290
- Evaluate making the pattern that sets up a tail window a library function
- Tweak `find_server` to show ALL servers in hierarchy, annotate pwned hosts
- Write script to show servers with contracts in a hierarchy
- Check the different array functions, such as `unshift`