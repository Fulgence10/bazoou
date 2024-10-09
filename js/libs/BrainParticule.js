class Particule {
    /**
     * 
     * @param {object} param0 
     */
    constructor({x = 0, y = 0, vx = 0, vy = 0, radius = 2, color = "#fff", alpha = 1}) {
        this.x = x
        this.y = y;
        this.vx = vx
        this.vy = vy;
        this.color = color;
        this.radius = radius;
        this.alpha = alpha;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 40) + 5;
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath(); 
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); 
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    /**
     * 
     * @param {integer} width 
     * @param {integer} height 
     */
    update(width, height) {
        this.x += this.vx;
        this.y += this.vy;
        if ((this.x + this.radius) >= width || this.x <= 0) {
            this.vx *= -1;
        }
        if ((this.y + this.radius) >= height || this.y <= 0) {
            this.vy *= -1;
        }
    }

}

/**
 * 
 * @param {HTMLElement} cancas
 * @param {integer} width
 * @param {integer} height
 */
export default class BrainParticule {
    /**
     * 
     * @param {HTMLElement} canvas 
     * @param {integer} width 
     * @param {integer} height 
     */
    constructor(canvas, width, height) {
        this.ctx = canvas.getContext('2d');
        this.width = width;
        this.height = height;
        canvas.width = width;
        canvas.height = height;
		this.ctx.imageSmoothingEnabled = false;
    }

    /**
     * 
     * @param {integer} v 
     * @returns 
     */
    getPosition(v) { return Math.random() * v; }

    /**
     * 
     * @param {integer} v1 
     * @param {integer} v2 
     * @returns 
     */
    getDistance(v1, v2) { return v1 - v2; }

    /**
     * 
     * @param {integer} dx 
     * @param {integer} dy 
     * @returns 
     */
    getRacine(dx, dy) { return Math.sqrt(dx * dx + dy * dy); }

    /**
     * 
     * @param {integer} v 
     * @returns 
     */
    getVelocity(v) { return (Math.random() - .5) * (Math.random() * v); }

    /**
     * 
     * @param {integer} nb 
     * @param {object} config 
     */
    generateRandomParticules(nb = 10, config = {}) {
        const particules = [];
        config = Object.assign({
            x: 0, y: 0, radius: 2, color: "#fff", alpha: 1,
            vx: 0, vy: 0
        }, config);
        for (let i = 0; i < nb; i++) {
            particules.push(new Particule({
                radius: config.radius,
                color: config.color,
                alpha: config.alpha,
                x: this.getPosition(this.width),
                y: this.getPosition(this.height),
                vx: this.getVelocity(config.vx),
                vy: this.getVelocity(config.vy),
            }));
        }
        return particules;
    }

    /**
     * 
     * @param {string} text 
     * @param {object} config 
     */
    generateParticulesFromText(text = 'Brain', config = {}) {

        config = Object.assign({
            adjustX: 0,
            adjustY: 0,
            font: 'Verdana', size: 10,
            particule: {}
        }, config);

        this.ctx.font = `30px ${config.font}`;
        this.ctx.fillText(text, 0, 30);

        const textdata = this.ctx.getImageData(0, 0, this.width, this.height);
        const particules = [];
        const particuleConfig = config.particule;

        for (let y = 0, y2 = textdata.height; y < y2; y++) {
            for (let x = 0, x2 = textdata.width; x < x2; x++) {
                let ratio = (y * 4 * textdata.width) + (x * 4) + 3;
                if (textdata.data[ratio] > 10) {
                    particuleConfig.x = (x + config.adjustX) * config.size;
                    particuleConfig.y = (y + config.adjustY) * config.size;
                    particules.push(new Particule(particuleConfig));
                }
            }
        }
        return particules;

    }
    

    /**
     * 
     * @param {callback} func 
     * @param {integer} fps 
     */
    animate(func, fps = 60) {
        const fpsInterval = 1000 / fps;
        let before = window.performance.now();
        this.main = (tframe) => {   
            requestAnimationFrame(this.main.bind(this));
            let elapsed = tframe - before;
            if (elapsed > fpsInterval) {
                this.ctx.clearRect(0, 0, this.width, this.height);
                func.call();
            }
        };
        this.main();
    }

    /**
     * 
     * @param {array} particules 
     */
    drawParticule(particules) {
        for (let i = 0; i < particules.length; i++) {
            particules[i].draw(this.ctx);
            particules[i].update(this.width, this.height);
        }
    }

    /**
     *          
     * @param {array} particules 
     * @param {integer} dis 
     * @param {string} color 
     * @param {integer} alpha 
     * @param {integer} lineWidth 
     */
    connecteParticule(particules = [], dis = 80, color = '#fff', alpha = 1, lineWidth = .2) {
        for (let a = 0; a < particules.length; a++) {
            for (let b = a; b < particules.length; b++) {

                let dx = this.getDistance(particules[a].x, particules[b].x);
                let dy = this.getDistance(particules[a].y, particules[b].y);
                let distance = this.getRacine(dx, dy);

                if (distance < dis) {
                    this.ctx.save();
                    this.ctx.globalAlpha = alpha;
                    this.ctx.strokeStyle = color;
                    this.ctx.lineWidth = lineWidth;
                    this.ctx.beginPath(); 
                    this.ctx.moveTo(particules[a].x, particules[a].y); 
                    this.ctx.lineTo(particules[b].x, particules[b].y); 
                    this.ctx.closePath();
                    this.ctx.stroke();
                    this.ctx.restore();
                }
            }
        }
    }


    /**
     * 
     * @param {array} particules 
     * @param {float} mouseX 
     * @param {float} mouseY 
     * @param {integer} mouseRadius 
     */
    desintegre(particules = [], mouseX = 0, mouseY = 0, mouseRadius = 200) {
        for (let i = 0; i < particules.length; i++) {

            let dx = this.getDistance(mouseX, particules[i].x);
            let dy = this.getDistance(mouseY, particules[i].y);
            let ds = this.getRacine(dx, dy);

            let { dirX, dirY } = this.getDirection(particules[i], dx, dy, ds, mouseRadius);

            if (ds < mouseRadius) {
                particules[i].x -= dirX;
                particules[i].y -= dirY;
            } else {
                if (particules[i].x !== particules[i].baseX) {
                    particules[i].x -= (particules[i].x - particules[i].baseX) / 10;
                }
                if (particules[i].y !== particules[i].baseY) {
                    particules[i].y -= (particules[i].y - particules[i].baseY) / 10;
                }
            }
        }
    }

    /**
     * 
     * @param {integer} dx 
     * @param {integer} dy 
     * @param {float} ds 
     * @param {integer} mouseRadius 
     * @returns 
     */
    getDirection(particule, dx, dy, ds, mouseRadius) { 
        let forceDX = dx / ds;
        let forceDY = dy / ds;
        let force = (mouseRadius - ds) / mouseRadius;
        return {
            dirX: forceDX * force * particule.density,
            dirY: forceDY * force * particule.density
        };
    }
}
