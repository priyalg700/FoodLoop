# FoodLoop

**Share Surplus. Reduce Waste.**

Team Food Savers | Primary SDG: SDG 12, Responsible Consumption and Production

FoodLoop is a student prototype of a platform that helps food providers list suitable edible surplus, so that recipient organizations can collect it before it is wasted.

## What the prototype does

- **Donor:** creates a food listing (item, quantity, location, pickup deadline, handling notes)
- **Recipient:** sees Available listings and accepts one
- **Pickup code:** when a recipient accepts, a 4-digit code is created and shown only to the recipient
- **Confirmation:** the donor types the code at pickup to mark the food Collected, then the recipient confirms receipt to mark it Completed
- **Roles:** a role drop-down (Donor or Recipient) controls who can do each action
- **Summary:** shows listings created, accepted, completed and meals redistributed

The pickup code and role check are a prototype of the idea. They are not real security, because there is no login yet.

## How to run

1. Download or clone this repository.
2. Double-click `index.html` to open it in a browser.

No installation is needed. The project uses plain HTML, CSS and JavaScript.

## Files

| File | Purpose |
|---|---|
| `index.html` | Page structure: sections, form, role drop-down, buttons, table |
| `style.css` | Design: colours, layout, cards, status labels |
| `script.js` | Logic: add listing, accept, role checks, pickup code check, status, totals |
| `FoodLoop-diagrams.pdf` | Workflow, architecture, data flow and wireframe diagrams |
| `FoodLoop-Design.pdf` | Project design description |
| `FoodLoop-Synopsis.pdf` | One-page synopsis |
| `v2-01-home.png` to `v2-09-validation.png` | Test run screenshots |
| `test-results-v2.docx` | Test results table |

## Milestone 2 status

**Built:** donor form, recipient view with Accept, role checks, pickup code confirmation, status updates, summary totals.

**Planned, not built yet:** real login and recipient verification, coordinator role, photo or note proof at
