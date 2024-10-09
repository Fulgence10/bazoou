(() => {
    /**
     * 
     */
    class BrainQuery {

        #elements = [];

        /**
         * 
         * @param {strin|HTMLElement|callback} args 
         * @param {boolean} all 
         * @param {HTMLElement} container 
         * @returns 
         */
        constructor(args, all, container) {
            if (container == null) {
                container = document;
            } else if (container instanceof BrainQuery) {
                container = container.native;
            } else {
                container = container;
            }

            if (this.#argType(args) == 'function') {
                return document.addEventListener('DOMContentLoaded', args);
            }

            if (this.#argType(args) == 'string') {
                if (all) {
                    this.#elements = container.querySelectorAll(args);
                } else {
                    this.#elements = [container.querySelector(args)];
                }
            } else if ((args instanceof Array) && !(args instanceof BrainQuery)) {
                this.#elements = args;
            } else {
                this.#elements = [args];
            }
        }

        /**
         * 
         * @param {HTMLElement} opt 
         * @returns 
         */
        #argType(element) { return typeof element }

        /**
         * 
         * @param {HTMLElement} element 
         */
        #isHTMLElement(element) { element instanceof HTMLElement }

        /**
         * 
         * @param {callback} fn 
         */
        #addFunction(fn) {
            this.#elements.forEach((element, i) => {
                if (this.#argType(element) == 'object' || this.#isHTMLElement(element)) {
                    fn.call(this, element, i);
                }
            });
        }

        /** return parent node */
        get parent() { return new BrainQuery(this.#elements[0].parentNode); }

        /** return elements length */
        get count() { return this.#elements.length; }

        /** return HTMLElement */
        get native() { return this.#elements[0]; }

        /** return all HTMLElement */
        get natives() { return this.#elements; }

        /** return window object */
        get win() { return new BrainQuery(window); }

        /** return document object */
        get doc() { return new BrainQuery(document); }

        get children() { return new BrainQuery(Array.from(this.#elements[0].children)); }

        /** return FORMElement */
        get forms() { return new BrainQuery(Array.from(document.forms)); }

        get inputFieldElements() { return new BrainQuery(Array.from(this.native.elements)); }

        /**
         * 
         * @param {integer} i 
         * @returns 
         */
        index(i = 0) { return new BrainQuery(this.#elements[i]); }

        /**
         * 
         * @param {string} property 
         * @param {string|integer} value 
         * @returns 
         */
        css(property, value) {
            this.#addFunction(element => element.style[property] = value);
            return this;
        }

        /**
         * 
         * @param {callback} fn 
         * @returns 
         */
        loop(fn) {
            this.#addFunction((element, i) => fn(new BrainQuery(element), i));
            return this;
        }

        /**
         * 
         * @param {string} dom 
         * @returns 
         */
        text(txt = null) {
            if (txt == null) {
                return this.#elements[0].innerText;
            }
            this.#elements[0].innerText = txt;
            return this;
        }

        /**
         * 
         * @param {string} dom 
         * @returns 
         */
        html(dom = null) {
            if (dom == null) {
                return this.#elements[0].innerHTML;
            }
            this.#elements[0].innerHTML = dom;
            return this;
        }

        /**
         * 
         * @param {string} dom 
         * @returns 
         */
        addHTML(dom = null) {
            this.#elements[0].innerHTML += dom;
            return this;
        }

        /**
         * 
         * @returns self
         */
        hide() {
            this.#addFunction(element => element.style.display = 'none');
            return this;
        }

        /**
         * 
         * @returns self
         */
        show() {
            this.#addFunction(element => element.style.display = 'inherit');
            return this;
        }

        /**
         * 
         * @returns self
         */
        timeOut(fn, time = 0) {
            const id = setTimeout(() => {
                this.#addFunction((element, i) => fn(new BrainQuery(element), i));
                clearInterval(id);
            }, time);
            return this;
        }

        /**
         * 
         * @param  {...any} className 
         * @returns self
         */
        addClass(...className) {
            this.#addFunction(element => element.classList.add(...className));
            return this;
        }

        /**
         * 
         * @param  {...any} className 
         * @returns self
         */
        removeClass(...className) {
            this.#addFunction(element => element.classList.remove(...className));
            return this;
        }

        /**
         * 
         * @param  {...any} className 
         * @returns self
         */
        toggle(...className) {
            this.#addFunction(element => element.classList.toggle(...className));
            return this;
        }

        /**
         * 
         * @param {string} className 
         * @returns boolean
         */
        has(className) { return this.#elements[0].classList.contains(className); }

        /**
         * 
         * @param {string} key 
         * @param {string} value 
         * @returns 
         */
        attr(key, value = null) {
            if (value == null) {
                return this.#elements[0].getAttribute(key);
            }
            this.#addFunction(element => element.setAttribute(key, value));
            return this;
        }

        /**
         * 
         * @param {string} tag 
         * @returns 
         */
        createElement(tag) {
            this.#elements = [document.createElement(tag)];
            return this;
        }

        /**
         * 
         * @param {HTMLElement|BrainQuery|null} container 
         * @returns 
         */
        addToDOM(container = null) {
            this.#addFunction(element => {
                if (container == null) {
                    container = document.body;
                } else if (this.#argType(container) == 'object' && !this.#isHTMLElement(container)) {
                    container = container.native;
                }
                container.appendChild(element);
            });
            return this;
        }

        /**
         * 
         * @param {HTMLElement|BrainQuery|null} container 
         * @returns 
         */
        removeToDOM(container = null) {
            this.#addFunction(element => {
                if (container == null) {
                    container = document.body;
                } else if (this.#argType(container) == 'object' && !this.#isHTMLElement(container)) {
                    container = container.native;
                }
                container.removeChild(element);
            });
            return this;
        }

        /**
         * 
         * @param {string} evName 
         * @param {callback} fn 
         * @param {object} opt 
         * @returns 
         */
        on(evName, fn, opt = null) {
            this.#addFunction(element => element.addEventListener(evName, function (e) {
                fn.call(new BrainQuery(e.target), e);
            }, opt));
            return this;
        }

        /**
         * 
         * @param {callback} fn 
         * @param {object} opt 
         * @returns 
         */
        submit(fn, opt = null) {
            this.on('submit', fn, opt);
            return this;
        }

        /**
         * 
         * @param {callback} fn 
         * @param {object} opt 
         * @returns 
         */
        click(fn, opt = null) {
            this.on('click', fn, opt);
            return this;
        }

        /**
         * 
         * @param {string} value 
         * @returns 
         */
        value(value = null) {
            if (value == null) {
                this.#addFunction(element => { value = element.value; });
                return value;
            }
            this.#addFunction(element => { return element.value = value; });
            return this;
        }

        /**
         * 
         * @param {string} url 
         * @param {object} options 
         */
        ajax(url, options = {}) {
            const xhr = new XMLHttpRequest();
            options = {
                ...{
                    method: 'POST',
                    data: {},
                    headers: {},
                    form: null,
                    success: () => { },
                    reject: () => { },
                    beforeResult: () => { },
                    afterResult: () => { }
                }, ...options
            };

            xhr.onreadystatechange = () => {
                options.beforeResult(xhr);
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        if (xhr.responseText) {
                            options.success(JSON.parse(xhr.responseText), options.form);
                            options.afterResult(xhr);
                        }
                    } else {
                        options.afterResult(xhr);
                        options.reject(JSON.parse(xhr.responseText), options.form);
                    }
                }
            }

            if (options.form == null) {
                var formD = new FormData()
                for (const key in options.data) {
                    formD.append(String(key), options.data[key]);
                }
            } else {
                var formD = new FormData(options.form);
            }

            xhr.open(options.method, url, true);
            for (const key in options.headers) {
                xhr.setRequestHeader(key, options.headers[key]);
            }
            xhr.setRequestHeader('X-Requested-with', 'XMLHttpRequest');
            xhr.send(formD);
        }

        /**
         * 
         * @param {Array} cards 
         * @param {object} config 
         */
        til3d = function (config = {}) {
            config = { ...{ scale: 1, max: 25, perspective: 1000 }, ...config }
            this.#elements.forEach(card => {
                // mousemove
                card.addEventListener('mousemove', e => {
                    const rect = card.getBoundingClientRect();
                    const width = rect.width;
                    const height = rect.height;
                    const centerX = rect.left + width / 2;
                    const centerY = rect.top + height / 2;
                    const mouseX = e.clientX - centerX;
                    const mouseY = e.clientY - centerY;
                    const rotateX = ((+1) * config.max * mouseY / (height / 2)).toFixed(2);
                    const rotateY = ((-1) * config.max * mouseX / (width / 2)).toFixed(2);
                    card.style.transition = 'transform .3s';
                    card.style.transform = `
                    perspective(${config.perspective}px)
                    rotateX(${rotateX}deg) rotateY(${rotateY}deg) 
                    scale3d(${config.scale}, ${config.scale}, ${config.scale})`;
                });
                // mouseout
                card.addEventListener('mouseout', e => {
                    card.style.transform = `
                    perspective(${config.perspective}px) 
                    rotateX(0deg) rotateY(0deg)
                    scale3d(1, 1, 1)`;
                });
            });
        }

        /**
         * 
         * @param {call} callback 
         * @param {HTMLElement} root 
         * @param {Float32Array} threshold 
         * @param {string} rootMargin 
         * @return self
         */
        fadeIn(callback, root = null, threshold = .1, rootMargin = '0px') {
            const observer = new IntersectionObserver(callback.bind(this), {
                root: root,
                rootMargin: rootMargin,
                threshold: threshold
            });
            this.loop(element => observer.observe(element.native));
            return this;
        }

        /**
         * 
         * @param {string} className 
         */
        autoFadeIn(className, fn, root = null, threshold = .1, rootMargin = '0px') {
            this.fadeIn(function (entries, observer) {
                entries.forEach(entry => {
                    if (entry.intersectionRatio > threshold) {
                        entry.target.classList.add(className);
                        entry.target.addEventListener('transitionend', e => {
                            entry.target.style.transition = `none`;
                        });
                        observer.unobserve(entry.target);
                        fn(entry.target);
                    }
                });
            }, root, threshold, rootMargin);
            return this;
        }

        /**
         * 
         * @param {integer} width 
         * @param {integer} height 
         * @returns 
         */
        toPDF(width = 1000, height = 8000) {
            const newWindows = window.open("", "", "height=" + height + ", width=" + width + ",toolbar=0, menubar=0, scrollbars=0, resizable=0, status=0, location=0, left=0, top=0");            
            if (! newWindows) return this;
            newWindows.document.body.style.backgroundColor = '#FFFFFF';
            newWindows.document.body.style.padding = "0px";
            newWindows.document.body.style.margin = "0px";
            newWindows.document.body.innerHTML += " " + this.html() + " ";
            newWindows.window.print();
            newWindows.window.close();
            return this;
        }

        /** return boolean */
        get #isGranted() { return Notification.permission == 'granted' || Notification.permission == 'default'; }
        
        /** return boolean */
        get #hasNotification() { return window.Notification !== undefined }

        /**
         * 
         * @param {callback} callback 
         * @returns self
         */
        requestPermissionNotify(callback) {
            if(this.#hasNotification) {
                if(this.#isGranted) {
                    callback.call(null, { notify: (title, options) => new Notification(title, options) }, false);
                    return this;
                }
                Notification.requestPermission().then((permission) => {
                    if (permission === "granted") {
                        callback.call(null, { notify: (title, options) => new Notification(title, options) }, false);
                        return this;
                    }
                });
            }
            callback(null, `Votre navigateur n'autorise pas les notifications`);
            console.log(`%cVotre navigateur n'autorise pas les notifications`, `
                color: #fff;
                background: #dc3545;
                padding: 15px;
                font-weight: bold;
                margin: 10px 0;
                border-radius: 5px;
            `);
            return this;
        }

        /**
         * 
         * @param {integer} i 
         */
        #writeText(i) {
            if (i < this.textTyping?.length) {
                let id = setTimeout(() => {
                    this.addHTML(this.textTyping[i]);
                    this.#writeText(i + 1);
                    clearTimeout(id);
                }, this.timeChar);
            } else {
                if (this.indexTyping < this.words.length) {
                    let id = setTimeout(() => {
                        i = 0;
                        this.indexTyping += 1;
                        this.textTyping = this.words[this.indexTyping];
                        this.html('');
                        this.#writeText(i);
                        clearTimeout(id);
                    }, this.timeWord);
                } else {
                    this.indexTyping = 0;
                    this.textTyping = this.words[this.indexTyping];
                    this.#writeText(0);
                }
            }
        }

        /**
         * 
         * @param {Array} words 
         * @param {integer} timeChar 
         * @param {integer} timeWord 
         */
        typingText(words = [], timeChar = 200, timeWord = 500) {
            this.indexTyping = 0;
            this.words = words;
            this.textTyping = this.words[this.indexTyping];
            this.timeChar = timeChar; 
            this.timeWord = timeWord;
            this.html('');
            this.#writeText(0);
        }

        /**
         * 
         * @param {string} str 
         * @returns string
         */
        #createRegExp(str) {
            let regexp = '\\b(.*)'
            for (let i = 0; i < str.length; i++) {
                regexp += '(' + str[i] + ')(.*)'
            }
            regexp += '\\b'
            return new RegExp(regexp, 'i')
        }

        /**
         * 
         * @param {string} query 
         * @returns 
         */
        search(input, display = 'inherit') {
            input.on('keyup', (e) => {
                const query = e.target.value;
                this.children.loop(element => {
                    if (element.text()) {
                        element.css('display', display);
                    }
                });
                if (query === '') return this;
                this.children.loop(element => {
                    const result = element.text().match(this.#createRegExp(query));
                    if (!result) {
                        element.hide();
                    }
                });
            });
            return this;
        }

        getCoordLocation(success = () => {}, reject = () => {}, options = {}) {
            if (navigator.geolocation) {
                var options = {...{
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }, ...options};
                
                navigator.geolocation.getCurrentPosition(success, reject, options);

            } else {
                console.error("La géolocalisation n'est pas prise en charge par ce navigateur.");
            }
        }

    }

    const init = function (args = null, all = false, container = null) {
        return new BrainQuery(args, all, container);
    }

    window.µ = init;

})();
