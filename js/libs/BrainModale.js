/**
 * 
 * @copyright yapi fulgence
 * @version v1.0
 */
class BrainModale extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <div class="modale-container">
            <style>${this.style}</style>
            <div class="modale-content">
                <i class="btn-close">X</i>
                <div class="modale-title">
                    <h4></h4>
                </div>
                <hr>
                <div class="sloted">
                    <slot slot="content"></slot>
                </div>
            </div>
        </div>
        `;
    }

    connectedCallback() {
        const btnClose = this.shadowRoot.querySelector('.btn-close');
        const modaleTitle = this.shadowRoot.querySelector('.modale-title h4');

        modaleTitle.innerHTML = this.getAttribute('title') ?? '';
        
        let action = this.getAttribute('action');
        action = document.querySelectorAll('.' + action);

        if (action) {
            action.forEach(ac => {
                ac.addEventListener('click', e => {
                    e.preventDefault();
                    this.show();
                });
            });
        }

        btnClose.addEventListener('click', e => {
            this.hide();
        });
    }

    /**
     * 
     */
    show() {
        const modaleOverlay = this.shadowRoot.querySelector('.modale-container');
        const content = this.shadowRoot.querySelector('.modale-content');

        if (!modaleOverlay.classList.contains('show')) {
            modaleOverlay.classList.add('show');
            setTimeout(() => {
                content.classList.add('show-animation');
            }, 250);
        }
    }

    /**
     * 
     */
    hide() {
        const modaleOverlay = this.shadowRoot.querySelector('.modale-container');
        const content = this.shadowRoot.querySelector('.modale-content');

        if (modaleOverlay.classList.contains('show')) {
            content.classList.remove('show-animation');
            setTimeout(() => {
                modaleOverlay.classList.remove('show');
            }, 350);
        }
    }

    get style() {
        return `
            ::-webkit-scrollbar {
                width: 6px;
            }

            ::-webkit-scrollbar-thumb {
                border-radius: 50px;
                background: rgb(207, 206, 206);
            }

            hr {
                width: 96%;
                margin: 0;
                border: 1px solid rgb(225, 229, 234);
                margin: 0 auto;
            }

            .modale-container {
                display: none;
                justify-content: center;
                align-items: center;
                position: fixed;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,.2);
                font-family: inherit;
                z-index: 1000;
            }

            .modale-container.show {
                display: flex;
            }

            .modale-title {
                width: 100%;
                height: 40px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 5px;
            }

            .modale-content {
                position: relative;
                color: inherit;
                border-radius: 5px;
                background:  #2f2f2f;
                transform: translateY(-20px);
                opacity: 0;
                transition: transform .3s, opacity .3s;
            }
                        
            .modale-content.show-animation {
                transform: translateY(0px);
                opacity: 1;
            }

            .sloted {
                max-width: calc(100vw - 80px);
                width: 600px;
                max-height: calc(100vh - 100px);
                height: 100%;
                padding: 5px;
                overflow-y: auto;
            }
                                    
            .btn-close {
                display: flex;
                justify-content: center;
                align-items: center;
                position: absolute;
                top: 4px;
                right: 4px;
                color: inherit;
                cursor: pointer;
                font-style: normal;
                font-weight: bold;
                padding: 6px;
                width: 40px;
                height: 20px;
            }
        `;
    }

}
window.customElements.define('brain-modale', BrainModale);
