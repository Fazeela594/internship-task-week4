# Freelancing Marketplace Platform: Week 4

**Job Posting, Proposals & Client Marketplace**


Author: Fazeela Manzoor

## Overview

Week 4 adds the core marketplace workflow. Clients can post jobs, and freelancers can browse those jobs and send proposals. Everything is built with plain HTML5, CSS3 and JavaScript, with no frameworks or backend.

## Project Structure

```
week4/
├── index.html   # page structure (header, navigation, main container)
├── style.css    # all styling and responsive layout
├── script.js    # jobs, filters, forms, validation, proposals
└── README.md
```

## How to Run

1. Keep all files in the same folder.
2. Open `index.html` in any modern browser.

No installation or server is needed. The page uses hash routing (`#/jobs`, `#/post`, `#/proposals`), so it works when opened directly from the file system.

## Features

### Pages
| Page | Route | Description |
|---|---|---|
| Find Jobs | `#/jobs` | Job cards with search, filters and sorting |
| Job Details | `#/job/<id>` | Full description, skills, budget and proposal count |
| Submit Proposal | `#/apply/<id>` | Proposal form for freelancers |
| Post a Job | `#/post` | Job form for clients |
| My Proposals | `#/proposals` | All proposals sent, with status and withdraw option |

### Job cards
Each card shows the job title, category, budget, required skills, description, posted date, number of proposals and an Apply button.

### Search, filter and sort
- Keyword search across title, description and skills
- Category chips
- Budget filter (under $300, $300 to $600, over $600)
- Sorting: newest, highest budget, lowest budget, fewest proposals
- Clear filters button

### Forms and validation
- **Proposal form:** cover letter (min. 50 characters), proposed price, delivery time, relevant skills/experience
- **Post a Job form:** title, category, skills, minimum and maximum budget, description
- Inline error messages under each field, and focus moves to the first invalid field

### Interactive states
- Proposal statuses: pending, shortlisted, accepted, rejected, withdrawn
- Filter My Proposals by status
- Withdraw a pending proposal (the job's proposal count updates)
- "Applied" label on jobs already applied to
- Loading skeleton while jobs load
- Empty states (no search results, no proposals)
- Error state with a retry button
- Toast messages after submitting, posting and withdrawing

### Responsive design
The layout adapts to desktop, tablet and mobile screens.

## Data Storage

Jobs and proposals are saved in the browser's `localStorage`, so they stay after a page refresh. To reset to the sample data, run this in the browser console and reload:

```js
localStorage.clear()
```

## Testing the Error State

Open the browser console on the Find Jobs page and run:

```js
simulateError = true
```

Then reload the jobs list (go to another page and back). The error message and the "Try again" button will appear once.

## Technologies

- HTML5
- CSS3 (Grid, Flexbox, media queries)
- JavaScript (ES6)
