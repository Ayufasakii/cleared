# Architecture

## Tech Stack
| Layer | Technology | Reason |
|---|---|---|
| Framework | Next.js 15 (App Router) | Full-stack, frontend + backend in one project |
| Styling | Tailwind CSS | Fast styling, no custom CSS needed |
| Database | PostgreSQL (Vercel Postgres) | Required for Vercel deployment, free tier available |
| ORM | Prisma | Type-safe DB queries, easy migrations |
| Auth | NextAuth.js | Simple username/password for admin (Phase 1) |
| PSN Integration | psn-api | Unofficial PSN API wrapper for trophy sync |
| File Storage | Vercel Blob | For manual game cover uploads |
| Deployment | Vercel | Free, auto-deploy from GitHub |

## Routes

### Public
| Route | Description |
|---|---|
| `/` | Game list — Now Clearing + Stats + Games by status |
| `/games/[id]` | Game detail — ratings, review, trophy grid |
| `/journal` | Journal — all entries sorted by date |
| `/about` | About page (TBD) |

### Admin
| Route | Description |
|---|---|
| `/admin/login` | Login page |
| `/admin` | Manage games |
| `/admin/games/new` | Add game (PSN sync or manual) |
| `/admin/games/[id]` | Edit/delete game + manage trophies |
| `/admin/journal` | Write/edit/delete journal entries |

## Data Models

### Game
```
id            String   @id
title         String
platform      String   (PS4/PS5/PC/Switch/Other)
genre         String
status        Enum     (PLAYING/PLATINUM/DROPPED)
coverUrl      String?  (PSN URL or Vercel Blob URL)
scoreStory    Int?     (1-5)
scoreCharacter Int?
scoreArt      Int?
scoreSound    Int?
scoreGameplay Int?
scoreDifficulty Int?
review        String?
highlight     String?
quote         String?
replayValue   Int?     (1-5)
moodTags      String[] 
startDate     DateTime?
platinumDate  DateTime?
createdAt     DateTime @default(now())
updatedAt     DateTime @updatedAt
```

### Trophy
```
id          String   @id
gameId      String   (FK → Game)
name        String
grade       Enum     (PLATINUM/GOLD/SILVER/BRONZE)
imageUrl    String?
rarity      Float?   (% of players who earned it)
difficulty  Int?     (1-5)
fun         Int?     (1-5)
note        String?
earned      Boolean  @default(false)
earnedAt    DateTime?
```

### JournalEntry
```
id        String   @id
gameId    String?  (FK → Game, optional)
date      DateTime
mood      String?
diary     String
trophies  Trophy[] (trophies earned that day)
createdAt DateTime @default(now())
```

## PSN Integration

NPSSO token must be manually obtained:
1. Go to https://ca.account.sony.com/api/v1/ssocookie while logged in to PlayStation
2. Copy the `npsso` value
3. Paste into Admin Settings
4. Token expires periodically — must be refreshed manually

## Design System

### Colors
```
Background:  #08080f
Surface:     #0f0f1a
Border:      #1e1e35
Accent:      #7c6dff  (soft neon purple)
Accent Alt:  #4fc3f7  (ice blue)
Text:        #e8e8f0
Muted:       #4a4a6a
```

### Typography
- Font: Space Grotesk
- Headings: Bold, large, high contrast
- Body: Regular weight, muted color

### Layout Principles
- Card grid, dense (not sparse)
- Midnight Japan lofi vibe
- Mobile responsive
- Spoiler blur on unearned trophies
