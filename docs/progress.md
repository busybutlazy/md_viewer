# Progress

本文件記錄開發進度。每個子階段完成後由 `git-workflow-specialist` 附加一筆。

**當前階段**：`P1.1`（待開始）

---

## 格式

每筆紀錄格式：

```
## P<階段> — <子階段名稱>
**完成日期**：YYYY-MM-DD
**Commit**：<commit hash>
**驗收**：✅ lint / ✅ test / ✅ build / ✅ 手動驗收

### 本子階段完成項目
- ...

### 遇到的問題
- ...

### 心得 / 決策
- ...

### 下一步
- 進入 P<下一階段>
```

---

## 日誌

## P1.0 — 專案初始化與容器化基礎
**完成日期**：2026-04-18
**Commit**：待提交 `chore(p1.0): 初始化專案與依賴`
**驗收**：✅ lint / ✅ test / ✅ build / ✅ 手動驗收

### 本子階段完成項目
- 建立 Next.js 15 + React 19 + TypeScript strict + Tailwind CSS v4 專案骨架
- 接上 Vitest、Testing Library 與首頁字型驗證內容
- 建立前端 Dockerfile、docker compose 與容器內依賴安裝入口
- 補齊 `frontend/src/components`、`frontend/src/lib`、`frontend/src/styles`、`electron/`、`frontend/samples/` 空殼目錄

### 遇到的問題
- `pnpm` 在 bind mount 直接寫入 `node_modules` 時會出現 Docker Desktop 的 copyfile 錯誤
- `next build` 會自動調整 `tsconfig.json`，需接受其對 TypeScript 專案的建議值

### 心得 / 決策
- 依賴安裝改由 compose 的 named volume 承接，避免直接寫入 repo 掛載目錄造成不穩定
- 首頁先做最小但可驗證的品牌頁，P1.1 再進一步擴成完整設計系統

### 下一步
- 進入 P1.1 設計系統基礎
