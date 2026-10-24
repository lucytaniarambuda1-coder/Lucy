# Project tracker

The **Projects** tab on [lucy-s.netlify.app](https://lucy-s.netlify.app) shows every project Lucy is running, managed with Claude.

## Where the data lives
- `src/data/projects.json` is the one source of truth. It's saved in this GitHub repo (`lucytaniarambuda1-coder/Lucy`) and in the local copy at `~/Documents/Claude/Projects/Lucy's Project/lucys-world/`.
- Pushing a change to the `claude/lucys-world-task-app-rNcfT` branch redeploys the site on Netlify in a minute or two.

## How to update it
- **Tell Claude** what changed ("the payment link is live", "add a new project…"). Claude edits `projects.json`, adds a line to `log`, sets `updated`, and pushes.
- **Ticking a step in the app** saves it on that device (and through cloud sync). A yellow box then appears with **Copy updates**: paste that into Claude so it's saved to GitHub for good.

## Fields (one entry per project)
| Field | Meaning |
|-------|---------|
| `status` | `launching`, `active`, `planning`, `ongoing`, `paused` or `done` |
| `priority` | 1 = top, 2 = medium, 3 = low |
| `nextAction` / `due` | The single next step and its date (`YYYY-MM-DD`, or `null`) |
| `keyDates` | Dated events that show under **Coming up** (next 30 days) |
| `milestones` | The checklist; `done: true` when finished |
| `waitingOnLucy` | Decisions or info only Lucy can give; shown under **Waiting on me** |
| `folder` | Where the files are, relative to `~/Documents/Claude/Projects/` |
| `tag` | Links to Master List tasks with the same tag |

Never invent prices, dates or figures. Leave them out and add the question to `waitingOnLucy`.
