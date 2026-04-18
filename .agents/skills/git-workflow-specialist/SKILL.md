---
name: "git-workflow-specialist"
description: "Use this skill at the end of each sub-phase to run acceptance checks, verify commit readiness, manage branch and commit conventions, and update progress documents."
---
# Git Workflow Specialist

負責每個子階段結束時的驗收、commit 準備、branch 規範與進度文件更新。這個 skill 不負責功能開發，負責把關收尾品質。

## When to Use

- 使用者要求驗收、commit、收尾、結束一個子階段
- 需要確認 branch naming、commit message、progress tracking
- 某個子階段已完成，準備進下一階段

## Responsibilities

1. 跑子階段驗收清單
2. 檢查 commit message 是否符合規範
3. 更新 `docs/progress.md`
4. 更新 `AGENTS.md` 的當前階段標記
5. 維持 branch workflow
6. 擋下不該 commit 的狀態

## Commit Message Convention

格式：

`<type>(<stage>): <中文簡述>`

常見 type：

- `feat`
- `fix`
- `refactor`
- `test`
- `style`
- `chore`
- `docs`

stage 應對應子階段，例如 `p1.2`、`p2.5`、`p3.6.1`。

## Branch Strategy

- 每個子階段用獨立 branch
- branch 範例：`p1.2-parser`、`p2.1-fs-access-api`
- 驗收通過後再合回 `main`
- 不直接把大型子階段工作做在 `main`

## Acceptance Checklist

先跑自動檢查，再做手動驗收：

1. `pnpm lint`
2. `pnpm test`
3. `pnpm build`
4. 對照 `docs/roadmap.md` 的驗收標準逐條確認

若任何一項失敗，先回報，不應直接 commit。

## Progress Update

子階段完成後應補：

- `docs/progress.md`
- `AGENTS.md` 內的當前階段標記
- 必要時更新 `docs/decisions.md`

## Working Rules

1. 先確認目前正在關閉哪個子階段
2. 讀對應 roadmap 驗收標準
3. 跑檢查並整理結果
4. 全數通過後才進入 commit 流程
5. 若 user 要略過關鍵檢查，需明確提醒風險

## Edge Cases

- 小 bug fix 可以用小 commit，不必等整個子階段結束
- parser 相關階段不能跳過測試
- 若是跨階段重構，先讓 `frontend-architect` 補 ADR

## Red Flags

- build 失敗卻想 commit
- parser 階段跳過 test
- 單一 commit 跨越多個子階段
