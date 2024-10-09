export default class Carousel {

    constructor(element, opts = {}) {
        if(!element) return;
        this.element = element;
        this.opts = {
            ...{
                visible: 3,
                scroll: 3,
                auto: false,
                time: 2000,
                btnSize: 30,
                pagination: false,
                paginationColor: 'rgb(65, 68, 68)',
                media: [[576, 1]],
                btn: {
                    next: 'btn__next',
                    prev: 'btn__prev'
                }
            }, ...opts
        };

        this.opts.oldVisible = this.opts.visible;
        this.opts.oldScroll = this.opts.scroll;

        this.currentItem = 0;
        this.slideCallback = [];
        
        const children = Array.from(element.children);

        this.root = this.createDiv('carousel__root');
        this.container = this.createDiv('carousel__container');

        this.root.appendChild(this.container);
        this.element.appendChild(this.root);

        this.children = children.map(child => {
            let div = this.createDiv('carousel__items');
            div.appendChild(child);
            this.container.appendChild(div);
            return div;
        });

        this.createNavigation();

        if (this.opts.pagination) {
            this.createPagination();
        }

        this.onResize();
        window.addEventListener('resize', this.onResize.bind(this));
    }

    /**
     * 
     * 
     * 
     * 
     */
    onResize() {
        this.opts.media.forEach(op => {
            let match = window.matchMedia(`screen and (max-width: ${op[0]}px)`);
            if(match.matches) {
                this.opts.visible = op[1];
                this.opts.scroll = op[1];
            } else {
                this.opts.visible = this.opts.oldVisible;
                this.opts.scroll = this.opts.oldScroll;
            }
            this.setStyle();
            this.trigger(this.currentItem);
        });
    }
    /**
     * 
     * 
     * 
     * 
     */
    get visible() {
        return this.opts.visible;
    }
    /**
     * 
     * 
     * 
     * 
     */
    get scroll() {
        return this.opts.scroll;
    }

    /**
     * 
     * 
     * 
     * 
     * 
     */
    setStyle() {
        let ratio = this.children.length / this.visible;
        this.root.style.setProperty('--btnSize', this.opts.btnSize + 'px');
        this.container.style.width = `${ratio * 100}%`;
        // let rect = this.children[0].getBoundingClientRect();
        // this.container.style.width = `${rect.width * 100}%`;
        this.children.forEach(child => {
            let widthPercent = (100 / this.visible) / ratio;
            child.style.width = `${widthPercent}%`;
            child.style.height = `100%`;
        });
    }

    /**
     * 
     * 
     * 
     * @param {string} cls 
     */
    createDiv(cls) {
        let div = document.createElement('div');
        div.classList.add(cls);
        return div;
    }

    /**
     * 
     * 
     * 
     * 
     */
    createPagination() {
        const btns = [];
        const pagination = this.createDiv('carousel__pagination');
        this.root.appendChild(pagination);
        let length = this.visible > 1 ? this.children.length - 1 : this.children.length;
        for (let i = 0; i < length; i += this.scroll) {
            const btn = this.createDiv('carousel__pagination__btn');
            btn.style.backgroundColor = this.opts.paginationColor;
            btn.addEventListener('click', e => this.goTo(i));
            pagination.appendChild(btn);
            btns.push(btn);
        }
        this.onSlide(i => {
            const activeBtn = btns[Math.floor(i / this.scroll)];
            if (activeBtn) {
                btns.forEach(b => b.classList.remove('active'));
                activeBtn.classList.add('active');
            }
        });
    }

    /**
     * 
     * 
     * 
     * 
     */
    createNavigation() {
        if (this.opts.auto) {
            setInterval(() => {
                this.goTo(this.currentItem);
            }, this.opts.time);
            this.onSlide(i => {
                if (i < 0) {
                    this.currentItem = this.children.length - this.visible;
                } else if (this.children[i + this.visible] == undefined) {
                    this.currentItem = 0;
                } else {
                    this.currentItem = this.currentItem + this.scroll;
                }
            });
            return false;
        }

        this.btnNext = this.createDiv(this.opts.btn.next);
        this.btnPrev = this.createDiv(this.opts.btn.prev);

        this.root.appendChild(this.btnNext);
        this.root.appendChild(this.btnPrev);

        this.btnNext.innerHTML = '<span class="lnr lnr-chevron-right"></span>';
        this.btnPrev.innerHTML = '<span class="lnr lnr-chevron-left"></span>';

        this.btnNext.addEventListener('click', this.next.bind(this));
        this.btnPrev.addEventListener('click', this.prev.bind(this));

        this.onSlide(i => {
            if (i <= 0) {
                this.btnPrev.classList.add('btn__prev--hidden');
            } else {
                this.btnPrev.classList.remove('btn__prev--hidden');
            }

            if (this.children[i + this.visible] == undefined) {
                this.btnNext.classList.add('btn__next--hidden');
            } else {
                this.btnNext.classList.remove('btn__next--hidden');
            }
        });
    }

    /**
     * 
     * 
     * 
     */
    next() {
        this.goTo(this.currentItem + this.scroll);
    }

    /**
     * 
     * 
     * 
     */
    prev() {
        this.goTo(this.currentItem - this.scroll);
    }

    /**
     * 
     * @param {integer} i 
     */
    goTo(i) {
        let x = i * -100 / this.children.length;
        this.container.style.transform = `translate3d(${x}%, 0, 0)`;
        this.currentItem = i;
        this.trigger(this.currentItem);
    }

    /**
     * 
     * @param {callback} cb 
     */
    onSlide(cb) {
        this.slideCallback.push(cb);
    }

    /**
     * 
     * @param {integer} i 
     */
    trigger(i) {
        this.slideCallback.forEach(cb => cb(i));
    }

}
