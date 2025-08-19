document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DEL DOM ---
    const scoreEl = document.getElementById('score');
    const dinoNameEl = document.getElementById('dino-name');
    const dinoImageEl = document.getElementById('dino-image');
    const dinoFactEl = document.getElementById('dino-fact');
    const problemTextEl = document.getElementById('problem-text');
    const answerOptionsEl = document.getElementById('answer-options');
    const nextButton = document.getElementById('next-button');
    const feedbackModal = document.getElementById('feedback-modal');
    const feedbackTextEl = document.getElementById('feedback-text');
    const feedbackIconEl = document.getElementById('feedback-icon');
    const closeModalButton = document.getElementById('close-modal');
    const levelTitleEl = document.getElementById('level-title');
    const musicToggleButton = document.getElementById('music-toggle');

    // --- ELEMENTOS DE LA PANTALLA DE INICIO ---
    const startScreen = document.getElementById('start-screen');
    const playerNameInput = document.getElementById('player-name-input');
    const avatarOptions = document.querySelectorAll('.avatar-option');
    const startGameButton = document.getElementById('start-game-button');
    const gameContainer = document.getElementById('game-container');
    const playerAvatarEl = document.getElementById('player-avatar');
    const playerNameEl = document.getElementById('player-name');

    // --- ELEMENTOS DE LA PANTALLA DE SELECCIÓN DE NIVEL ---
    const levelSelectScreen = document.getElementById('level-select-screen');
    const playerMarker = document.getElementById('player-marker');
    const levelNodes = document.querySelectorAll('.level-node');

    // --- ELEMENTOS DEL MODAL DE FIN DE NIVEL ---
    const levelEndModal = document.getElementById('level-end-modal');
    const levelEndTitle = document.getElementById('level-end-title');
    const levelEndScore = document.getElementById('level-end-score');
    const levelEndMessage = document.getElementById('level-end-message');
    const levelEndNextButton = document.getElementById('level-end-next-button');

    // --- ELEMENTOS DE LA PANTALLA FINAL ---
    const endScreen = document.getElementById('end-screen');
    const finalPlayerNameEl = document.getElementById('final-player-name');
    const finalScoreEl = document.getElementById('final-score');
    const playAgainButton = document.getElementById('play-again-button');
    const animationContainer = document.getElementById('animation-container');

    // --- ESTADO DEL JUEGO ---
    let score = 0;
    let currentProblemSet = [];
    let currentProblemIndex = 0;
    let currentLevelIndex = 0;
    let correctAnswersInLevel = 0;
    const QUESTIONS_PER_LEVEL = 4;
    const MIN_SCORE_TO_PASS = 70; // 3 correct answers * 25 points = 75
    let correctStreak = 0;
    let player = { name: '', avatar: '', unlockedLevels: 1 };

    // --- DATOS DEL JUEGO (DINOSAURIOS Y PROBLEMAS) ---
    const dinosaurs = [
        { name: "Tiranosaurio Rex", image: "trex_realistic.png" },
        { name: "Triceratops", image: "triceratops_realistic.png" },
        { name: "Estegosaurio", image: "stegosaurus.png" },
        { name: "Velociraptor", image: "velociraptor.png" }
    ];

    const problems = [
        // Fracciones y Decimales
        { question: "¿Cuánto es 3/4 + 1/4?", options: ["1", "1/2", "3/8", "4/8"], answer: "1" },
        { question: "Si tienes 100 córdobas y gastas 25.50, ¿cuánto te queda?", options: ["74.50", "75.50", "74.00", "84.50"], answer: "74.50" },
        { question: "Convierte 0.5 a fracción.", options: ["1/2", "1/5", "2/5", "1/4"], answer: "1/2" },
        { question: "El T-Rex come 2/5 de su comida en la mañana y 1/5 en la tarde. ¿Qué fracción comió en total?", options: ["3/5", "2/25", "3/10", "1/5"], answer: "3/5" },
        
        // Geometría
        { question: "Un corral rectangular para dinosaurios mide 20 metros de largo y 10 metros de ancho. ¿Cuál es su área?", options: ["200 m²", "60 m²", "30 m²", "2000 m²"], answer: "200 m²" },
        { question: "Si el mismo corral mide 20m de largo y 10m de ancho, ¿cuál es su perímetro?", options: ["60 m", "200 m", "30 m", "100 m"], answer: "60 m" },
        { question: "¿Cuántos grados tiene un ángulo recto?", options: ["90°", "180°", "45°", "360°"], answer: "90°" },

        // Operaciones básicas
        { question: "Un equipo de paleontólogos encontró 125 fósiles cada día durante 5 días. ¿Cuántos fósiles encontraron en total?", options: ["625", "525", "130", "600"], answer: "625" },
        { question: "Si un Brachiosaurus come 150 kg de plantas al día, ¿cuántos kg comerá en una semana (7 días)?", options: ["1050 kg", "950 kg", "157 kg", "750 kg"], answer: "1050 kg" },
        { question: "Hay 48 huevos de dinosaurio y se reparten en 4 incubadoras. ¿Cuántos huevos hay por incubadora?", options: ["12", "10", "44", "192"], answer: "12" }
    ];

    const levels = [
        {
            name: "Nivel 1: Operaciones Básicas",
            problems: [
                { question: "Un equipo de paleontólogos encontró 125 fósiles cada día durante 5 días. ¿Cuántos fósiles encontraron en total?", options: ["625", "525", "130", "600"], answer: "625" },
                { question: "Si un Brachiosaurus come 150 kg de plantas al día, ¿cuántos kg comerá en una semana (7 días)?", options: ["1050 kg", "950 kg", "157 kg", "750 kg"], answer: "1050 kg" },
                { question: "Hay 48 huevos de dinosaurio y se reparten en 4 incubadoras. ¿Cuántos huevos hay por incubadora?", options: ["12", "10", "44", "192"], answer: "12" },
                { question: "En una manada de 35 Triceratops, 12 se van a beber agua. ¿Cuántos quedan?", options: ["23", "47", "25", "33"], answer: "23" }
            ]
        },
        {
            name: "Nivel 2: Fracciones y Decimales",
            problems: [
                 { question: "¿Cuánto es 3/4 + 1/4?", options: ["1", "1/2", "3/8", "4/8"], answer: "1" },
                { question: "Si tienes 100 córdobas y gastas 25.50, ¿cuánto te queda?", options: ["74.50", "75.50", "74.00", "84.50"], answer: "74.50" },
                { question: "Convierte 0.5 a fracción.", options: ["1/2", "1/5", "2/5", "1/4"], answer: "1/2" },
                { question: "El T-Rex come 2/5 de su comida en la mañana y 1/5 en la tarde. ¿Qué fracción comió en total?", options: ["3/5", "2/25", "3/10", "1/5"], answer: "3/5" }
            ]
        },
        {
            name: "Nivel 3: Geometría",
             problems: [
                { question: "Un corral rectangular para dinosaurios mide 20 metros de largo y 10 metros de ancho. ¿Cuál es su área?", options: ["200 m²", "60 m²", "30 m²", "2000 m²"], answer: "200 m²" },
                { question: "Si el mismo corral mide 20m de largo y 10m de ancho, ¿cuál es su perímetro?", options: ["60 m", "200 m", "30 m", "100 m"], answer: "60 m" },
                { question: "¿Cuántos grados tiene un ángulo recto?", options: ["90°", "180°", "45°", "360°"], answer: "90°" },
                { question: "Un fósil circular tiene un diámetro de 10cm. ¿Cuál es su radio?", options: ["5 cm", "10 cm", "20 cm", "3.14 cm"], answer: "5 cm" }
            ]
        }
    ];

    // --- LÓGICA DE AUDIO ---
    let audioContext;
    const soundBuffers = {};
    let backgroundMusicSource;
    let isMusicPlaying = false;

    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    async function loadSound(name, url, loop = false) {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            soundBuffers[name] = { buffer: audioBuffer, loop: loop };
        } catch (error) {
            console.error(`Error loading sound ${name}:`, error);
        }
    }

    function playSound(name) {
        if (!audioContext || !soundBuffers[name]) return;
        const source = audioContext.createBufferSource();
        source.buffer = soundBuffers[name].buffer;
        source.loop = soundBuffers[name].loop;
        source.connect(audioContext.destination);
        source.start(0);

        if (name === 'background') {
            if (backgroundMusicSource) {
                backgroundMusicSource.stop();
            }
            backgroundMusicSource = source;
            isMusicPlaying = true;
            musicToggleButton.textContent = '🔊';
        }
    }
    
    function toggleMusic() {
        if (!audioContext) return;
        if (isMusicPlaying) {
            backgroundMusicSource.stop();
            isMusicPlaying = false;
            musicToggleButton.textContent = '🔇';
        } else {
            playSound('background');
        }
    }
    
    // --- LÓGICA DEL JUEGO ---
    function setupStartScreen() {
        let selectedAvatar = null;

        function validateSelection() {
            const name = playerNameInput.value.trim();
            if (name && selectedAvatar) {
                startGameButton.disabled = false;
            } else {
                startGameButton.disabled = true;
            }
        }

        playerNameInput.addEventListener('input', validateSelection);

        avatarOptions.forEach(avatar => {
            avatar.addEventListener('click', () => {
                avatarOptions.forEach(opt => opt.classList.remove('selected'));
                avatar.classList.add('selected');
                selectedAvatar = avatar.dataset.avatar;
                validateSelection();
            });
        });

        startGameButton.addEventListener('click', () => {
            player.name = playerNameInput.value.trim();
            player.avatar = selectedAvatar;
            
            playerNameEl.textContent = player.name;
            playerAvatarEl.src = player.avatar;
            playerMarker.src = player.avatar;
            
            startScreen.classList.add('hidden');
            showLevelSelect();

            // Inicializar audio en la primera interacción del usuario
            if (!audioContext) {
                initAudio();
                loadSound('correct', 'correct.mp3');
                loadSound('incorrect', 'incorrect.mp3');
                loadSound('background', 'background_music.mp3', true).then(() => {
                    playSound('background');
                });
            }
            
            // startGame(); // Game no longer starts automatically
        });
    }

    function showLevelSelect() {
        gameContainer.classList.add('hidden');
        levelSelectScreen.classList.remove('hidden');
        updateLevelNodes();
        updatePlayerMarker();
    }

    function updateLevelNodes() {
        levelNodes.forEach(node => {
            const level = parseInt(node.dataset.level);
            if (level < player.unlockedLevels) {
                node.classList.remove('locked');
                node.addEventListener('click', () => selectLevel(level));
            } else {
                node.classList.add('locked');
                node.removeEventListener('click', () => selectLevel(level));
            }
        });
    }

    function updatePlayerMarker() {
        // Position marker at the last unlocked level.
        const targetLevel = Math.max(1, player.unlockedLevels);
        const targetNode = document.getElementById(`level-node-${targetLevel}`);
        if (targetNode) {
            playerMarker.style.left = targetNode.style.left;
            playerMarker.style.top = targetNode.style.top;
        }
    }
    
    function selectLevel(levelIndex) {
        currentLevelIndex = levelIndex;
        levelSelectScreen.classList.add('hidden');
        startGame();
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function startGame() {
        score = 0;
        correctAnswersInLevel = 0;
        correctStreak = 0;
        scoreEl.textContent = score;
        
        endScreen.classList.add('hidden');
        gameContainer.classList.remove('hidden');

        startLevel();
    }

    function startLevel() {
        const level = levels[currentLevelIndex];
        correctAnswersInLevel = 0;
        levelTitleEl.textContent = level.name;
        
        currentProblemSet = [...level.problems];
        shuffleArray(currentProblemSet);
        currentProblemIndex = -1;

        updateDinoDisplay(); // Show a dino at level start
        nextButton.textContent = "Siguiente Misión";
        problemTextEl.textContent = `¡Nivel ${currentLevelIndex + 1} comenzado! Haz clic para la primera misión.`;
        answerOptionsEl.innerHTML = '';
        nextButton.style.display = 'block';
        answerOptionsEl.style.display = 'none';
    }

    function nextProblem() {
        currentProblemIndex++;
        if (currentProblemIndex >= currentProblemSet.length) {
            // Repetir preguntas del nivel si se acaban
            shuffleArray(currentProblemSet);
            currentProblemIndex = 0;
        }

        const problem = currentProblemSet[currentProblemIndex];
        
        updateDinoDisplay(); // Update dinosaur for new problem

        problemTextEl.textContent = problem.question;
        answerOptionsEl.innerHTML = '';
        
        const options = [...problem.options];
        shuffleArray(options);

        options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.classList.add('answer-btn');
            button.addEventListener('click', () => checkAnswer(option, problem.answer));
            answerOptionsEl.appendChild(button);
        });

        nextButton.style.display = 'none';
        answerOptionsEl.style.display = 'grid';
    }

    function checkAnswer(selected, correct) {
        // Deshabilitar botones para evitar múltiples clics
        const buttons = answerOptionsEl.querySelectorAll('.answer-btn');
        buttons.forEach(button => button.disabled = true);
        
        if (selected === correct) {
            score += 25; // Changed score per question
            correctAnswersInLevel++;
            correctStreak++;
            let feedbackMsg = "¡Correcto! +25 Monedas";
            createRewardAnimation('coin', 5);

            if (correctStreak > 0 && correctStreak % 3 === 0) {
                score += 20; // Bonus coins
                feedbackMsg += "\n¡Racha de 3! +20 Monedas de bonificación.";
                createRewardAnimation('diamond', 3);
            }
            
            confetti({
                particleCount: 150,
                spread: 90,
                origin: { y: 0.6 }
            });
            showFeedback(feedbackMsg, true);
            
            // Check for level completion after a correct answer
            if (correctAnswersInLevel >= QUESTIONS_PER_LEVEL) {
                setTimeout(endLevel, 2000);
            }
        } else {
            correctStreak = 0;
            showFeedback(`Incorrecto. La respuesta era ${correct}`, false);
        }

        scoreEl.textContent = score;
        
        setTimeout(() => {
            if (correctAnswersInLevel < QUESTIONS_PER_LEVEL) {
                nextButton.style.display = 'block';
            } else {
                 nextButton.style.display = 'none'; // Hide button at end of level
            }
            answerOptionsEl.style.display = 'none';
        }, 1500); // Espera antes de mostrar el botón de siguiente
    }

    function createRewardAnimation(type, count) {
        for (let i = 0; i < count; i++) {
            const reward = document.createElement('img');
            reward.src = `${type}.png`;
            reward.classList.add('flying-reward');
            reward.style.width = type === 'coin' ? '30px' : '40px';

            // Randomize starting position and animation delay
            const randomX = (Math.random() - 0.5) * 200; // spread horizontally
            const randomDelay = Math.random() * 0.5; // spread animation start time

            reward.style.transform = `translateX(${randomX}px)`;
            reward.style.animationDelay = `${randomDelay}s`;
            
            animationContainer.appendChild(reward);

            // Remove element after animation ends to prevent clutter
            reward.addEventListener('animationend', () => {
                reward.remove();
            });
        }
    }

    function updateDinoDisplay() {
        const dino = dinosaurs[Math.floor(Math.random() * dinosaurs.length)];
        dinoNameEl.textContent = dino.name;
        dinoImageEl.src = dino.image;
        dinoImageEl.style.filter = 'none';
        dinoFactEl.textContent = "Observa a esta increíble criatura prehistórica.";
    }

    function endLevel() {
        const levelPassed = score >= MIN_SCORE_TO_PASS;
        levelEndTitle.textContent = `Fin del ${levels[currentLevelIndex].name}`;
        levelEndScore.textContent = score;

        if (levelPassed) {
            levelEndMessage.textContent = "¡Felicidades! Has superado el nivel y desbloqueado el siguiente.";
            if (currentLevelIndex + 1 < levels.length) {
                player.unlockedLevels = Math.max(player.unlockedLevels, currentLevelIndex + 2);
            }
            
            if (currentLevelIndex === levels.length - 1) {
                // Last level completed
                levelEndNextButton.onclick = () => {
                    levelEndModal.classList.add('hidden');
                    endGame(); // Show final game over screen
                };
            } else {
                levelEndNextButton.onclick = () => {
                    levelEndModal.classList.add('hidden');
                    showLevelSelect();
                };
            }
        } else {
            levelEndMessage.textContent = `Necesitas ${MIN_SCORE_TO_PASS} puntos para avanzar. ¡Inténtalo de nuevo para mejorar!`;
            levelEndNextButton.onclick = () => {
                levelEndModal.classList.add('hidden');
                showLevelSelect(); // Go back to map to retry
            };
        }
        levelEndModal.classList.remove('hidden');
    }

    function endGame() {
        gameContainer.classList.add('hidden');
        endScreen.classList.remove('hidden');
        finalPlayerNameEl.textContent = player.name;
        finalScoreEl.textContent = score;
    }

    function showFeedback(message, isCorrect) {
        feedbackTextEl.textContent = message;
        feedbackTextEl.style.whiteSpace = 'pre-wrap'; // To handle line breaks
        
        if (isCorrect) {
            feedbackIconEl.textContent = ''; // No icon for correct, confetti is the visual
        } else {
            feedbackIconEl.textContent = '😢';
        }

        feedbackModal.classList.remove('hidden');
        const modalContent = feedbackModal.querySelector('.modal-content');
        modalContent.style.borderColor = isCorrect ? '#4ef2e1' : '#F44336';
    }

    function hideFeedback() {
        feedbackModal.classList.add('hidden');
    }

    // --- EVENT LISTENERS ---
    nextButton.addEventListener('click', nextProblem);
    closeModalButton.addEventListener('click', hideFeedback);
    musicToggleButton.addEventListener('click', toggleMusic);
    playAgainButton.addEventListener('click', () => {
        // Reset player progress for a new game
        player.unlockedLevels = 1;
        endScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');
        // Reset start screen inputs
        playerNameInput.value = '';
        avatarOptions.forEach(opt => opt.classList.remove('selected'));
        startGameButton.disabled = true;
    });

    // --- INICIO DEL JUEGO ---
    setupStartScreen();
});