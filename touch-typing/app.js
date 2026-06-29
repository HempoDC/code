const keyboardLayout = [
    [
        { main: '§', sub: '½', id: 'Backquote' },
        { main: '1', sub: '!', id: 'Digit1' },
        { main: '2', sub: '"', id: 'Digit2' },
        { main: '3', sub: '#', id: 'Digit3' },
        { main: '4', sub: '¤', id: 'Digit4' },
        { main: '5', sub: '%', id: 'Digit5' },
        { main: '6', sub: '&', id: 'Digit6' },
        { main: '7', sub: '/', id: 'Digit7' },
        { main: '8', sub: '(', id: 'Digit8' },
        { main: '9', sub: ')', id: 'Digit9' },
        { main: '0', sub: '=', id: 'Digit0' },
        { main: '+', sub: '?', id: 'Minus' },
        { main: '´', sub: '`', id: 'Equal' },
        { main: 'Backspace', id: 'Backspace', class: 'wide' }
    ],
    [
        { main: 'Tab', id: 'Tab', class: 'wide' },
        { main: 'Q', id: 'KeyQ' },
        { main: 'W', id: 'KeyW' },
        { main: 'E', id: 'KeyE' },
        { main: 'R', id: 'KeyR' },
        { main: 'T', id: 'KeyT' },
        { main: 'Y', id: 'KeyY' },
        { main: 'U', id: 'KeyU' },
        { main: 'I', id: 'KeyI' },
        { main: 'O', id: 'KeyO' },
        { main: 'P', id: 'KeyP' },
        { main: 'Å', id: 'BracketLeft' },
        { main: '¨', sub: '^', id: 'BracketRight' },
        { main: 'Enter', id: 'Enter', class: 'wide' }
    ],
    [
        { main: 'Caps', id: 'CapsLock', class: 'wider' },
        { main: 'A', id: 'KeyA' },
        { main: 'S', id: 'KeyS' },
        { main: 'D', id: 'KeyD' },
        { main: 'F', id: 'KeyF' },
        { main: 'G', id: 'KeyG' },
        { main: 'H', id: 'KeyH' },
        { main: 'J', id: 'KeyJ' },
        { main: 'K', id: 'KeyK' },
        { main: 'L', id: 'KeyL' },
        { main: 'Ö', id: 'Semicolon' },
        { main: 'Ä', id: 'Quote' },
        { main: "'", sub: '*', id: 'Backslash' },
    ],
    [
        { main: 'Shift', id: 'ShiftLeft', class: 'widest' },
        { main: '<', sub: '>', id: 'IntlBackslash' },
        { main: 'Z', id: 'KeyZ' },
        { main: 'X', id: 'KeyX' },
        { main: 'C', id: 'KeyC' },
        { main: 'V', id: 'KeyV' },
        { main: 'B', id: 'KeyB' },
        { main: 'N', id: 'KeyN' },
        { main: 'M', id: 'KeyM' },
        { main: ',', sub: ';', id: 'Comma' },
        { main: '.', sub: ':', id: 'Period' },
        { main: '-', sub: '_', id: 'Slash' },
        { main: 'Shift', id: 'ShiftRight', class: 'widest' }
    ],
    [
        { main: 'Ctrl', id: 'ControlLeft', class: 'wide' },
        { main: 'Opt', id: 'AltLeft', class: 'wide' },
        { main: 'Cmd', id: 'MetaLeft', class: 'wide' },
        { main: 'Space', id: 'Space', class: 'space' },
        { main: 'Cmd', id: 'MetaRight', class: 'wide' },
        { main: 'Opt', id: 'AltRight', class: 'wide' }
    ]
];

const lessons = [
    { name: "1.1: Index Fingers (F, J)", text: "ffff jjjj fj jf ff jj fjf jfj" },
    { name: "1.2: Middle Fingers (D, K)", text: "dddd kkkk dk kd dfjk kfjd" },
    { name: "1.3: Ring Fingers (S, L)", text: "ssss llll sl ls sldf klsd" },
    { name: "1.4: Pinkies (A, Ö, Ä)", text: "aaaa öööö ääää aöä öäa asdf jklöä" },
    { name: "1.5: Home Row Review", text: "asdf jklöä asdf jklöä fads lkjöä" },
    { name: "2.1: Index Reach (G, H)", text: "fg jh gf hj fghj jhgf" },
    { name: "2.2: Home Row + G/H", text: "asdfg jklöäh gha asdf gh" },
    { name: "3.1: Top Row Index (R, T, Y, U)", text: "fr ft jy ju rtyu uytr" },
    { name: "3.2: Top Row Middle/Ring (E, I, W, O)", text: "de ki sw lo e i w o eiwo owie" },
    { name: "3.3: Top Row Pinkies (Q, P, Å)", text: "aq öp äå q p å qp åpq" },
    { name: "3.4: Top Row Review", text: "qwerty uiopå asdfg hjklöä" },
    { name: "4.1: Bottom Row Index (V, B, N, M)", text: "fv fb jn jm v b n m vbnm mnbv" },
    { name: "4.2: Bottom Row Rest (Z, X, C, , . -)", text: "az sx dc k, l. ö- zxcv bn,.-" },
    { name: "4.3: Bottom Row Review", text: "zxcvb nm,.- qwerty asdfg" },
    { name: "5.1: Symbols (1)", text: "! @ # $ % ^ & * ( )" },
    { name: "5.2: Symbols (2)", text: "_ + - = [ ] { } ; ' : \" , . / < > ?" }
];

const fingerMapping = {
    'Backquote': 'left-pinky', 'Digit1': 'left-pinky', 'Tab': 'left-pinky', 'KeyQ': 'left-pinky', 'CapsLock': 'left-pinky', 'KeyA': 'left-pinky', 'ShiftLeft': 'left-pinky', 'IntlBackslash': 'left-pinky', 'KeyZ': 'left-pinky', 'ControlLeft': 'left-pinky', 'AltLeft': 'left-pinky',
    'Digit2': 'left-ring', 'KeyW': 'left-ring', 'KeyS': 'left-ring', 'KeyX': 'left-ring',
    'Digit3': 'left-middle', 'KeyE': 'left-middle', 'KeyD': 'left-middle', 'KeyC': 'left-middle',
    'Digit4': 'left-index', 'Digit5': 'left-index', 'KeyR': 'left-index', 'KeyT': 'left-index', 'KeyF': 'left-index', 'KeyG': 'left-index', 'KeyV': 'left-index', 'KeyB': 'left-index',
    'Digit6': 'right-index', 'Digit7': 'right-index', 'KeyY': 'right-index', 'KeyU': 'right-index', 'KeyH': 'right-index', 'KeyJ': 'right-index', 'KeyN': 'right-index', 'KeyM': 'right-index',
    'Digit8': 'right-middle', 'KeyI': 'right-middle', 'KeyK': 'right-middle', 'Comma': 'right-middle',
    'Digit9': 'right-ring', 'KeyO': 'right-ring', 'KeyL': 'right-ring', 'Period': 'right-ring',
    'Digit0': 'right-pinky', 'Minus': 'right-pinky', 'Equal': 'right-pinky', 'Backspace': 'right-pinky', 'KeyP': 'right-pinky', 'BracketLeft': 'right-pinky', 'BracketRight': 'right-pinky', 'Enter': 'right-pinky', 'Semicolon': 'right-pinky', 'Quote': 'right-pinky', 'Backslash': 'right-pinky', 'Slash': 'right-pinky', 'ShiftRight': 'right-pinky',
    'Space': 'right-thumb',
    'MetaLeft': 'left-thumb', 'MetaRight': 'right-thumb', 'AltRight': 'right-thumb'
};

let currentLessonIndex = 0;
let targetText = "";
let currentIndex = 0;
let startTime = null;
let errors = 0;
let totalTyped = 0;
let isActive = false;

const textDisplay = document.getElementById('text-display');
const keyboardContainer = document.getElementById('keyboard');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const lessonSelect = document.getElementById('lesson-select');
const instructionText = document.getElementById('instruction-text');
const progressBar = document.getElementById('progress-bar');

function initializeLessons() {
    lessonSelect.innerHTML = '';
    lessons.forEach((lesson, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = lesson.name;
        lessonSelect.appendChild(option);
    });
}

function generateKeyboard() {
    keyboardContainer.innerHTML = '';
    keyboardLayout.forEach(row => {
        const rowEl = document.createElement('div');
        rowEl.className = 'keyboard-row';
        row.forEach(key => {
            const keyEl = document.createElement('div');
            keyEl.className = `key ${key.class || ''}`;
            keyEl.id = key.id;
            
            if (key.sub) {
                const subLabel = document.createElement('span');
                subLabel.className = 'sub-label';
                subLabel.textContent = key.sub;
                keyEl.appendChild(subLabel);
            }
            
            if (key.main) {
                const mainLabel = document.createElement('span');
                mainLabel.className = 'main-label';
                mainLabel.textContent = key.main;
                keyEl.appendChild(mainLabel);
            }
            
            rowEl.appendChild(keyEl);
        });
        keyboardContainer.appendChild(rowEl);
    });
}

function renderText() {
    textDisplay.innerHTML = '';
    for (let i = 0; i < targetText.length; i++) {
        const charSpan = document.createElement('span');
        charSpan.className = 'char';
        if (i === currentIndex && isActive) {
            charSpan.classList.add('current');
        } else if (i === currentIndex && !isActive && i === 0) {
            charSpan.classList.add('current');
        }
        
        // Handle spaces for visibility
        if (targetText[i] === ' ') {
            charSpan.innerHTML = '&nbsp;';
        } else {
            charSpan.textContent = targetText[i];
        }
        textDisplay.appendChild(charSpan);
    }
    updateTargetKey();
}

function resetStats() {
    currentIndex = 0;
    errors = 0;
    totalTyped = 0;
    startTime = null;
    isActive = false;
    wpmElement.textContent = '0';
    accuracyElement.textContent = '100%';
    instructionText.textContent = 'Start typing to begin. Press Enter to reset.';
    if (progressBar) progressBar.style.width = '0%';
    
    // Remove all correct/incorrect classes
    const chars = textDisplay.querySelectorAll('.char');
    chars.forEach(char => {
        char.classList.remove('correct', 'incorrect', 'current');
    });
    
    if (chars.length > 0) {
        chars[0].classList.add('current');
    }
}

function loadLesson(index) {
    currentLessonIndex = index;
    targetText = lessons[index].text;
    lessonSelect.value = index;
    resetStats();
    renderText();
}

function updateProgress() {
    if (targetText.length === 0) return;
    const progress = (currentIndex / targetText.length) * 100;
    if (progressBar) progressBar.style.width = `${progress}%`;
}

function updateTargetKey() {
    // Remove target class from all keys and fingers
    document.querySelectorAll('.key.target').forEach(key => key.classList.remove('target'));
    document.querySelectorAll('.finger.target').forEach(finger => finger.classList.remove('target'));
    
    if (currentIndex < targetText.length) {
        const targetChar = targetText[currentIndex];
        
        // Find key with matching main or sub label
        let targetKeyEl = null;
        if (targetChar === ' ') {
            targetKeyEl = document.getElementById('Space');
        } else {
            // Find by looking through layout to match char (case insensitive for letters)
            const upperChar = targetChar.toUpperCase();
            for (const row of keyboardLayout) {
                for (const key of row) {
                    if ((key.main && key.main.toUpperCase() === upperChar) || key.sub === targetChar || key.main === targetChar) {
                        targetKeyEl = document.getElementById(key.id);
                        break;
                    }
                }
                if (targetKeyEl) break;
            }
        }
        
        if (targetKeyEl) {
            targetKeyEl.classList.add('target');
            
            const fingerId = fingerMapping[targetKeyEl.id];
            if (fingerId) {
                document.getElementById(fingerId).classList.add('target');
                if (targetKeyEl.id === 'Space') {
                    document.getElementById('left-thumb').classList.add('target');
                }
            }
        }
    }
}

function calculateStats() {
    if (!startTime) return;
    
    const timeElapsed = (Date.now() - startTime) / 60000; // in minutes
    if (timeElapsed > 0) {
        // Standard WPM formula: (characters / 5) / minutes
        const wpm = Math.round((totalTyped / 5) / timeElapsed);
        wpmElement.textContent = wpm > 0 ? wpm : 0;
    }
    
    const accuracy = totalTyped > 0 ? Math.round(((totalTyped - errors) / totalTyped) * 100) : 100;
    accuracyElement.textContent = `${accuracy}%`;
}

document.addEventListener('keydown', (e) => {
    // Ignore meta keys
    if (e.metaKey || e.altKey || e.ctrlKey) return;
    
    // Prevent default browser behavior for space and single quotes so page doesn't scroll/find
    if (e.key === ' ' || e.key === "'") {
        e.preventDefault();
    }
    
    // Reset on Enter
    if (e.key === 'Enter') {
        loadLesson(currentLessonIndex);
        return;
    }
    
    // If finished, do nothing until reset
    if (currentIndex >= targetText.length) return;
    
    // Visual key press
    const keyEl = document.getElementById(e.code);
    if (keyEl) {
        keyEl.classList.add('active');
        setTimeout(() => keyEl.classList.remove('active'), 150);
    }
    
    // Ignore non-character keys (shift, caps lock, etc)
    if (e.key.length > 1 && e.key !== 'Spacebar' && e.code !== 'Space') return;
    
    if (!isActive) {
        isActive = true;
        startTime = Date.now();
        instructionText.textContent = 'Typing... Press Enter to reset.';
    }
    
    const typedChar = e.key;
    const expectedChar = targetText[currentIndex];
    
    const charElements = textDisplay.querySelectorAll('.char');
    const currentCharEl = charElements[currentIndex];
    
    totalTyped++;
    
    // Check if correct
    if (typedChar === expectedChar) {
        currentCharEl.classList.remove('current', 'incorrect');
        currentCharEl.classList.add('correct');
        currentIndex++;
        
        if (currentIndex < targetText.length) {
            charElements[currentIndex].classList.add('current');
        } else {
            isActive = false;
            updateTargetKey(); // Clear highlights
            
            if (errors === 0) {
                if (currentLessonIndex < lessons.length - 1) {
                    instructionText.textContent = 'Perfect! Moving to next level...';
                    setTimeout(() => {
                        loadLesson(currentLessonIndex + 1);
                    }, 1500);
                } else {
                    instructionText.textContent = 'Course complete! You are a touch typing master!';
                }
            } else {
                instructionText.textContent = `You made ${errors} errors. Restarting level...`;
                setTimeout(() => {
                    loadLesson(currentLessonIndex);
                }, 1500);
            }
        }
        updateProgress();
    } else {
        errors++;
        currentCharEl.classList.remove('correct');
        currentCharEl.classList.add('incorrect');
        
        // Visual error on keyboard
        if (keyEl) {
            keyEl.classList.add('error');
            setTimeout(() => keyEl.classList.remove('error'), 300);
        }
    }
    
    updateTargetKey();
    calculateStats();
});

lessonSelect.addEventListener('change', (e) => {
    loadLesson(parseInt(e.target.value));
});

// Initialize
initializeLessons();
generateKeyboard();
loadLesson(0);
