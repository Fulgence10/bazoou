/**
 * <div class="form_block">
        <img src="assert/logo.svg" alt="logo" id="logo">
        <h3>Passer lacommande</h3>
        <form action="#">
            <div class="fields">
                <label for="" class="field_label">Nom</label>
                <input type="text" class="field_input">
            </div>
        </form>
    </div>
 * @param {HTMLElement[]} form_items 
 */
export function fromInteraction (form_items) {
    form_items.forEach(item => {
        const input = µIn('input', item);
        const inputOther = ['time', 'date', 'date-time'];

        if(inputOther.includes(input.type)) {
            item.classList.add('has_label');
        }
        
        input.addEventListener('focus', function(e) {
            item.classList.add('is_focus', 'has_label');
        });

        input.addEventListener('blur', function(e) {
            if(this.value === '' && ! inputOther.includes(input.type)) {
                item.classList.remove('has_label');
            }
            item.classList.remove('is_focus');
        });
    });
}