# ドパクエ / DOPA QUEST

「脳が逃げる前に、1個だけ倒せ。」を核にした、日本向け人生RPGタスクアプリのMVPです。

## 初版で検証する体験

- やることを雑に1行入力する
- 内容に応じて、今すぐ動ける3ステップ＋ボスクエストへ分解する
- 完了ごとにXP・レベル・進捗率が即座に反応する
- 全討伐で宝箱とランダム報酬を受け取る
- 戦績を端末の共有機能またはクリップボードへ渡す
- 当日の状態をブラウザ内へ保存し、翌日にデイリークエストを再開する

初版はアカウント、課金、カレンダー連携、Discord連携を持ちません。まず「タスク入力より先にゲームが始まる感覚」と7日継続を検証するためです。

## 起動

```powershell
npm install
npm run dev
```

ローカルURLは通常 `http://localhost:3000/` です。

## 検証

```powershell
npm run lint
npm run build
node --test tests/rendered-html.test.mjs
```

## 次に測る数字

- 初回入力から最初の完了までの時間
- 1日あたり完了クエスト数
- 全討伐率
- 7日継続率
- 戦績シェア率

## GitHub運用

初期検証中はprivate repositoryで扱います。変更は`codex/*`からDraft
PRにし、CIでlint・build・rendered HTML testを通します。公開ライセンスは
未決定のため、現時点では第三者への再配布やpublic化を前提にしません。
