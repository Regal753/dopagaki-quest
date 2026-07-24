# ドパクエ / DOPA QUEST

「脳が逃げる前に、1個だけ倒せ。」を核にした、日本向け人生RPGタスクアプリのMVPです。

**公開β版:** https://regal753.github.io/dopagaki-quest/

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

$env:GITHUB_PAGES = "true"
$env:NEXT_PUBLIC_SITE_URL = "https://regal753.github.io/dopagaki-quest/"
npm run build:pages
npm run test:pages
```

## 次に測る数字

- 初回入力から最初の完了までの時間
- 1日あたり完了クエスト数
- 全討伐率
- 7日継続率
- 戦績シェア率

## GitHub運用

公開β版はGitHub Pagesから配信します。変更は`codex/*`からPull Requestにし、
CIでlint・Cloudflare向けbuild・rendered HTML test・Pages向け静的exportを
通します。

- アカウント登録なし
- 入力内容と進捗はブラウザの`localStorage`だけに保存
- アプリ側サーバーへのタスク本文・進捗送信なし
- 不具合はGitHub Issue Formで受け付け

公開ライセンスは未決定です。明示的な`LICENSE`が追加されるまで、第三者への
複製・改変・再配布許諾は付与されません。
