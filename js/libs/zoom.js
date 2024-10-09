export default class Zoom {
    /**
     * 
     * @param {string} containerClassName 
     */
    constructor(containerClassName, zoom = 2) {
        this.container = µ(`${containerClassName}`);
        if (!this.container) {
            return false;
        }
        let imgSource = µ(`${containerClassName} img`);

        this.img = µ().createElement('img');
        this.img.attr('src', imgSource.attr('src'));

        this.loop = µ().createElement('div')
            .css('width', '150px')
            .css('height', '150px')
            .css('position', 'absolute')
            .css('top', '10%')
            .css('left', '10%')
            .css('background', `transparent`)
            .css('overflow', 'hidden')
            .css('border-radius', '50%');

        this.img.addToDOM(this.loop);
        this.loop.addToDOM(this.container);
        this.#init(zoom);
    }

    /**
     * 
     * @param {int} z 
     */
    #init(z) {
        if (!this.container) {
            return false;
        }
        this.img
            .css('position', 'absolute')
            .css('width', `${z * 440}px`)
            .css('height', `${z * 400}px`)
            .css('filter', 'brightness(1.1)');

        this.container.on('mousemove', (e) => {   
            const rect = e.target.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;
            const x = e.clientX;
            const y = e.clientY;

            this.loop
                .css('top', `${y - (height/2) - 75}px`)
                .css('left', `${x - (width/2) - 75}px`);

            this.img
                .css('top', `${(-y * z) + 300}px`)
                .css('left', `${(-x * z) + 300}px`);

        }, true);
    }

}
