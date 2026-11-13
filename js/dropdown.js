/* ======================================================
   Publication Scout – Custom Comic Dropdown Component
   ====================================================== */

const instances = [];

function closeAll(except = null) {
    for (const inst of instances) {
        if (inst !== except) inst.close();
    }
}

export function initCustomDropdowns() {
    const selects = document.querySelectorAll('select.filter-select, select.page-size-select');

    selects.forEach((select) => {
        if (select.dataset.customized) return;
        select.dataset.customized = 'true';

        const wrapper = document.createElement('div');
        wrapper.className = select.classList.contains('page-size-select')
            ? 'comic-select comic-select-sm'
            : 'comic-select';

        const trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'comic-select-trigger';
        trigger.setAttribute('aria-haspopup', 'listbox');
        trigger.setAttribute('aria-expanded', 'false');
        if (select.getAttribute('aria-label')) {
            trigger.setAttribute('aria-label', select.getAttribute('aria-label'));
        }

        const labelSpan = document.createElement('span');
        labelSpan.className = 'comic-select-label';

        const arrowSpan = document.createElement('span');
        arrowSpan.className = 'comic-select-arrow';
        arrowSpan.setAttribute('aria-hidden', 'true');
        arrowSpan.innerHTML = `<svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>`;

        trigger.append(labelSpan, arrowSpan);

        const menu = document.createElement('ul');
        menu.className = 'comic-select-menu';
        menu.setAttribute('role', 'listbox');
        if (select.classList.contains('page-size-select')) {
            menu.classList.add('comic-select-menu-up');
        }

        const renderOptions = () => {
            menu.innerHTML = '';
            const selectedOpt = select.options[select.selectedIndex] || select.options[0];
            labelSpan.textContent = selectedOpt ? selectedOpt.textContent : '';
            wrapper.classList.toggle('has-value', select.value !== 'all' && !select.classList.contains('page-size-select'));

            Array.from(select.options).forEach((opt) => {
                const li = document.createElement('li');
                li.className = 'comic-select-option';
                li.setAttribute('role', 'option');
                li.dataset.value = opt.value;
                const isSelected = opt.value === select.value;
                li.setAttribute('aria-selected', String(isSelected));
                if (isSelected) li.classList.add('selected');

                li.innerHTML = `<span class="comic-opt-check" aria-hidden="true">${isSelected ? '✓' : ''}</span><span></span>`;
                li.querySelector('span:last-child').textContent = opt.textContent;

                li.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (select.value !== opt.value) {
                        select.value = opt.value;
                        select.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                    sync();
                    close();
                    trigger.focus();
                });

                menu.appendChild(li);
            });
        };

        const sync = () => {
            renderOptions();
        };

        const open = () => {
            closeAll(inst);
            wrapper.classList.add('open');
            trigger.setAttribute('aria-expanded', 'true');
        };

        const close = () => {
            wrapper.classList.remove('open');
            trigger.setAttribute('aria-expanded', 'false');
        };

        const inst = { sync, close };
        instances.push(inst);

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            if (wrapper.classList.contains('open')) close();
            else open();
        });

        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                const opts = Array.from(select.options);
                const dir = e.key === 'ArrowDown' ? 1 : -1;
                const nextIdx = (select.selectedIndex + dir + opts.length) % opts.length;
                select.value = opts[nextIdx].value;
                select.dispatchEvent(new Event('change', { bubbles: true }));
                sync();
            } else if (e.key === 'Escape') {
                close();
            }
        });

        select.addEventListener('change', sync);

        select.parentNode.insertBefore(wrapper, select);
        select.classList.add('sr-only');
        select.tabIndex = -1;
        wrapper.append(trigger, menu, select);

        renderOptions();
    });

    document.addEventListener('click', () => closeAll());
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAll();
    });
}

export function syncCustomDropdowns() {
    for (const inst of instances) inst.sync();
}
