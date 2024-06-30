document.addEventListener('DOMContentLoaded', function() {
    // Swiper
    new Swiper('.swiper-container', {
        slidesPerView: 3,
        spaceBetween: 30,
        slidesPerGroup: 3,
        loop: true,
        loopFillGroupWithBlank: true,
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    });

    // Rozmiar fontu
    const defaultFontSize = 16;
    let currentFontSize = defaultFontSize;
    const adjustableElements = document.querySelectorAll('.font-adjustable');

    function adjustFontSize(increase) {
        currentFontSize += increase ? 2 : -2;
        if (currentFontSize < 10) currentFontSize = 10; // Minimum font size limit
        if (currentFontSize > 40) currentFontSize = 40; // Maximum font size limit
        adjustableElements.forEach(el => el.style.fontSize = `${currentFontSize}px`);
    }

    const increaseFontButton = document.getElementById('increaseFont');
    const decreaseFontButton = document.getElementById('decreaseFont');
    const increaseLineHeightButton = document.getElementById('increaseLineHeight');
    const increaseLetterSpacingButton = document.getElementById('increaseLetterSpacing');
    const resetSettingsButton = document.getElementById('resetSettings');

    increaseFontButton.addEventListener('click', () => adjustFontSize(true));
    decreaseFontButton.addEventListener('click', () => adjustFontSize(false));

    increaseFontButton.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            increaseFontButton.click();
        }
    });

    decreaseFontButton.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            decreaseFontButton.click();
        }
    });

    // interlinia i światła między wyrazami
    const defaultLineHeight = 1.6, defaultLetterSpacing = 0;
    let currentLineHeight = defaultLineHeight, currentLetterSpacing = defaultLetterSpacing;

    function adjustStyle(prop, increase, unit) {
        if (prop === 'lineHeight') currentLineHeight += increase ? 0.2 : -0.2;
        else if (prop === 'letterSpacing') currentLetterSpacing += increase ? 0.5 : -0.5;
        adjustableElements.forEach(el => el.style[prop] = `${prop === 'lineHeight' ? currentLineHeight : currentLetterSpacing}${unit}`);
    }

    increaseLineHeightButton.addEventListener('click', () => adjustStyle('lineHeight', true, ''));
    increaseLetterSpacingButton.addEventListener('click', () => adjustStyle('letterSpacing', true, 'px'));

    increaseLineHeightButton.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            increaseLineHeightButton.click();
        }
    });

    increaseLetterSpacingButton.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            increaseLetterSpacingButton.click();
        }
    });

    // kontrasty
    const body = document.body;
    const modes = { toggleContrast: 'high-contrast', yellowMode: 'yellow-mode', greenMode: 'green-mode' };

    Object.keys(modes).forEach(id => {
        document.getElementById(id).addEventListener('click', () => {
            Object.values(modes).forEach(mode => body.classList.toggle(mode, modes[id] === mode));
        });

        document.getElementById(id).addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                document.getElementById(id).click();
            }
        });
    });

    // Restart ustawien
    resetSettingsButton.addEventListener('click', () => {
        currentFontSize = defaultFontSize;
        currentLineHeight = defaultLineHeight;
        currentLetterSpacing = defaultLetterSpacing;
        adjustableElements.forEach(el => {
            el.style.fontSize = `${defaultFontSize}px`;
            el.style.lineHeight = `${defaultLineHeight}`;
            el.style.letterSpacing = `${defaultLetterSpacing}px`;
        });
        Object.values(modes).forEach(mode => body.classList.remove(mode));
    });

    resetSettingsButton.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            resetSettingsButton.click();
        }
    });

    // Modal 
    function setupModal(modalId, triggerIds) {
        const modal = document.getElementById(modalId);
        const closeBtn = modal.querySelector('.close');

        const toggleModal = (display) => {
            modal.style.display = display;
            if (display === 'block') closeBtn.focus();
        };

        triggerIds.forEach(triggerId => {
            const trigger = document.getElementById(triggerId);
            if (trigger) {
                trigger.addEventListener('click', () => toggleModal('block'));
                trigger.addEventListener('keydown', e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleModal('block');
                    }
                });
            }
        });

        closeBtn.addEventListener('click', () => toggleModal('none'));
        closeBtn.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleModal('none');
            }
        });
        window.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                toggleModal('none');
            }
        });
        window.addEventListener('click', e => {
            if (e.target === modal) {
                toggleModal('none');
            }
        });
    }

    setupModal('signupModal', ['signupButton', 'signupButton2']);

    // walidacja formularza
    const nameInput = document.getElementById('name');
    const nameError = document.getElementById('nameError');
    const statusMessage = document.getElementById('statusMessage');

    nameInput.addEventListener('input', () => {
        const invalid = /[^a-zA-Z\s]/.test(nameInput.value);
        nameError.textContent = invalid ? 'Imię może zawierać tylko litery i spacje.' : '';
        nameError.style.display = invalid ? 'block' : 'none';
        nameInput.setAttribute('aria-invalid', invalid.toString());
        if (invalid) {
            statusMessage.textContent = 'Imię może zawierać tylko litery i spacje.';
        } else {
            statusMessage.textContent = '';
        }
    });

    if (invalid) {
        nameInput.setAttribute('aria-describedby', 'nameError');
        statusMessage.textContent = 'Imię może zawierać tylko litery i spacje.';
    } else {
        nameInput.removeAttribute('aria-describedby');
        statusMessage.textContent = '';
    }

    const dayInput = document.getElementById('day');
    const timeInput = document.getElementById('time');

    dayInput.addEventListener('input', () => {
        const hours = { "0": null, "1": ["08:00", "18:00"], "2": ["08:00", "17:00"], "3": ["09:00", "17:00"], "4": ["09:00", "16:00"], "5": ["10:00", "15:00"], "6": ["11:00", "14:00"] };
        const day = new Date(dayInput.value).getUTCDay();
        const availableHours = hours[day];

        if (availableHours) {
            [timeInput.min, timeInput.max] = availableHours;
            timeInput.disabled = false;
            timeInput.setAttribute('aria-invalid', 'false');
            statusMessage.textContent = '';
        } else {
            timeInput.value = '';
            timeInput.disabled = true;
            timeInput.setAttribute('aria-invalid', 'true');
            statusMessage.textContent = 'Brak dostępnych godzin dla wybranego dnia.';
        }
    });

    document.getElementById('signupForm').addEventListener('submit', function(event) {
        event.preventDefault();
        if (nameError.style.display === 'block') {
            statusMessage.textContent = 'Popraw błędy w formularzu przed wysłaniem.';
            alert('Popraw błędy w formularzu przed wysłaniem.');
        } else {
            statusMessage.textContent = 'Formularz został wysłany!';
            alert('Formularz został wysłany!');
            document.getElementById('signupModal').style.display = 'none';
        }
    });

    // Nawigazja
    document.querySelectorAll('nav ul li').forEach(button => {
        button.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });
});
