const wrapper = µ('.brain-wrapper', true);
if (wrapper.get(0)) {
    let isDrag = false;
    const scrolling = (e) => {
        wrapper.each(w => {
            w.get(0).scrollLeft -= e.movementX * 100;
        });
    }
    wrapper.on('mousedown', e => {
        e.preventDefault();
        isDrag = true;
        scrolling(e);
    });
    wrapper.on('mousemove', e => {
        e.preventDefault();
        if (isDrag) {
            scrolling(e);
        }
    });
    µ(document).on('mouseup', e => {
        isDrag = false;
    });
}
