//setando as váriaveis
var platforms;
var player;
var cruzes;
var score = 0;
var scoreText;
var cursors;
var magma;
class GameScene extends Phaser.Scene {// setando que essa cena eh a GameScene
    constructor() {
        super({ key: "GameScene" });
    };
    preload() {//preload de todas as imagens utilizadas
        this.load.image('inferno', '../assets/inferno.jpg');
        this.load.image('magma', '../assets/magma.png');
        this.load.image('plataforma', '../assets/chao.png');
        this.load.image('cruz', '../assets/cruz.png');
        this.load.spritesheet('dude', '../assets/xumbrador.png', { frameWidth: 120, frameHeight: 176 });
        this.load.image('gameover', '../assets/gameover.png');
        this.load.image('restart', '../assets/restart.png');
        this.load.image('victory', '../assets/youWin.png');
        this.load.audio('title', '../assets/title.mp3');
    }
    create() {//adicionando todas as imagens utilizadas
        this.add.image(400, 300, 'inferno').setScale(0.6);
        platforms = this.physics.add.staticGroup();
        platforms.create(400, 720, 'plataforma').setScale(5).refreshBody();
        platforms.create(410, 380, 'plataforma');
        platforms.create(90, 250, 'plataforma');
        platforms.create(710, 240, 'plataforma');
        player = this.physics.add.sprite(50, 400, 'dude').setScale(0.4);
        player.setBounce(0.2);// setando o bounce do personagem
        player.setCollideWorldBounds(true);// colisão com bounds
        this.anims.create({//setando as divisões das sprites
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 4, end: 7 }),//quais frames vão ser utilizados
            frameRate: 10,//a velocidade da troca de frames
            repeat: -1 // a repetição do mesmo
        });
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 0 }],
            frameRate: 20
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.physics.add.collider(player, platforms);
        cruzes = this.physics.add.group({
            key: 'cruz',
            repeat: 6,
            setXY: { x: 12, y: 0, stepX: 130 }
        });
        
        this.physics.add.collider(cruzes, platforms);// adiciona a colisão entre as cruzes e as plataformas
        this.physics.add.overlap(player, cruzes, collectCruz, null, this); //cria um overlap entre os players com as cruzes criando o collectCruz
        scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#12FFFF' });//cria o texto "score" na tela
        this.gameControls = {
            over: false,
            current_col_scored: false,
            score: 0,
            restartBt: this.add.image(this.game.config.width / 2 - 50, this.game.config.height / 4 * 3, 'restart').setScale(.2).setOrigin(0, 0).setInteractive().setVisible(false)
        };
        cursors = this.input.keyboard.createCursorKeys();
        magma = this.physics.add.group();
        this.physics.add.collider(magma, platforms);// adiciona a colisão entre o magma e as plataformas
        this.physics.add.collider(player, magma, hitMagma, null, this);
        function collectCruz(player, cruz) { // cria a função de coleta entre o player e a cruz
            cruz.disableBody(true, true);
            score += 10;
            scoreText.setText('score: ' + score);
            let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            let bolaDeMagma = magma.create(x, 16, 'magma');
            bolaDeMagma.setBounce(1);
            bolaDeMagma.setCollideWorldBounds(true);
            bolaDeMagma.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
        function hitMagma(player, magma) {//cria a função de hit entre o player e o magma
            player.setTint(0xff0000); // faz o player ficar vermelho
            player.anims.play('turn');
            this.gameControls.over = true;
            this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'gameover').setScale(0.5); // aparece a imagem GAMEOVER
            this.physics.pause(); // para a fisica do jogo
            this.gameControls.restartBt.visible = true; //aparece o botão de restart
        }
        this.gameControls.restartBt.on('pointerdown', function () {//adiciona a função de restart
            if (this.gameControls.over) {
                this.gameControls.over = false;
                score = 0;// score vai pra 0
                scoreText.setText('score: ' + score); 
                this.scene.restart(); // restarta o jogo
            }
        }, this);

       

    }
    update() {// declarando os movimentos do player pelo teclado
        if (this.gameControls.over) return;
        if (cursors.left.isDown) {
            player.setVelocityX(-160);
            player.anims.play('left', true);
        } else if (cursors.right.isDown) {
            player.setVelocityX(160);
            player.anims.play('right', true);
        } else {
            player.setVelocityX(0);
            player.anims.play('turn');
        }
        if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-330);
        }
        this.events.once('score-10', () => {
            this.add.image(400, 300, 'victory').setScale(0.5);
            this.physics.pause();
            this.sound.get('music').stop();
            let sfx2 = this.sound.add('title');
            sfx2.play();
          });
          
          // ...
          
          if (score === 70) {
            this.events.emit('score-10');
          }
          
}
    
}
