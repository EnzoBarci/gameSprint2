
class StartScene extends Phaser.Scene {
	constructor() {
		super({ key: 'StartScene' })
	}

	preload() {
		this.load.image('tela', '../assets/start.jpg'); //load da imagem
		this.load.audio('music', '../assets/musicaTerror.mp3'); // load da música
	}

	create() {
		let sfx = this.sound.add('music');// adição da música
		sfx.play();
		this.add.image(400, 300, "tela").setScale(0.78); //tamanho da imagem
		this.input.on('pointerdown', () => {//caso clique na tela ira acontecer o que esta escrito a baixo
			this.scene.stop('StartScene')//Acaba essa cena inicial do jogo
			this.scene.start('GameScene')//Comeca a cena da gameplay
		})
	}

	
}