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
