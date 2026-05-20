# Problem Log

## 2026-05-20

### PowerShell Execution Policy blocked npx
**Problem:** `npx create-next-app` failed with "running scripts is disabled on this system"  
**Cause:** Default PowerShell execution policy is `Restricted`  
**Solution:** `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force`  
**Status:** โ… Resolved

### GitHub CLI not found after install
**Problem:** `gh` command not found even after winget install  
**Cause:** PATH not updated until terminal restart, and tool session didn't pick up new PATH  
**Solution:** Used full path `C:\Program Files\GitHub CLI\gh.exe` directly  
**Status:** โ… Resolved (restart terminal to use `gh` normally)

---

## Log Format
### [Short title]
**Problem:** What went wrong  
**Cause:** Why it happened  
**Solution:** How it was fixed  
**Status:** โ… Resolved / ๐” In Progress / โ Unresolved

### Prisma v7 breaking changes
**Problem:** Prisma v7 removed url/directUrl from schema.prisma and changed PrismaClient constructor  
**Cause:** Prisma v7 is a major version with completely new config format (prisma.config.ts)  
**Solution:** Downgraded to Prisma v5 (stable) — 
pm install prisma@5 @prisma/client@5  
**Status:** Resolved

### prisma migrate dev non-interactive error
**Problem:** prisma migrate dev fails with "environment is non-interactive"  
**Cause:** Tool runs in non-interactive shell environment  
**Solution:** Use prisma db push --accept-data-loss for development schema sync instead  
**Status:** Resolved

### Admin login redirect loop (ERR_TOO_MANY_REDIRECTS)
**Problem:** /admin/login was wrapped by pp/admin/layout.tsx which redirects unauthenticated users to /admin/login — creating an infinite loop  
**Cause:** Admin layout protected ALL routes under /admin including the login page itself  
**Solution:** Moved protected pages into pp/admin/(protected)/ route group — login page stays outside, URLs remain the same  
**Status:** ✅ Resolved

### Event handlers in Server Components
**Problem:** onMouseEnter/onMouseLeave cannot be passed to Client Component props in Server Components  
**Cause:** GameCard.tsx and admin page components had event handlers but no "use client" directive  
**Solution:** Added "use client" to GameCard.tsx, extracted AdminActionCards and AdminGameList as separate Client Components  
**Status:** ✅ Resolved
