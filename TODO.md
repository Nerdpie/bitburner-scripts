# Repo general

- Refine the tsconfig.json
- Refine the code style (`.editorconfig`, `eslint.config.mjs`)
  - Prefer named functions over arrow functions assigned to variables
  - Prefer explicit `type` imports
  - Migrate from Jetbrains-native inspections to ESLint (will help with suppression comment conflicts too)
  - Warn of deeply nested structures (loops, conditionals, etc.)
- Review the rest of the settings/definition files, e.g. `package.json`
- Determine why some inspections get stuck so badly
- Determine the code style, such as the order of class members (fields, constructors, etc.)
- Define an inspection with the pattern `import (?!type).* from "@/?game_internal_types` to ensure we only use the TYPES
  from game internal classes; avoids build errors
- Define an inspection for chained `filter` or `sort` calls
- Move from the Jetbrains-specific formatting to `dprint`
  - Or maybe not; seems like it may be still in early days?
- Remove type assertions for global objects, now that we have them properly documented
  - This will force us to then check that they are in fact defined after calling `exposeGameInternalObjects`
- Configure proper handlers for `tmux`

# `tmux` notes

```shell
# Creates (if not already present) a session named 'bbsrc'
tmux new -A -s bbsrc 'cd ../bitburner-src/ && npm run start:dev'
```

- Can then detach by `C-b : detach`
- Alternatively, launch with this, and then attach as needed:

```shell
tmux new -d -s bbsrc 'cd ../bitburner-src/ && npm run start:dev'
```

# Game general

- Determine what BitNodes to tackle first
- Determine what challenges to try
- Write a routine that goes through all eligible servers, and pushes them to 100% money, min sec
- Create a settings daemon - scripts check in with it, then it notifies if settings change.
  Basically, make it so that I can change settings on the fly, without relaunching programs.
- Look into implementing API hooks for arbitrary language runtime support, e.g. being able to use Blazor,
  JSPython/Brython, etc.
  - Starting
  point: [CatLover's commit adding TS/TSX scripts](https://github.com/Nerdpie/bitburner-src/commit/864613c61632947be6ba0215253194c0a56d6259)
  - Possible endpoint name: babelfish
- Implement logic to determine which augments to buy, and in what order
  - Will need to include the price increase factor
  - Priorities may shift per BitNode, but for the most part, we will want to focus on:
    1. CashRoot Starter Kit - Helps bootstrap after installing augs; once obtained, other augs for programs aren't as
       critical (money from casino)
    2. Neuroreceptor Management Implant - Removes the focus penalty
    3. Charisma level, charisma EXP, faction rep (get more augments faster)
    4. Hacking level, hacking EXP
    5. Hacking speed
    6. Other hacking stats
    7. Combat stats - any particular order?
    8. Leftovers
    9. As many levels of NFG as we can - Need to special-case so we don't grab NFG right away. Also depends upon the
       installed LEVEL.
  - Some BitNodes may make, for instance, crime success more important, or the Hacknet server bonuses
  - Need to account for pre-reqs for desired augs; when computing the purchase chain, should we get pre-reqs for the
    highest desired aug regardless, or only if we will be able to get the target aug afterward?

# Contracts to code:

- Hamming codes
- Overlapping sets
- Shortest path
- Matching parentheses

# Script changes

- Research script autocompletion
  options - https://github.com/bitburner-official/bitburner-src/blob/633da383016ad0521f9f1c17cdd99478d2701e41/src/Terminal/getTabCompletionPossibilities.ts#L290
- Tweak `find_server` to show ALL servers in hierarchy, annotate pwned hosts
- Check the different array functions, such as `unshift`
