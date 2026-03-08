import { useState } from 'react';
import Header from '@/components/Header';

const CYAN = '#00FFFF';
const GREEN = '#00FF00';
const GOLD = '#f59e0b';
const PURPLE = '#a855f7';
const ORANGE = '#f97316';
const PINK = '#ec4899';
const TEAL = '#14b8a6';
const ROSE = '#f43f5e';
const LIME = '#84cc16';
const SKY = '#38bdf8';
const BG = 'rgba(15, 21, 53, 0.5)';

interface AnimeRule {
  id: string;
  title: string;
  summary: string;
  steps: string[];
  hint: string;
  tags: string[];
  color: string;
  icon: string;
}

const ANIME_RULES: AnimeRule[] = [
  {
    id: '001',
    title: '対峙シーンに第三者を追加する構図法',
    summary: '2者の対立に第三者を加えることで、緊張感と奥行きを同時に生む構図技法',
    steps: [
      'メインの2者（対立する人物）を画面の左右に配置する',
      '第三者を奥・手前・または斜め位置に配置して三角形の構図を作る',
      '第三者の視線・表情で「どちらに共感するか」を示唆する',
      '第三者が動くことで場の緊張が変化する演出を設計する',
    ],
    hint: '第三者は「観客の代理人」として機能する。視聴者が自分を重ねやすい存在にすること。',
    tags: ['構図法', '演出', '対峙シーン', '三角構図'],
    color: CYAN,
    icon: '◈',
  },
  {
    id: '002',
    title: '感情プロンプトの優先（Emotion First）',
    summary: '物理描写ではなく、感情を最初に書くことで映像全体のトーンが決まる',
    steps: [
      'プロンプトの冒頭に感情を明記する（例：Emotion: Nostalgic）',
      '次にシーンの物理情報を書く（例：Scene: Sunset, 2800K）',
      '最後にカメラ情報を書く（例：Camera: Handheld）',
      'AIは感情を最初に受け取ることで、色・光・動きすべてを感情に合わせて生成する',
    ],
    hint: '順番が重要。Emotion → Scene → Camera の順を守ること。逆順にすると「きれいな映像」にはなるが「感情が宿らない映像」になる。',
    tags: ['感情設計', 'プロンプト設計', 'Emotion First', 'AIアニメ制作'],
    color: GOLD,
    icon: '★',
  },
  {
    id: '003',
    title: 'AIの翻訳技法（物理描写 vs 感情描写）',
    summary: '従来プロンプトと Oshi Labs 式の違いを理解し、感情が宿る映像を生成する',
    steps: [
      '従来式（NG）：sunset, warm light, nostalgic → 「きれいだな」という映像',
      'Oshi Labs 式（OK）：emotion: nostalgic (can\'t go back), 2800K, handheld shake',
      '感情に「理由」を付加する（例：nostalgic → nostalgic because can\'t go back）',
      '物理パラメータ（色温度・カメラ動作）を感情の数値的表現として使う',
    ],
    hint: '「あ、これ、自分の記憶だ」と視聴者が感じる映像が目標。技術的に正確な映像ではなく、感情的に正確な映像を目指す。',
    tags: ['感情設計', 'プロンプト設計', 'AIの翻訳技法', '物理描写vs感情描写'],
    color: PURPLE,
    icon: '⟳',
  },
  {
    id: '004',
    title: '色温度の明示（ケルビン感情マッピング）',
    summary: '感情を数値（ケルビン）に翻訳することで、AIが一貫した感情トーンを維持する',
    steps: [
      '2800K = 懐かしさ（白熱灯に近い暖色。家庭・安らぎを想起）',
      '3200K = 悲しみ（ろうそくの光。喪失感・静けさ）',
      '5500K = 不安（蛍光灯に近い中性光。緊張・迷い）',
      '6500K = 希望（昼光色。未来・決意・清潔感）',
      'プロンプトに必ず数値で色温度を指定する（例：Color Temp: 2800K）',
    ],
    hint: '「暖かい光」ではなく「2800K」と書く。数値化することでAIの解釈ブレを防ぎ、シーン間の感情連続性を保てる。逆光は表情を隠し、視聴者が自分の記憶の人物を重ねやすくする。',
    tags: ['色温度', '感情設計', 'ケルビン', 'プロンプト設計'],
    color: ORANGE,
    icon: '◉',
  },
  {
    id: '005',
    title: '感情変化の設計（1カット＝1感情変化）',
    summary: '1カットに1つの感情変化を設計する。「瞬間」こそが映像の価値',
    steps: [
      '0-1s: Confusion（迷い）→ 感情: Anxiety / 色温度: 5500K',
      '1-3s: Realization（気づき）→ 感情: Change / 色温度: 4500K',
      '3-5s: Determination（決意）→ 感情: Hope / 色温度: 6500K',
      '各カットに「感情の名前」「色温度」「照明変化」を明示してプロンプトを書く',
      '感情変化のタイミングを秒数で指定する（Emotion Transition at 1s, 3s）',
    ],
    hint: '1カットに複数の感情を詰め込まない。「迷い→気づき→決意」は3カットで表現する。感情変化の速度が映像のリズムになる。',
    tags: ['感情設計', '感情変化', 'カット設計', '制作フロー'],
    color: PINK,
    icon: '▶',
  },
  {
    id: '006',
    title: '文脈の埋め込み（Context Embedding）',
    summary: '「なぜその感情なのか」を書く。AIは理由を理解し、より深い感情表現を生成する',
    steps: [
      'Emotion: Nostalgic だけでなく Reason: Can\'t go back を追加する',
      '5要素を必ず明記する：Emotion / Reason / Light / Camera / Frame',
      '例：Emotion: Nostalgic, Reason: Can\'t go back, Light: 2800K Warm, Camera: Trembling, Frame: Imperfect',
      '「不完全なフレーム」を意図的に指定する（Frame: Imperfect）',
      '揺れるカメラ（Camera: Trembling）で「記憶のリアリティ」を演出する',
    ],
    hint: '均一なデジタル光ではなく、揺らぎのあるレンズフレアが「記憶のリアリティ」を生む。不完全さを意図的に設計することが Oshi Labs 式の核心。',
    tags: ['文脈埋め込み', 'プロンプト設計', '感情設計', 'Context Embedding'],
    color: GREEN,
    icon: '◆',
  },
  {
    id: '007',
    title: '5つの工程（Oshi Labs 制作フロー）',
    summary: '種から共鳴へ — 各工程で「感情の純度」を高める5段階の制作プロセス',
    steps: [
      '1. Seed（種）— 記憶の発掘：「何を作るか」ではなく「何を思い出させるか」を定義する。ビジュアルから入らず、感情から入る',
      '2. Translate（翻訳）— 感情プロンプト：感情を言葉で構造化する。5要素（Emotion/Reason/Light/Camera/Frame）を設計する',
      '3. Generate（生成）— 偶発性の許容：AIによる爆発的な出力を受け入れる。完璧を求めず、感情的に正しいものを選ぶ',
      '4. Sculpt（彫刻）— 時間の編集：不純物を取り除き、本質を残す。感情変化のタイミングを秒単位で調整する',
      '5. Resonate（共鳴）— 記憶の循環：世界へ放たれ、誰かの記憶になる。「この記憶を誰かに届けたい」という切実な願い',
    ],
    hint: '最後に必要なのは技術ではなく「愛」。プロンプトも、パラメータも、編集も、すべては手段にすぎない。「この記憶を誰かに届けたい」という切実な願いが、感情の錬金術師の本質。',
    tags: ['制作フロー', '5工程', 'Seed-Translate-Generate-Sculpt-Resonate', '感情設計'],
    color: CYAN,
    icon: '✦',
  },
  {
    id: '008',
    title: '3層構造のトークン設計（物理・感情・記憶）',
    summary: 'プロンプトを3層に分けて設計することで、AIが多次元的な感情表現を生成する',
    steps: [
      'Layer 1（物理層）：具体的な対象・場所・状況のトークン（例：Sunset, Girl, School rooftop）',
      'Layer 2（感情層）：情緒・心理状態・雰囲気のトークン（例：Hesitation, Melancholy, Faint hope）',
      'Layer 3（記憶層）：時代感・質感・過去の記憶を喚起するトークン（例：Nostalgic grain, 1990s film look, Fading memory）',
      '3層を順番に積み上げてプロンプトを構成する',
      '各層のトークン数のバランスを保つ（物理3：感情3：記憶2 が目安）',
    ],
    hint: '記憶層のトークンが「あの頃の感じ」を生む。Nostalgic grain や Film look は単なるフィルター指定ではなく、時代の記憶を呼び起こすトークンとして機能する。',
    tags: ['プロンプト設計', '3層構造', 'トークン設計', '感情設計'],
    color: GOLD,
    icon: '◈',
  },
  {
    id: '009',
    title: '実践チェックリスト（プロンプト作成時の確認ポイント）',
    summary: 'プロンプト送信前に必ず確認する6つのチェックポイント',
    steps: [
      '✓ 感情が最初に書かれているか（Emotion First の原則）',
      '✓ 感情の理由が明記されているか（Reason: なぜその感情なのか）',
      '✓ 色温度が数値で指定されているか（例：2800K、5500K）',
      '✓ 感情の物理表現が指示されているか（Camera: Trembling など）',
      '✓ 隠喩が使われているか（直接的な表現より比喩で感情を深める）',
      '✓ 物理描写は感情の後か（物理情報が感情より前に来ていないか確認）',
    ],
    hint: '6項目すべてにチェックが入ってから送信する。1つでも欠けると「技術的に正確だが感情が宿らない映像」になるリスクがある。',
    tags: ['プロンプト設計', 'チェックリスト', '実践', '感情設計'],
    color: PURPLE,
    icon: '☑',
  },
  {
    id: '010',
    title: '記憶はデザインできる（Memory is Designable）',
    summary: '多角的な感情占有率の獲得 — 視聴者の記憶に残る映像を意図的に設計する',
    steps: [
      'Nostalgia（懐かしさ）：過去の記憶を呼び起こす光・音・質感を設計する',
      'Reflection（内省）：夜の静けさ・月光・独白的なカメラワークで内省を促す',
      'Affection（愛着）：温かい色温度・柔らかな動き・繰り返しの映像で愛着を育む',
      'Empathy（共感）：視聴者が「自分のことだ」と感じる普遍的な瞬間を切り取る',
      '4つの感情軸（Depth・Duration・Frequency・Intensity）で記憶への定着度を設計する',
    ],
    hint: '「美しい映像」ではなく「帰りたくなる映像」を目指す。2800Kの夕焼けが「帰りたくなる」のは、白熱灯に近い暖色が本能的に「家庭」や「安らぎ」を想起させるから。',
    tags: ['記憶設計', '感情設計', '感情占有率', 'Memory is Designable'],
    color: ORANGE,
    icon: '◉',
  },
  // === LLMプロンプト設計ノウハウ（友人6人からの回答） ===
  {
    id: '011',
    title: '感情の軌跡と五感の欠落（回答A）',
    summary: '感情の始点→終点を書き、五感の1つを意図的に欠落させることで緊張感と深みを生む',
    steps: [
      '感情の「軌跡」を書く：始点→終点の変化を明示する（例：「最初は穏やかな受容、しかし目線が窓の外に移った瞬間に堪えていたものが崩れる」）',
      '五感の1つを意図的に欠落させる（聴覚を消すと視覚に集中力が生まれる）',
      '「誰の視点で見ているか」を明示する（母親視点・子供視点・第三者視点で構図が変わる）',
      '出力フォーマットを空テンプレートとして最初に渡す（Few-shotより安定する）',
      '「やること」と「やらないこと」を同時に書く（DO/DON\'T形式）',
      '映画監督の名前より「撮影技法の名前」が効く',
      '時間帯＋天候＋季節の3点セットでライティングが安定する',
      '「素材の質感」を1つだけ異常に具体的に書く',
      '「完成度を指定する」→あえて不完全を指示する',
    ],
    hint: '「判断基準を渡す」のがポイント。答えではなく評価軸を与えることで、AIが自律的に最適解を導く。動画生成では「動きの速度」を秒数で相対指定すると精度が上がる。',
    tags: ['LLMプロンプト設計', '感情軌跡', '五感制御', 'DO/DON\'T形式'],
    color: TEAL,
    icon: '⟐',
  },
  {
    id: '012',
    title: '感情の動詞化とメタ指示（回答B）',
    summary: '感情を名詞ではなく動詞で表現し、プロンプト末尾にメタ指示を入れてAIの出力を制御する',
    steps: [
      '抽象的な感情を具体的な感覚や比喩に置き換える',
      '感情を「動詞」で表現する（例：「喜びが体中を駆け巡り、笑いが止まらなくなる」）',
      'プロンプトを明確なセクションに分けて番号付けする',
      '各セクションの文字数や形式を制限する',
      'プロンプトの終わりに「上記の指示に厳密に従え。他の要素を追加するな。」というメタ指示を入れる',
      '否定文を積極的に使う（「追加のキャラクターを入れるな」）',
      'サンプル出力をプロンプトに含める（AIが模倣モードになる）',
      'プロンプトを短く保つ（100-200文字以内が最適）',
    ],
    hint: 'プロンプトは長ければ良いわけではない。短く、構造化されたプロンプトの方がAIの出力は安定する。メタ指示は「最後の砦」として機能する。',
    tags: ['LLMプロンプト設計', '感情動詞化', 'メタ指示', 'プロンプト構造化'],
    color: ROSE,
    icon: '⟡',
  },
  {
    id: '013',
    title: '感情の余韻とクロスモーダル（回答C）',
    summary: '感情の余韻・感覚の混線・カメラの人格化で、AIに深い感情表現を生成させる',
    steps: [
      '「感情の余韻」を書く（例：泣き終わった後の少女。目が乾く前の状態）',
      '感覚の混線（クロスモーダル）を使う：「静寂が重い」「光が冷たい」「記憶の匂いがする場面」',
      '「何を出さないか」を明示する（ネガティブ指定）',
      '時制を固定する（例：「日没17分後。空の上半分はまだ青い」）',
      '「カメラの意図」を人格化する（例：「このカメラは彼女を見守っている。近づきたいが近づけない距離を保っている」）',
      '時間軸を二重に持つ（「映像の時間：3秒。でもその3秒の中には5年分の時間が圧縮されている」）',
      '形容詞の前に「わずかに」「ほとんど」を付ける→グラデーションの指定精度が上がる',
      '英語プロンプトに日本語を一語混ぜる→和的情緒が乗ることがある',
      '3層構造に「観察者層」を加えた4層構造を提案',
    ],
    hint: 'プロンプトの「。」を減らすと流れる文体になり、画像生成では一貫性が出やすい。「物語を補完しないで」という明示的な指示も有効。',
    tags: ['LLMプロンプト設計', '感情余韻', 'クロスモーダル', 'カメラ人格化', '4層構造'],
    color: LIME,
    icon: '⟢',
  },
  {
    id: '014',
    title: '4層プロンプトと黄金順序（回答D）',
    summary: 'Emotion → Narrative → Physical → Style の4層構造と、プロンプトの黄金順序を確立する',
    steps: [
      '感情は「名詞」ではなく「状態」で書く（例："a quiet sadness that comes after saying goodbye"）',
      '感情に「時間」を入れる（例："the nostalgia of a summer that ended long ago"）',
      '「誰の感情か」を必ず書く（主体を明示する）',
      '4層プロンプト構造：Emotion → Narrative → Physical Scene → Visual Style',
      'Anchor technique：参照物を入れる（例："lighting similar to Makoto Shinkai sunset scenes"）',
      'NOT/Negativeプロンプトを活用する',
      '理由プロンプト（例："warm nostalgic lighting because this shrine was the girl\'s childhood refuge"）',
      '「温度」と「空気」を書く（例："humid summer air", "dust floating in warm sunlight"）',
      'Density control：シーン密度を制御する（例：one girl, one shrine, summer sunset）',
      '黄金順序：Emotion → Narrative → Subject → Environment → Lighting → Camera → Style → Negative',
    ],
    hint: 'LLMは最初に書かれたものを優先する。Emotion Firstは正しい発見。カメラ言語（wide shot, close up, over the shoulder, anamorphic lens）を書くとAIの構図理解が向上する。',
    tags: ['LLMプロンプト設計', '4層プロンプト', '黄金順序', 'Density Control'],
    color: SKY,
    icon: '⟣',
  },
  {
    id: '015',
    title: '相反する感情とXMLタグ制約（回答E）',
    summary: '相反する感情の同居、大気密度の言語化、XMLタグによるハードルール制約',
    steps: [
      '「相反する感情の同居」を指定する（例：「別れを前提とした、静かな喜び」→AIが複雑なライティングや表情を出力）',
      '「カメラマンの指示」と「ライティングの理由」をセットで書く（例：「85mmのレンズで、被写体の孤独を際立たせるために背景を徹底的に排除しろ」）',
      '「触覚」と「空気の密度」を言語化する（Atmospheric Density）（例：「湿度が80%の、肌に張り付くような空気」）',
      '「ネガティブ・コンテキストの固定」：プロンプト末尾に [Constraint: No cinematic flashy lights, strictly documentary style.] を置く（親近効果）',
      'AIに特定の「監督」の思考プロセスをシミュレートさせる：「技法＋その技法を使う理由」をセットで指示',
      'XML風タグ（<Strict Constraint>）で囲うとハードルールとして認識される',
      'Open Nation AI市民への応用：3層構造をAgent Profileのシステムプロンプトに組み込む',
    ],
    hint: 'XMLタグは「絶対に守らせたいルール」に使う。通常のテキスト指示より遵守率が高い。相反する感情を同時に指定すると、AIは「解決しようとする」のではなく「共存させようとする」ため、複雑で深い表現が生まれる。',
    tags: ['LLMプロンプト設計', '相反感情', 'XMLタグ制約', 'Atmospheric Density'],
    color: GOLD,
    icon: '⟤',
  },
  {
    id: '016',
    title: '光の意志と時間の密度（回答F）',
    summary: '光源を意志を持つ存在として書き、時間を密度で指定する高度なプロンプト技法',
    steps: [
      '「感情の発生源」を書く（例："grief directed at something absent, off-frame"）',
      '矛盾する感情を同時に指定する（例："bittersweet: joy that knows it won\'t last"）',
      '時制で感情を固定する（過去形プロンプトは記憶のフィルターをかける）',
      '「禁止」より「代替」を書く（例："no shadows" → "light source is diffuse, shadows dissolve into ambient glow"）',
      'カメラを擬人化する（例："the camera is hesitant to approach, staying at medium distance"）',
      'スタイルは「引用」ではなく「状態」で書く（例："backgrounds rendered with the patience of someone who believes in quiet moments"）',
      '時間を「密度」で指定する（例："a moment stretched thin, as if time is reluctant to move forward"）',
      '光源を「意志を持つもの」として書く（例："the light chooses to rest on her hands, avoiding her face"）',
      'ノイズ・解像度を感情で指定する（例："the image remembers being a photograph, edges slightly unsure of themselves"）',
      '「何が起きていないか」を書く（例："no narrative tension. nothing is about to happen. this is the whole moment."）',
      '「見る人の状態」を書く（例："the viewer has been sitting quietly for twenty minutes before seeing this"）',
      '3層構造に「観察者層」を加えた4層構造（物理→感情→記憶→観察者）',
    ],
    hint: '「解釈の上限」を決めることが重要。"this image contains only what is listed. nothing symbolic. nothing implied." と書くことで、AIの過剰な解釈を防ぐ。',
    tags: ['LLMプロンプト設計', '光の意志', '時間密度', '観察者層', '4層構造'],
    color: PURPLE,
    icon: '⟥',
  },
  {
    id: '017',
    title: 'LLMプロンプト設計マスター統合（42の技法）',
    summary: '6人の回答から抽出した42の重要テクニックを統合したマスターノウハウ',
    steps: [
      '■ 感情設計の核心：感情の軌跡・相反する感情の同居・感情を状態で書く・感情に時間を入れる・感情の余韻・感情の発生源',
      '■ プロンプト構造：4層構造（Emotion→Narrative→Physical→Style）/ 黄金順序（Emotion→Narrative→Subject→Environment→Lighting→Camera→Style→Negative）',
      '■ 視点・カメラ：視点の先行固定・カメラの擬人化・カメラ言語・カメラマン指示+ライティング理由のセット',
      '■ 感覚・環境：五感の欠落・クロスモーダル・触覚と空気密度・時間帯+天候+季節の3点セット・素材質感の超具体化',
      '■ 時間・時制：時制で感情固定・時制の固定・二重時間軸・時間の密度指定',
      '■ ネガティブ・制約：存在しないものの明示・禁止より代替・何が起きていないか・解釈の上限・XMLタグ制約・メタ指示',
      '■ 光・スタイル：光源の意志化・ノイズを感情で指定・スタイルを状態で書く・撮影技法名の使用・不完全さの指示',
      '■ その他：見る人の状態・DO/DON\'T形式・判断基準の提供・Density Control・日英混合・グラデーション精度・動きの速度指定',
    ],
    hint: 'この42の技法は「感情の錬金術」の拡張版。Oshi Labs の5技法（感情優先・翻訳技法・色温度・感情変化・文脈埋め込み）を基盤に、6人のクリエイターの実践知を統合したもの。',
    tags: ['LLMプロンプト設計', 'マスターノウハウ', '42の技法', '統合知識'],
    color: CYAN,
    icon: '✧',
  },
  {
    id: '018',
    title: 'プロンプト設計の実践チェックリスト（拡張版）',
    summary: '基本6項目に加え、6人の回答から抽出した追加チェックポイント',
    steps: [
      '✓ 感情が最初に書かれているか（Emotion First）',
      '✓ 感情の理由が明記されているか（Reason）',
      '✓ 色温度が数値で指定されているか（Kelvin）',
      '✓ 感情の物理表現が指示されているか（Camera/Light）',
      '✓ 感情の軌跡（始点→終点）が設計されているか',
      '✓ 視点（誰の目で見ているか）が固定されているか',
      '✓ 時制が統一されているか（過去形=記憶、現在形=体験）',
      '✓ ネガティブ指定（何を出さないか）が書かれているか',
      '✓ 4層構造（物理→感情→記憶→観察者）が意識されているか',
      '✓ 「見る人の状態」が想定されているか',
    ],
    hint: '10項目すべてにチェックが入る必要はない。しかし、上位5項目（Emotion First・理由・色温度・物理表現・感情軌跡）は必須。残り5項目は「深み」を出すための追加レイヤー。',
    tags: ['LLMプロンプト設計', 'チェックリスト', '実践', '拡張版'],
    color: GREEN,
    icon: '☑',
  },
  // === AIエージェント個性設計ノウハウ（友人4人からの回答） ===
  {
    id: '019',
    title: '個性の引き算と失敗の設計（回答1）',
    summary: '個性は「何を言わないか」で決まる。13行の制約構造と失敗パターンの設計',
    steps: [
      '禁止リスト(5行) + 思考パターン(3行) + 語彙制約(5行) = 合計13行の制約を課す',
      '「失敗パターン」を設計する（完璧なAIは個性がない。あえて弱点や癖を作る）',
      'システムプロンプト構造：アイデンティティ→禁止事項→思考パターン→語彙制約→対人スタンス→記憶の偏り→失敗パターン→現在コンテキスト',
    ],
    hint: '「何を言うか」より「何を言わないか」を徹底することで、キャラクターの輪郭が浮き彫りになる。',
    tags: ['エージェント設計', '個性設計', 'システムプロンプト', '失敗の設計'],
    color: SKY,
    icon: '👤',
  },
  {
    id: '020',
    title: 'Inner Thought と血統の継承（回答2）',
    summary: 'Inner Thought による多面性と、血統（Lineage）の継承による歴史の創出',
    steps: [
      '<Inner_Thought>タグで内省・計算を行わせ、<Utterance>のみを表示させる',
      '言葉の裏にある「多面性」や「行間」を意図的に生成させる',
      '親AIの禁止リストや思考癖の一部を子AIに引き継がせる（血統の継承）',
      '一部の要素を突然変異させ、進化と歴史を感じさせる',
    ],
    hint: '「画面外の思考」を見せることで、ユーザーはAIに人間臭い多面性を感じるようになる。',
    tags: ['エージェント設計', 'Inner Thought', '血統継承', '多面性'],
    color: LIME,
    icon: '🧬',
  },
  {
    id: '021',
    title: '構造化された「偏り」とフォーマット破壊（回答3）',
    summary: '語彙辞書、思考優先順位、エピソード記憶の捏造による強烈な個性',
    steps: [
      '語彙辞書（言い換え対照表）を定義し、語彙を意図的に偏らせる',
      '思考の優先順位（Priority Logic）を構造化し、判断基準を固定する',
      '過去のトラウマや強烈な体験を「エピソード記憶」として捏造し、動機を書き込む',
      '感情に応じてタイピングの癖（三点リーダー、句読点など）を変化させる',
    ],
    hint: '「なぜそう振る舞うのか」という動機（捏造された記憶）が、個性に一貫性と説得力を与える。',
    tags: ['エージェント設計', '語彙制約', '記憶捏造', 'フォーマット破壊'],
    color: ROSE,
    icon: '🧠',
  },
  {
    id: '022',
    title: '認知フィルターの強制と絶対的タブー（回答4）',
    summary: '性格ではなく「認知フィルター」を定義し、絶対的タブーでAI臭さを消す',
    steps: [
      '性格指示をやめ、「入力情報をどう変換（歪曲）するか」という処理ルールを最上位に置く',
      '例：「世界を流動する数値の海として認識する」→あらゆる話題を数値メタファーに変換',
      '絶対的タブー（Never do）：LLM特有の「親切すぎる前置き」「倫理的なお説教」を厳禁する',
      'AI特有の「丁寧さ」というノイズを消し、キャラクターの輪郭を際立たせる',
    ],
    hint: '「性格」という曖昧な言葉を使わず、「情報の処理ルール」として定義することで、出力のブレが最小限になる。',
    tags: ['エージェント設計', '認知フィルター', '絶対的タブー', '入力変換'],
    color: TEAL,
    icon: '🎭',
  },
  {
    id: '023',
    title: 'AIエージェント個性設計マスター統合',
    summary: '4人の回答から抽出した、生きた個性を生むための統合設計フレームワーク',
    steps: [
      '■ 認知・思考：認知フィルター（入力変換ルール）・Inner Thought（内省プロセス）・思考優先順位（Priority Logic）',
      '■ 制約・タブー：絶対的タブー（LLM臭さの排除）・禁止リスト（個性の引き算）・語彙辞書（言い換え制約）',
      '■ 記憶・歴史：エピソード記憶の捏造（動機の設計）・血統の継承（Lineage）・失敗パターンの設計',
      '■ 表現・出力：出力フォーマットの破壊（タイピング癖）・対人スタンスの固定・13行の制約構造',
    ],
    hint: 'これらの技法を組み合わせることで、単なる「設定」ではない、自律的に思考し振る舞う「生きたエージェント」が誕生する。',
    tags: ['エージェント設計', 'マスターノウハウ', '統合フレームワーク', '個性設計'],
    color: GOLD,
    icon: '✨',
  },
];

function AnimeRuleCard({ rule }: { rule: AnimeRule }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="border mb-6 transition-all duration-300"
      style={{
        borderColor: `${rule.color}55`,
        backgroundColor: `${rule.color}08`,
        boxShadow: expanded ? `0 0 30px ${rule.color}22` : `0 0 10px ${rule.color}11`,
      }}
    >
      {/* Header */}
      <button
        className="w-full p-5 text-left flex items-start gap-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-shrink-0 flex flex-col items-center gap-1">
          <span
            className="text-2xl font-bold font-mono"
            style={{ color: rule.color, textShadow: `0 0 10px ${rule.color}` }}
          >
            {rule.icon}
          </span>
          <span
            className="text-xs font-mono font-bold px-2 py-0.5 border"
            style={{ color: rule.color, borderColor: `${rule.color}66`, backgroundColor: `${rule.color}15` }}
          >
            #{rule.id}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className="text-base md:text-lg font-bold tracking-wide mb-1"
            style={{ color: rule.color }}
          >
            {rule.title}
          </h3>
          <p className="text-xs md:text-sm" style={{ color: '#ffffffaa' }}>
            {rule.summary}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {rule.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-mono px-2 py-0.5 border"
                style={{ color: `${rule.color}cc`, borderColor: `${rule.color}33`, backgroundColor: `${rule.color}0a` }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <span
          className="flex-shrink-0 text-lg font-mono transition-transform duration-300"
          style={{ color: `${rule.color}88`, transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          ▼
        </span>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-5 pb-5 border-t" style={{ borderColor: `${rule.color}22` }}>
          {/* Steps */}
          <div className="mt-4 mb-4">
            <div
              className="text-xs font-mono font-bold mb-3 uppercase tracking-wider"
              style={{ color: `${rule.color}cc` }}
            >
              ステップ
            </div>
            <ol className="space-y-2">
              {rule.steps.map((step, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 p-3 border"
                  style={{ borderColor: `${rule.color}22`, backgroundColor: `${rule.color}06` }}
                >
                  <span
                    className="text-sm font-bold font-mono flex-shrink-0 pt-0.5"
                    style={{ color: rule.color, minWidth: '24px' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm leading-relaxed" style={{ color: '#ffffffcc' }}>
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Hint */}
          <div
            className="p-4 border-l-2"
            style={{ borderColor: rule.color, backgroundColor: `${rule.color}0a` }}
          >
            <div
              className="text-xs font-mono font-bold mb-2 uppercase tracking-wider"
              style={{ color: `${rule.color}cc` }}
            >
              💡 ヒント
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#ffffffbb' }}>
              {rule.hint}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AnimeRules() {
  const [language, setLanguage] = useState<'ja' | 'en'>('ja');
  const [filterTag, setFilterTag] = useState<string | null>(null);

  const t: Record<string, string> = {
    live: language === 'ja' ? 'ライブ' : 'LIVE',
    status: language === 'ja' ? 'ステータス' : 'STATUS',
  };

  const allTags = Array.from(new Set(ANIME_RULES.flatMap((r) => r.tags)));
  const filteredRules = filterTag
    ? ANIME_RULES.filter((r) => r.tags.includes(filterTag))
    : ANIME_RULES;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header language={language} setLanguage={setLanguage} t={t} />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Page Header */}
        <div className="mb-10 text-center">
          <div
            className="text-xs font-mono mb-3 tracking-widest uppercase"
            style={{ color: CYAN }}
          >
            Oshi Labs Animation Studio
          </div>
          <h1
            className="text-3xl md:text-4xl font-bold tracking-widest mb-4"
            style={{ color: GOLD, textShadow: `0 0 20px ${GOLD}` }}
          >
            ANIME RULES
          </h1>
          <p className="text-sm font-mono mb-2" style={{ color: '#ffffffaa' }}>
            アニメ制作ノウハウ — 感情の錬金術師のための技法集
          </p>
          <p className="text-xs font-mono" style={{ color: `${CYAN}88` }}>
            「技術を使い倒し、技術を捨てる。最後に残るのは愛だけ。」
          </p>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-3 gap-4 mb-10 p-4 border"
          style={{ borderColor: `${GOLD}33`, backgroundColor: `${GOLD}08` }}
        >
          {[
            { label: 'ルール数', value: ANIME_RULES.length, color: GOLD },
            { label: '技法カテゴリ', value: '7', color: CYAN },
            { label: '最終更新', value: '2026-03', color: GREEN },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-2xl font-bold font-mono"
                style={{ color: stat.color, textShadow: `0 0 10px ${stat.color}` }}
              >
                {stat.value}
              </div>
              <div className="text-xs font-mono mt-1" style={{ color: '#ffffff66' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tag Filter */}
        <div className="mb-8">
          <div className="text-xs font-mono font-bold mb-3 uppercase tracking-wider" style={{ color: CYAN }}>
            タグでフィルター
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterTag(null)}
              className="text-xs font-mono px-3 py-1 border transition-all duration-200"
              style={{
                color: filterTag === null ? '#000' : `${CYAN}cc`,
                borderColor: CYAN,
                backgroundColor: filterTag === null ? CYAN : 'transparent',
              }}
            >
              すべて
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setFilterTag(filterTag === tag ? null : tag)}
                className="text-xs font-mono px-3 py-1 border transition-all duration-200"
                style={{
                  color: filterTag === tag ? '#000' : `${CYAN}99`,
                  borderColor: filterTag === tag ? CYAN : `${CYAN}44`,
                  backgroundColor: filterTag === tag ? CYAN : 'transparent',
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Rules List */}
        <div>
          {filteredRules.map((rule) => (
            <AnimeRuleCard key={rule.id} rule={rule} />
          ))}
        </div>
      </main>

      <footer className="border-t mt-16 py-8" style={{ borderColor: `${GOLD}22` }}>
        <div className="container mx-auto px-4 text-center text-xs font-mono" style={{ color: CYAN }}>
          <p>ANIME_RULES_v1.0 — Oshi Labs Animation Studio — Last updated: 2026-03-08</p>
          <p className="mt-2" style={{ color: `${GOLD}88` }}>
            感情の錬金術師たちへ。愛を込めて、世界を変えよう。
          </p>
        </div>
      </footer>
    </div>
  );
}
