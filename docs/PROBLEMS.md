# Problem Log

## 2026-05-20

### PowerShell Execution Policy blocked npx
**Problem:** `npx create-next-app` failed with "running scripts is disabled on this system"  
**Cause:** Default PowerShell execution policy is `Restricted`  
**Solution:** `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force`  
**Status:** ✅ Resolved

### GitHub CLI not found after install
**Problem:** `gh` command not found even after winget install  
**Cause:** PATH not updated until terminal restart, and tool session didn't pick up new PATH  
**Solution:** Used full path `C:\Program Files\GitHub CLI\gh.exe` directly  
**Status:** ✅ Resolved (restart terminal to use `gh` normally)

---

## Log Format
### [Short title]
**Problem:** What went wrong  
**Cause:** Why it happened  
**Solution:** How it was fixed  
**Status:** ✅ Resolved / 🔄 In Progress / ❌ Unresolved
