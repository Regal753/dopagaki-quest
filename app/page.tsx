"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Quest = {
  id: string;
  title: string;
  detail: string;
  xp: number;
  done: boolean;
  kind: "main" | "sub";
};

type SaveData = {
  xp: number;
  streak: number;
  chests: number;
  quests: Quest[];
  date: string;
};

const starterQuests: Quest[] = [
  { id: "water", title: "水を1杯飲む", detail: "まず脳を起動", xp: 10, done: false, kind: "sub" },
  { id: "reply", title: "返信を1件だけ返す", detail: "開く → 1通選ぶ → 送信", xp: 25, done: false, kind: "main" },
  { id: "move", title: "外を5分歩く", detail: "靴を履いたら半分クリア", xp: 20, done: false, kind: "sub" },
];

const STORAGE_ID = "dopagaki-quest-v1";
const todayKey = () => new Date().toLocaleDateString("ja-JP");

function splitQuest(input: string): Quest[] {
  const text = input.trim();
  const easy = /掃除|片付|部屋/.test(text)
    ? ["ゴミを3個捨てる", "床の物を1か所へ集める", "3分だけ掃除する"]
    : /返信|メール|連絡/.test(text)
      ? ["相手を1人だけ選ぶ", "要点を1文で書く", "送信ボタンを押す"]
      : /勉強|学習|資格|簿記/.test(text)
        ? ["教材を開く", "例題を1問だけ解く", "間違いを1行残す"]
        : ["必要な画面か道具を開く", "2分だけ手を動かす", "次の1手を残す"];

  return [
    { id: crypto.randomUUID(), title: text, detail: "今日のボスクエスト", xp: 40, done: false, kind: "main" },
    ...easy.map((title, index) => ({
      id: crypto.randomUUID(),
      title,
      detail: index === 0 ? "開始条件を消す" : index === 1 ? "勢いを作る" : "ここまでで勝ち",
      xp: 10 + index * 5,
      done: false,
      kind: "sub" as const,
    })),
  ];
}

export default function Home() {
  const [data, setData] = useState<SaveData>({ xp: 72, streak: 3, chests: 0, quests: starterQuests, date: "" });
  const [todayLabel, setTodayLabel] = useState("今日");
  const [input, setInput] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState("");
  const [reward, setReward] = useState<string | null>(null);
  const [showAllDone, setShowAllDone] = useState(false);

  useEffect(() => {
    const restore = window.setTimeout(() => {
      const currentDate = todayKey();
      setTodayLabel(currentDate);
      const raw = localStorage.getItem(STORAGE_ID);
      let restored = false;
      if (raw) {
        try {
          const saved = JSON.parse(raw) as SaveData;
          setData(saved.date === currentDate ? saved : { ...saved, date: currentDate, quests: starterQuests.map((q) => ({ ...q, done: false })) });
          restored = true;
        } catch {
          localStorage.removeItem(STORAGE_ID);
        }
      }
      if (!restored) {
        setData((current) => ({ ...current, date: currentDate }));
      }
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(restore);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_ID, JSON.stringify(data));
  }, [data, loaded]);

  const level = Math.floor(data.xp / 100) + 1;
  const levelXp = data.xp % 100;
  const completed = data.quests.filter((quest) => quest.done).length;
  const totalXp = data.quests.reduce((sum, quest) => sum + quest.xp, 0);
  const earnedXp = data.quests.filter((quest) => quest.done).reduce((sum, quest) => sum + quest.xp, 0);
  const progress = data.quests.length ? (completed / data.quests.length) * 100 : 0;
  const boss = useMemo(() => data.quests.find((quest) => quest.kind === "main" && !quest.done), [data.quests]);

  function flash(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 1800);
  }

  function addQuest(event: FormEvent) {
    event.preventDefault();
    if (!input.trim()) return;
    setData((current) => ({ ...current, quests: [...splitQuest(input), ...current.quests] }));
    setInput("");
    flash("クエストを4段階に分解した");
  }

  function toggleQuest(id: string) {
    const quest = data.quests.find((item) => item.id === id);
    if (!quest) return;
    const nextDone = !quest.done;
    const nextQuests = data.quests.map((item) => item.id === id ? { ...item, done: nextDone } : item);
    const allDone = nextDone && nextQuests.every((item) => item.done);
    setData((current) => ({
      ...current,
      xp: Math.max(0, current.xp + (nextDone ? quest.xp : -quest.xp)),
      chests: current.chests + (allDone ? 1 : 0),
      quests: nextQuests,
    }));
    if (allDone) setShowAllDone(true);
    else flash(nextDone ? `+${quest.xp} XP　ナイス討伐` : `${quest.xp} XPを戻した`);
  }

  function openChest() {
    const rewards = ["伝説の5分休憩券", "コンボ保護シールド", "明日の自分に丸投げ券", "SSR：無敵の集中15分"];
    setReward(rewards[Math.floor(Math.random() * rewards.length)]);
    setData((current) => ({ ...current, chests: Math.max(0, current.chests - 1) }));
  }

  async function shareResult() {
    const text = `今日の人生RPG\n${completed}/${data.quests.length}クエスト討伐｜Lv.${level}｜${earnedXp}XP獲得\n#ドパクエ`;
    try {
      if (navigator.share) await navigator.share({ text });
      else await navigator.clipboard.writeText(text);
      flash("戦績をコピーした");
    } catch {
      // Share sheets can be dismissed intentionally.
    }
  }

  return (
    <main className="app-shell">
      <section className="phone-frame" aria-label="ドパクエ 今日のクエスト">
        <header className="topbar">
          <a className="brand" href="#top" aria-label="ドパクエ ホーム">
            <span className="brand-mark">D</span>
            <span>DOPA QUEST</span>
          </a>
          <button className="streak" type="button" onClick={() => flash("3日連続。今日は1個で継続確定")} aria-label="3日連続プレイ">
            <span aria-hidden="true">🔥</span> {data.streak}
          </button>
        </header>
        <p className="beta-note">公開β・登録不要・進捗はこの端末だけに保存</p>

        <div id="top" className="hero">
          <div className="level-row">
            <div>
              <p className="eyebrow">PLAYER LEVEL</p>
              <p className="level">LV. {level}</p>
            </div>
            <div className="xp-copy"><b>{levelXp}</b> / 100 XP</div>
          </div>
          <div className="xp-track" aria-label={`レベル進捗 ${levelXp}%`}><span style={{ width: `${levelXp}%` }} /></div>
          <div className="hero-copy">
            <p>{todayLabel} のミッション</p>
            <h1>脳が逃げる前に、<br /><em>1個だけ倒せ。</em></h1>
          </div>
        </div>

        <form className="quest-input" onSubmit={addQuest}>
          <label htmlFor="quest">やることを雑に投げる</label>
          <div>
            <input id="quest" value={input} onChange={(event) => setInput(event.target.value)} placeholder="例：部屋を片付ける" autoComplete="off" />
            <button type="submit" aria-label="クエスト化">クエスト化 <span aria-hidden="true">↗</span></button>
          </div>
          <p><span aria-hidden="true">✦</span> 内容に応じて「今すぐ動けるサイズ」へ分解</p>
        </form>

        <section className="quest-section" aria-labelledby="quest-title">
          <div className="section-head">
            <div>
              <p className="eyebrow">TODAY&apos;S RUN</p>
              <h2 id="quest-title">今日のクエスト</h2>
            </div>
            <span className="count">{completed} / {data.quests.length}</span>
          </div>

          {boss && (
            <div className="boss-banner">
              <span className="boss-icon" aria-hidden="true">👹</span>
              <div><small>NEXT BOSS</small><strong>{boss.title}</strong></div>
              <span className="boss-xp">+{boss.xp} XP</span>
            </div>
          )}

          <div className="quest-list">
            {data.quests.map((quest) => (
              <button className={`quest-card ${quest.done ? "done" : ""} ${quest.kind === "main" ? "main-quest" : ""}`} type="button" key={quest.id} onClick={() => toggleQuest(quest.id)} aria-pressed={quest.done}>
                <span className="check" aria-hidden="true">{quest.done ? "✓" : ""}</span>
                <span className="quest-copy"><strong>{quest.title}</strong><small>{quest.detail}</small></span>
                <span className="quest-xp">+{quest.xp}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="run-card" aria-label="本日の進捗">
          <div className="ring" style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}><span>{Math.round(progress)}<small>%</small></span></div>
          <div className="run-copy"><p className="eyebrow">RUN PROGRESS</p><strong>{completed ? "もう始まってる。勢いを切るな。" : "最初の1個がいちばん重い。"}</strong><span>{earnedXp} / {totalXp} XP 回収</span></div>
          <button type="button" className="share" onClick={shareResult} aria-label="戦績をシェア">↗</button>
        </section>

        <button className={`chest ${data.chests ? "ready" : ""}`} type="button" onClick={data.chests ? openChest : () => flash("全クエスト討伐で解放")}>
          <span aria-hidden="true">🎁</span>
          <span><strong>{data.chests ? "宝箱を開ける" : "デイリー宝箱"}</strong><small>{data.chests ? "報酬を受け取れる" : "全討伐でアンロック"}</small></span>
          <b>{data.chests || "LOCK"}</b>
        </button>

        <nav className="bottom-nav" aria-label="メインナビゲーション">
          <button className="active" type="button"><span aria-hidden="true">⚔</span>クエスト</button>
          <button type="button" onClick={() => flash("戦績画面は次版で解放")}><span aria-hidden="true">◫</span>戦績</button>
          <button type="button" onClick={() => flash("装備画面は次版で解放")}><span aria-hidden="true">♢</span>装備</button>
        </nav>
        <footer className="public-footer">
          <span>データ送信なし・localStorage保存</span>
          <a href="https://github.com/Regal753/dopagaki-quest/issues" target="_blank" rel="noreferrer">不具合を報告</a>
        </footer>
      </section>

      {toast && <div className="toast" role="status">{toast}</div>}
      {(showAllDone || reward) && (
        <div className="modal-backdrop" role="presentation" onClick={() => { setShowAllDone(false); setReward(null); }}>
          <div className="reward-modal" role="dialog" aria-modal="true" aria-labelledby="reward-title" onClick={(event) => event.stopPropagation()}>
            <span className="reward-burst" aria-hidden="true">{reward ? "SSR" : "CLEAR"}</span>
            <p className="eyebrow">DAILY REWARD</p>
            <h2 id="reward-title">{reward || "今日の自分に勝った。"}</h2>
            <p>{reward ? "装備コレクションに追加された。" : "宝箱を1個獲得。明日もゼロからじゃない。"}</p>
            <button type="button" onClick={() => { setShowAllDone(false); setReward(null); }}>{reward ? "装備する" : "受け取る"}</button>
          </div>
        </div>
      )}
    </main>
  );
}
