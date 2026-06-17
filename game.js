// ==========================================
//  枫泾小掌柜·时光信箱 - 前置引导阶段
//  Phaser.js 3.x | 750×1334 竖屏 | 画框视角
// ==========================================

const W = 750, H = 1334;
const urlParams = new URLSearchParams(window.location.search);
const SRC = urlParams.get('src') || 'guzhen';

// ---- 表情 → 立绘文件映射 ----
const EMOTION_MAP = {
    curious:   '阿杏嘘.png',
    happy:     '阿杏开心.png',
    confused:  '阿杏迷惑.png',
    blank:     '阿杏抬头.png',
    recall:    '阿杏回忆.png',
    pleading:  '阿杏害羞.png',
    panic:     '阿杏侧身.png',
    shy:       '阿杏害羞.png',
    stunned:   '阿杏正面.png',
    serious:   '阿杏正面.png',
    lookback:  '阿杏回望.png',
    default:   '阿杏正面.png',
};

const ASSETS = 'assets/images/';
const MAP_GUIDES = {
    guzhen: '从枫泾古镇牌楼出发，穿过青石板路，\n步行约5分钟即可到达南镇。',
    lego:   '从乐高乐园正门出发，乘车前往南镇，\n约15分钟即可到达。',
};

// ==========================================
//  对话树
// ==========================================
const DIALOG_TREE = {

    // ===== 开篇 =====
    opening: {
        type: 'text', speaker: '', emotion: null,
        text: '一封泛黄的信封从邮箱口露出……',
        background: 'mailbox', next: 'envelope',
    },
    envelope: {
        type: 'text', speaker: '', emotion: null,
        text: '信封轻轻滑入信箱深处。\n你眼角的余光扫到旁边站着一个人。',
        background: 'street', next: 'first_choice',
        showCharacter: 'curious',
    },

    // ===== 第一次分支 =====
    first_choice: {
        type: 'choice',
        prompt: '一个短发女孩站在邮筒旁，圆脸上挂着好奇。',
        choices: [
            { label: '问她在这里干什么', next: 'ask_1' },
            { label: '让她赶紧离开', next: 'leave_1' },
        ],
    },

    // ===== Ask 路线 =====
    ask_1:  { type: 'text', speaker: '阿杏·好奇', emotion: 'curious',   text: '嘘——我在躲猫猫！', next: 'ask_2' },
    ask_2:  { type: 'text', speaker: '阿杏·好奇', emotion: 'curious',   text: '咦，你是谁呀？', next: 'nickname_input' },
    nickname_input: { type: 'input', next: 'ask_3' },
    ask_3:  { type: 'text', speaker: '阿杏·开心', emotion: 'happy',     text: '好好听的名字！我叫阿杏！', next: 'ask_4' },
    ask_4:  { type: 'text', speaker: '阿杏·困惑', emotion: 'confused', text: '他们都没来找我……这里是哪里呀？', next: 'location_choice' },

    // ===== 地点选择 =====
    location_choice: {
        type: 'choice',
        prompt: '阿杏困惑地看着四周。',
        choices: [
            { label: '这里是枫泾古镇牌楼', next: 'guzhen_map' },
            { label: '这里是乐高乐园', next: 'lego_map' },
        ],
    },

    // 地图展示
    guzhen_map: { type: 'map', area: 'guzhen', next: 'guzhen_1' },
    lego_map:   { type: 'map', area: 'lego',   next: 'lego_1' },

    // 古镇路线
    guzhen_1: { type: 'text', speaker: '阿杏·回忆', emotion: 'recall',    text: '我明明在南镇玩躲猫猫的呀……长着青苔的那条巷子里……', next: 'guzhen_2' },
    guzhen_2: { type: 'text', speaker: '阿杏·求助', emotion: 'pleading',  text: '你能带我回南镇吗？', next: 'merge' },

    // 乐高路线 — 背景切换为乐高环境
    lego_1: { type: 'text', speaker: '阿杏·茫然',  emotion: 'blank',   text: '乐高……乐园？', next: 'lego_2', background: 'lego' },
    lego_2: { type: 'text', speaker: '阿杏·茫然',  emotion: 'blank',   text: '我没听说过这个地方……我只记得南镇……', next: 'lego_3', background: 'lego' },
    lego_3: { type: 'text', speaker: '阿杏·茫然',  emotion: 'blank',   text: '[name]，我不记得怎么走到这里来的了……', next: 'lego_4', background: 'lego' },
    lego_4: { type: 'text', speaker: '阿杏·认真',  emotion: 'serious', text: '我好像是应该在四点前到南镇那边去的……', next: 'lego_5', background: 'lego' },
    lego_5: { type: 'text', speaker: '阿杏·认真',  emotion: 'serious', text: '[name]，现在几点了？来得及吗？', next: 'merge', background: 'lego' },

    // ===== Leave 路线 =====
    leave_1: { type: 'text', speaker: '阿杏·愣住', emotion: 'stunned',  text: '等、等一下——', next: 'leave_2' },
    leave_2: { type: 'text', speaker: '阿杏·慌张', emotion: 'panic',    text: '我迷路了……在南镇玩躲猫猫的……你能不能……', next: 'leave_3' },
    leave_3: { type: 'text', speaker: '阿杏·求助', emotion: 'pleading', text: '带我去南镇？求求你了……', next: 'merge' },

    // ===== 三线汇聚 =====
    merge: { type: 'text', speaker: '', emotion: 'happy', text: '你蹲下来，朝阿杏伸出手。\n「走吧，我带你过去。」', next: 'merge_react' },
    merge_react: { type: 'text', speaker: '阿杏·开心', emotion: 'happy', text: '阿杏愣了一下，然后笑了。', next: 'router' },

    // ===== 结局路由 =====
    router: { type: 'router' },

    // 古镇结局
    end_guzhen_1: { type: 'text', speaker: '阿杏·害羞', emotion: 'shy',     text: '你们玩你们的就行了，我不要紧的……', next: 'end_guzhen_2' },
    end_guzhen_2: { type: 'text', speaker: '阿杏·认真', emotion: 'serious', text: '等你空了，带我去就行。', next: 'end_guzhen_3' },
    end_guzhen_3: { type: 'text', speaker: '', emotion: 'lookback',          text: '阿杏跟在你后面，像一只刚认识路的小猫。', next: 'end_guzhen_final' },
    end_guzhen_final: { type: 'ending', kind: 'guzhen' },

    // 乐高结局
    end_lego_1: { type: 'text', speaker: '阿杏·认真',  emotion: 'serious', text: '阿杏看着远处的乐高乐园大门，孩子们尖叫着跑进去。', next: 'end_lego_2', background: 'lego' },
    end_lego_2: { type: 'text', speaker: '阿杏·害羞',  emotion: 'shy',     text: '你们玩你们的就好了……我在这里等你。', next: 'end_lego_3', background: 'lego' },
    end_lego_3: { type: 'text', speaker: '',             emotion: 'default', text: '她在路边马路牙子坐下，小腿晃了晃。', next: 'end_lego_4', background: 'lego' },
    end_lego_4: { type: 'text', speaker: '阿杏·认真',  emotion: 'serious', text: '真的，我不要紧的。你玩好了出来，我还在这里。', next: 'end_lego_5', background: 'lego' },
    end_lego_5: { type: 'text', speaker: '',             emotion: 'lookback', text: '你走进乐园大门，回头望去——\n阿杏小小一个，朝你挥手。', next: 'end_lego_final', background: 'lego' },
    end_lego_final: { type: 'ending', kind: 'lego' },
};

const FINAL_TEXT = '现在，你可以开始自己的旅程，\n阿杏会等你的。\n祝你旅程愉快。';

// ==========================================
//  Boot Scene
// ==========================================
class BootScene extends Phaser.Scene {
    constructor() { super('Boot'); }
    preload() {
        ['嘘','开心','迷惑','害羞','正面','回忆','侧身','抬头','回望'].forEach(s => {
            this.load.image(`阿杏${s}.png`, ASSETS + `阿杏${s}.png`);
        });
        this.load.image('信箱',    ASSETS + '信箱.png');
        this.load.image('古镇的街道', ASSETS + '古镇的街道.png');
        this.load.image('古镇环境',   ASSETS + '古镇环境.png');
        this.load.image('乐高环境',   ASSETS + '乐高环境.png');
        this.load.image('阿杏跟着人群走', ASSETS + '阿杏跟着人群走.png');
        this.load.image('阿杏蹲',       ASSETS + '阿杏蹲.png');
        // 地图图片
        this.load.image('古镇牌坊路线',   ASSETS + '古镇牌坊路线.png');
        this.load.image('乐高路线',       ASSETS + '乐高路线.png');
        this.load.image('乐高公交线路',   ASSETS + '乐高公交线路.png');
    }
    create() { this.scene.start('Story'); }
}

// ==========================================
//  Story Scene
// ==========================================
class StoryScene extends Phaser.Scene {
    constructor() { super('Story'); }

    create() {
        this.cx = W / 2;
        this.nickname = localStorage.getItem('timemail_nickname') || '';
        this.currentBgKey = '信箱';

        // ---- 背景层（画框模式） ----
        this.bgImage = this.add.image(this.cx, H/2, '信箱')
            .setDisplaySize(1780, 1000).setAlpha(0).setDepth(0);
        // 氛围遮罩：底部渐暗，自然引导视线到人物
        this.bgVignette = this.add.graphics().setDepth(1).setAlpha(0);
        this._drawVignette();

        // ---- 立绘（depth:9，右下角，对话框在人物之上） ----
        this.charSprite = this.add.image(W - 140, H * 0.62, '阿杏正面.png')
            .setOrigin(0.5, 0.55).setDisplaySize(380, 507).setDepth(9).setAlpha(0);

        // ---- 对话框（轻薄窄条，半透明融入背景） ----
        const by = H - 210;
        this.dialogBox = this.add.rectangle(this.cx, by, W - 40, 190, 0x0f0f1a, 0.55)
            .setStrokeStyle(1, 0x5a4a2a).setDepth(10);
        this.speakerLabel = this.add.text(65, by - 80, '', {
            fontSize: '26px', color: '#c9a84c', fontFamily: 'serif', fontStyle: 'bold'
        }).setDepth(11).setAlpha(0);
        this.dialogText = this.add.text(this.cx, by - 40, '', {
            fontSize: '28px', color: '#f0e6d3', fontFamily: 'serif',
            wordWrap: { width: W - 110 }, lineSpacing: 10, align: 'left'
        }).setOrigin(0.5, 0).setDepth(11);
        this.continueHint = this.add.text(this.cx, H - 50, '▼ 点击继续', {
            fontSize: '18px', color: '#5a5a7a'
        }).setOrigin(0.5).setDepth(11).setAlpha(0);

        // ---- 选项 ----
        this.choiceContainer = this.add.container(0, 0).setDepth(20).setVisible(false);

        // ---- 结局专用元素 ----
        this.endingElements = [];

        // ---- 状态 ----
        this.typing = 0; this.fullText = ''; this.charI = 0; this.typingTimer = null;
        this.currentNode = null; this.canAdvance = 0; this.ended = 0;

        this.fadeInBackground('信箱', 500, () => {
            this.time.delayedCall(300, () => this.runNode('opening'));
        });

        this.input.on('pointerdown', (p) => {
            if (this.ended) return;
            if (this.choiceContainer.visible && p.y > H - 360) return;
            if (this.typing) { this.finishTyping(); return; }
            if (this.canAdvance) this.advance();
        });
    }

    // ==================== 节点调度 ====================
    runNode(id) {
        const node = DIALOG_TREE[id];
        if (!node) return;
        this.currentNode = id;
        const fn = {
            text:    () => this.execText(node),
            choice:  () => this.execChoice(node),
            input:   () => this.execInput(node),
            router:  () => this.execRouter(),
            map:     () => this.execMap(node),
            ending:  () => this.execEnding(node),
        };
        (fn[node.type] || (() => {}))();
    }

    // ==================== 文本 ====================
    execText(node) {
        this.clearChoices();
        this.canAdvance = 0; this.continueHint.setAlpha(0);

        if (node.background) {
            const bgMap = {
                'mailbox': '信箱',
                'street':  '古镇的街道',
                'lego':    '乐高环境',
                'guzhen':  '古镇的街道',
            };
            const key = bgMap[node.background] || '古镇的街道';
            this.fadeInBackground(key);
        }

        if (node.showCharacter || node.emotion) this.showChar(node.showCharacter || node.emotion);
        if (node.emotion === null && node.speaker === '') this.hideChar();

        this.speakerLabel.setAlpha(node.speaker ? 1 : 0).setText(node.speaker);
        this.fullText = node.text.replace(/\[name\]/g, this.nickname || '你');
        this.charI = 0; this.dialogText.setText(''); this.typing = 1;
        this.typeChar();
    }

    typeChar() {
        if (this.charI < this.fullText.length) {
            this.dialogText.setText(this.fullText.substring(0, ++this.charI));
            this.typingTimer = this.time.delayedCall(50, () => this.typeChar());
        } else { this.typing = 0; this.typingTimer = null; this.showAdvance(); }
    }

    finishTyping() {
        if (this.typingTimer) { this.typingTimer.remove(); this.typingTimer = null; }
        this.dialogText.setText(this.fullText); this.typing = 0; this.showAdvance();
    }

    showAdvance() {
        this.canAdvance = 1; this.continueHint.setAlpha(1);
        this.tweens.killTweensOf(this.continueHint);
        this.tweens.add({ targets: this.continueHint, alpha: 0.6, duration: 800, yoyo: true, repeat: -1 });
    }

    advance() {
        this.canAdvance = 0;
        this.tweens.killTweensOf(this.continueHint);
        this.continueHint.setAlpha(0);
        const n = DIALOG_TREE[this.currentNode];
        if (n && n.next) this.runNode(n.next);
    }

    // ==================== 选项 ====================
    execChoice(node) {
        this.canAdvance = 0; this.continueHint.setAlpha(0);
        if (node.prompt) { this.speakerLabel.setAlpha(0); this.dialogText.setText(node.prompt); }
        this.clearChoices();
        this.choiceContainer.setVisible(true);
        const sy = H - 330, sp = 66, bw = W - 120, bh = 52, r = 12;
        node.choices.forEach((c, i) => {
            const y = sy + i * sp;
            // 圆角半透明背景
            const bg = this.add.graphics().setDepth(20);
            bg.fillStyle(0x1e1e33, 0.65);
            bg.fillRoundedRect(this.cx - bw/2, y - bh/2, bw, bh, r);
            bg.lineStyle(1, 0x7a6a3a, 0.65);
            bg.strokeRoundedRect(this.cx - bw/2, y - bh/2, bw, bh, r);
            // 文字
            const lb = this.add.text(this.cx, y, c.label, {
                fontSize: '23px', color: '#d4cfc0', fontFamily: 'serif'
            }).setOrigin(0.5).setDepth(21);

            // 交互区域
            const zone = this.add.zone(this.cx, y, bw, bh).setDepth(22)
                .setInteractive({ useHandCursor: true });
            zone.on('pointerover', () => { bg.clear(); bg.fillStyle(0x35355c, 0.75); bg.fillRoundedRect(this.cx - bw/2, y - bh/2, bw, bh, r); bg.lineStyle(1, 0xc9a84c, 0.85); bg.strokeRoundedRect(this.cx - bw/2, y - bh/2, bw, bh, r); lb.setColor('#fff'); });
            zone.on('pointerout', () => { bg.clear(); bg.fillStyle(0x1e1e33, 0.65); bg.fillRoundedRect(this.cx - bw/2, y - bh/2, bw, bh, r); bg.lineStyle(1, 0x7a6a3a, 0.65); bg.strokeRoundedRect(this.cx - bw/2, y - bh/2, bw, bh, r); lb.setColor('#d4cfc0'); });
            zone.on('pointerdown', () => { this.clearChoices(); this.time.delayedCall(500, () => this.runNode(c.next)); });
            this.choiceContainer.add([bg, lb, zone]);
        });
    }

    clearChoices() { this.choiceContainer.removeAll(true); this.choiceContainer.setVisible(false); }

    // ==================== 昵称输入 ====================
    execInput(node) {
        this.canAdvance = 0;
        if (this.nickname) { this.runNode(node.next); return; }
        this.clearChoices();
        this.speakerLabel.setAlpha(0); this.dialogText.setText('');

        const modal = document.getElementById('nicknameModal');
        const input = document.getElementById('nicknameInput');
        const btn = document.getElementById('nicknameConfirm');
        input.value = '';
        modal.classList.add('show');
        setTimeout(() => input.focus(), 100);

        const submit = () => {
            const name = input.value.trim() || '旅人';
            this.nickname = name;
            localStorage.setItem('timemail_nickname', name);
            modal.classList.remove('show');
            btn.removeEventListener('click', submit);
            input.removeEventListener('keydown', onKey);
            this.runNode(node.next);
        };
        const onKey = (e) => { if (e.key === 'Enter') submit(); };
        btn.addEventListener('click', submit);
        input.addEventListener('keydown', onKey);
    }

    // ==================== 地图展示 ====================
    execMap(node) {
        this.canAdvance = 0; this.clearChoices();
        this.speakerLabel.setAlpha(0); this.dialogText.setText('');
        this.continueHint.setAlpha(0);
        this.charSprite.setAlpha(0);
        this.dialogBox.setAlpha(0);
        this.bgVignette.setAlpha(0);

        const area = node.area;

        if (area === 'guzhen') {
            this._showMapGuzhen(node);
        } else {
            this._showMapLego(node);
        }
    }

    _showMapGuzhen(node) {
        // 用 bgImage 直接显示地图，覆盖画面中上
        const iw = 1473, ih = 696;
        const dw = W - 30, dh = dw * ih / iw;
        this.bgImage.setTexture('古镇牌坊路线').setDepth(5).setAlpha(0)
            .setDisplaySize(dw, dh).setPosition(this.cx, H * 0.32).setOrigin(0.5);

        // 路线文字（底图亮色 → 深色文字）
        const label = this.add.text(this.cx, H * 0.32 + dh/2 + 35, MAP_GUIDES.guzhen, {
            fontSize: '24px', color: '#2a2a2a', fontFamily: 'serif',
            align: 'center', lineSpacing: 8,
            backgroundColor: 'rgba(255,255,255,0.55)', padding: { x: 14, y: 8 }
        }).setOrigin(0.5, 0).setDepth(6).setAlpha(0);

        // 祝福语
        const bless = this.add.text(this.cx, H - 120, '享受你的旅程，记得空下来带阿杏去。', {
            fontSize: '26px', color: '#3d2b1f', fontFamily: 'serif', fontStyle: 'italic',
            align: 'center',
            backgroundColor: 'rgba(255,255,255,0.55)', padding: { x: 18, y: 8 }
        }).setOrigin(0.5).setDepth(6).setAlpha(0);

        this.tweens.add({ targets: [this.bgImage, label, bless], alpha: 1, duration: 600, delay: 200 });

        this._mapClickOnce(() => {
            label.destroy(); bless.destroy();
            this.bgImage.setDepth(0);
            this.time.delayedCall(300, () => {
                this.fadeInBackground('古镇的街道', 600, () => this.runNode(node.next));
            });
        });
    }

    _showMapLego(node) {
        let step = 0;
        let imgBus, busLabel, bless;

        const showStep = () => {
            if (step === 0) {
                // 第一步：bgImage 显示乐高路线大图
                const iw = 1806, ih = 918;
                const dw = W - 30, dh = dw * ih / iw;
                this.bgImage.setTexture('乐高路线').setDepth(5).setAlpha(0)
                    .setDisplaySize(dw, dh).setPosition(this.cx, H * 0.35).setOrigin(0.5);
                this.tweens.add({ targets: this.bgImage, alpha: 1, duration: 600 });
            } else if (step === 1) {
                // 第二步：路线图缩小到上方，公交线路出现在下方
                const iw1 = 1806, ih1 = 918;
                const iw2 = 774, ih2 = 635;
                const dw = W - 40, gap = 25;
                const topY = H * 0.20;
                const dh1 = dw * ih1 / iw1;
                this.tweens.add({
                    targets: this.bgImage,
                    displayWidth: dw, displayHeight: dh1,
                    y: topY,
                    duration: 500, ease: 'Sine.easeInOut'
                });

                const dh2 = dw * ih2 / iw2;
                const busY = topY + dh1/2 + gap + dh2/2;
                imgBus = this.add.image(this.cx, busY, '乐高公交线路')
                    .setDisplaySize(dw, dh2).setDepth(6).setAlpha(0);

                busLabel = this.add.text(this.cx, busY - dh2/2 - 10, '🚌 乘坐乐枫线', {
                    fontSize: '24px', color: '#2a2a2a', fontFamily: 'serif', fontStyle: 'bold',
                    backgroundColor: 'rgba(255,255,255,0.6)', padding: { x: 16, y: 6 }
                }).setOrigin(0.5, 1).setDepth(7).setAlpha(0);

                this.tweens.add({ targets: [imgBus, busLabel], alpha: 1, duration: 500, delay: 300 });
            } else {
                // 第三步：清理地图，显示祝福语
                this.bgImage.setAlpha(0).setDepth(0);
                if (imgBus) imgBus.destroy();
                if (busLabel) busLabel.destroy();

                bless = this.add.text(this.cx, H * 0.5, '享受你的旅程，记得空下来带阿杏去。', {
                    fontSize: '26px', color: '#3d2b1f', fontFamily: 'serif', fontStyle: 'italic',
                    align: 'center', wordWrap: { width: W - 80 },
                    backgroundColor: 'rgba(255,255,255,0.55)', padding: { x: 18, y: 8 }
                }).setOrigin(0.5).setDepth(6).setAlpha(0);
                this.tweens.add({ targets: bless, alpha: 1, duration: 600 });
            }
            step++;
        };

        showStep();

        this._mapClick = () => {
            if (step < 3) {
                showStep();
            } else {
                if (bless) bless.destroy();
                this.input.off('pointerdown', this._mapClick);
                this.fadeInBackground('乐高环境', 600, () => this.runNode(node.next));
            }
        };
        this.input.on('pointerdown', this._mapClick);
    }

    _mapClickOnce(cb) {
        const handler = () => {
            this.input.off('pointerdown', handler);
            cb();
        };
        this.input.on('pointerdown', handler);
    }

    // ==================== 结局 ====================
    execEnding(node) {
        this.ended = 1;
        this.clearChoices(); this.canAdvance = 0; this.continueHint.setAlpha(0);
        this.speakerLabel.setAlpha(0); this.hideChar(); this.hideUI();

        if (node.kind === 'guzhen') this._endingGuzhen();
        else this._endingLego();
    }

    // 古镇结局：阿杏跟着人群走直接替换背景，镜头横扫
    _endingGuzhen() {
        // 这张图本身就是完整的场景（古镇+阿杏+人群），直接替换背景
        // 原图 360x202，放大到1200x674 保持比例
        this.bgImage.setTexture('阿杏跟着人群走').setDisplaySize(1780, 1000)
            .setAlpha(0).setDepth(0);
        this.bgImage.x = this.cx;
        this.bgImage.y = H / 2;
        this.bgVignette.setAlpha(0);

        // 淡入
        this.tweens.add({ targets: this.bgImage, alpha: 1, duration: 800,
            onComplete: () => {
                // 镜头横扫：从右向左
                this.tweens.add({
                    targets: this.bgImage,
                    x: this.cx - 180,
                    duration: 4000,
                    ease: 'Sine.easeInOut',
                    onComplete: () => {
                        // 扫完后稍停，展示结局文字
                        this.time.delayedCall(500, () => this._showEndingText());
                    }
                });
            }
        });
    }

    // 乐高结局：乐高环境做背景 + 阿杏蹲缩放远离
    _endingLego() {
        this.bgImage.setTexture('乐高环境').setDisplaySize(1780, 1000)
            .setAlpha(0).setDepth(0);
        this.bgImage.x = this.cx;
        this.bgVignette.setAlpha(0);

        // 阿杏蹲着，放在画面中下方
        const CX_DUN = this.add.image(W / 2, H - 30, '阿杏蹲')
            .setOrigin(0.5, 0.85)
            .setDisplaySize(280, 374)
            .setDepth(9).setAlpha(0);
        this.endingElements.push(CX_DUN);

        this.tweens.add({ targets: this.bgImage, alpha: 1, duration: 800 });
        this.tweens.add({
            targets: CX_DUN, alpha: 1, duration: 600, delay: 400,
            onComplete: () => {
                // 缩放远离：阿杏缩小 + 上移 + 背景渐暗
                this.tweens.add({
                    targets: CX_DUN,
                    scaleX: 0.4, scaleY: 0.4,
                    y: H / 2,
                    duration: 4000,
                    ease: 'Sine.easeIn',
                });
                // 背景同步微缩，增强远离感
                this.tweens.add({
                    targets: this.bgImage,
                    scaleX: 0.85, scaleY: 0.85,
                    duration: 4000,
                    ease: 'Sine.easeIn',
                });
                this.tweens.add({
                    targets: this.bgVignette,
                    alpha: 0.45,
                    duration: 3000, delay: 1000,
                    onComplete: () => this._showEndingText()
                });
            }
        });
    }

    _showEndingText() {
        this.endingElements.forEach(el => el.destroy());
        this.endingElements = [];
        this.bgImage.setDepth(0).setScale(1);
        this.dialogBox.setAlpha(0.5);
        this.bgVignette.setAlpha(0.35);
        this.dialogText.setText(FINAL_TEXT).setAlign('center').setOrigin(0.5, 0.5)
            .setY(H / 2).setDepth(11).setAlpha(0);
        this.tweens.add({ targets: this.dialogText, alpha: 1, duration: 800 });

        const exitBtn = document.getElementById('exitBtn');
        exitBtn.style.display = 'block';
    }

    // ==================== 路由 ====================
    execRouter() {
        const next = SRC === 'lego' ? 'end_lego_1' : 'end_guzhen_1';
        this.fadeToBlack(600, () => {
            this.hideChar();
            this.bgVignette.setAlpha(0);
            this.dialogBox.setAlpha(0.78);
            this.runNode(next);
        });
    }

    // ==================== 背景 ====================
    fadeInBackground(key, dur, cb) {
        dur = dur || 800;
        this.currentBgKey = key;

        if (key === '信箱') {
            this.bgImage.setDisplaySize(750, 1000);
            this.bgImage.x = this.cx;
            this.bgImage.y = H * 0.45;
        } else {
            this.bgImage.setDisplaySize(1780, 1000);
            this.bgImage.x = this.cx;
            this.bgImage.y = H / 2;
        }

        this.bgImage.setTexture(key).setAlpha(0).setScale(1);
        this.bgVignette.setAlpha(0);
        this.tweens.add({ targets: this.bgImage, alpha: 1, duration: dur });
        this.tweens.add({
            targets: this.bgVignette, alpha: 1, duration: dur, delay: dur * 0.3,
            onComplete: () => { if (cb) cb(); }
        });
    }

    fadeToBlack(dur, cb) {
        this.tweens.add({
            targets: [this.bgImage, this.bgVignette, this.dialogBox, this.charSprite],
            alpha: 0, duration: dur,
            onComplete: () => {
                this.bgImage.setAlpha(0); this.bgVignette.setAlpha(0);
                this.charSprite.setAlpha(0);
                if (cb) this.time.delayedCall(200, cb);
            }
        });
    }

    hideUI() {
        this.dialogBox.setAlpha(0);
        this.speakerLabel.setAlpha(0);
        this.dialogText.setText('');
        this.continueHint.setAlpha(0);
        this.charSprite.setAlpha(0);
    }

    // ==================== 氛围渐变遮罩 ====================
    _drawVignette() {
        const g = this.bgVignette;
        g.clear();
        const steps = 12;
        for (let i = 0; i < steps; i++) {
            const t = i / steps;
            const h = H * (0.55 + t * 0.45); // 底部占45%，向上渐变到55%处透明
            const a = 0.12 + t * 0.25; // 底部最深 ~0.37, 顶部透明
            g.fillStyle(0x000000, a);
            g.fillRect(0, h, W, H - h);
        }
    }

    // ==================== 立绘 ====================
    showChar(emotion) {
        const fn = EMOTION_MAP[emotion] || EMOTION_MAP.default;
        if (!this.textures.exists(fn)) {
            this.load.image(fn, ASSETS + fn);
            this.load.once('complete', () => this.charSprite.setTexture(fn).setDisplaySize(380, 507));
            this.load.start();
            return;
        }
        this.charSprite.setTexture(fn).setDisplaySize(380, 507);
        this.tweens.add({ targets: this.charSprite, alpha: 1, duration: 350, ease: 'Sine.easeInOut' });
    }

    hideChar() {
        this.tweens.killTweensOf(this.charSprite);
        this.tweens.add({ targets: this.charSprite, alpha: 0, duration: 300 });
    }
}

// ==========================================
const config = {
    type: Phaser.AUTO, width: W, height: H, backgroundColor: '#1a1a2e',
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: [BootScene, StoryScene],
};
new Phaser.Game(config);
