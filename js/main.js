import BrainParticule from "./libs/BrainParticule.js";
import Carousel from "./libs/carousel.js";

function statistic(element, nb, time = 80) {
    let i = 1;
    const id = setInterval(() => {
        element.html(i);
        if (i >= nb) clearInterval(id);
        i++;
    }, time);
}

µ('[class*="reveal-"]', true).autoFadeIn('reveal-visible', (el) => {
    if(µ(el).has('stat-items')) {
        statistic(µ('.stat-items.one h1'), 23, 150);
        statistic(µ('.stat-items.two h1'), 12, 80);
        statistic(µ('.stat-items.three h1'), 6, 300);
    }
});

function obtenirNombreSelonTailleEcran() {
    const largeurMin = 320;
    const largeurMax = 1920
    const nombreMin = 30;
    const nombreMax = 50;
    const largeurEcran = window.innerWidth;
    const largeurClamped = Math.min(Math.max(largeurEcran, largeurMin), largeurMax);
    return nombreMin + ((largeurClamped - largeurMin) / (largeurMax - largeurMin)) * (nombreMax - nombreMin);
}

µ(function () {  

    new Carousel(µ('.clients').native, {
        visible: 3,
        scroll: 1,
        auto: true,
        time: 3000,
    });
    
    µ('.hamburger').click(() => {
        µ('.hamburger + .menu').toggle('show');
    });

    µ('.agency-typing').typingText(['solutions digitales', 'proximité'], 100);

    const canvas = new BrainParticule(µ('#canvas').native, window.innerWidth, 450);

    const particules = canvas.generateRandomParticules(obtenirNombreSelonTailleEcran(), {
        x: Math.random() * 1000, y: Math.random() * 1000, radius: 1.5, 
        color: "#fff", alpha: .5,
        vx: Math.random() * 3, vy: Math.random() * 3
    });

    
    canvas.animate(() => {
        canvas.connecteParticule(particules, 150, "#fff", .5, .1);
        canvas.drawParticule(particules);
    });

});
