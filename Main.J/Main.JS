// Main game logic for Three Robots: A Post-Human Tour
let gameState = {
    activeRobot: "kvrc",
    discoveries: [],
    currentEnvironment: "ruins",
    puzzlesSolved: {},
    dialogueTimeout: null
};

const robotNames = { kvrc: "K-VRC", xbot: "XBOT-4000", g1145: "11-45-G" };

function startGame() {
    document.getElementById('titleScreen').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('titleScreen').style.display = 'none';
        document.getElementById('bgm').play();
        renderEnvironment();
    }, 1000);
}

function selectRobot(robotId) {
    playSound('sfx-click');
    document.querySelectorAll('.robot').forEach(r => r.classList.remove('active'));
    document.querySelectorAll('.robot-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(robotId).classList.add('active');
    document.getElementById('btn-' + robotId).classList.add('active');
    gameState.activeRobot = robotId;
    document.getElementById('activeRobot').textContent = robotNames[robotId];
    hideDialogue();
}

function changeEnvironment(env) {
    if (!(env in environments)) return;
    gameState.currentEnvironment = env;
    renderEnvironment();
}

function renderEnvironment() {
    // Set background
    const env = environments[gameState.currentEnvironment];
    document.querySelector('.environment').style.background = env.bg;
    // Render artifacts and puzzles
    const area = document.getElementById('artifactArea');
    area.innerHTML = "";
    (env.artifacts || []).forEach(artifact => {
        const artDiv = document.createElement('div');
        artDiv.className = `artifact ${artifact.type}`;
        artDiv.style.left = artifact.x + "px";
        artDiv.style.bottom = artifact.y + "px";
        artDiv.onclick = () => examineArtifact(artifact.type);
        area.appendChild(artDiv);
    });
    (env.puzzles || []).forEach(pz => {
        const solved = gameState.puzzlesSolved[pz.id];
        const pzDiv = document.createElement('div');
        pzDiv.className = "puzzle" + (solved ? " solved" : "");
        pzDiv.style.left = pz.x + "px";
        pzDiv.style.bottom = pz.y + "px";
        pzDiv.onclick = () => interactPuzzle(pz.id);
        pzDiv.title = "Puzzle: Requires " + robotNames[pz.required];
        area.appendChild(pzDiv);
    });
}

function examineArtifact(type) {
    playSound('sfx-discovery');
    const d = dialogues.artifacts[type]?.[gameState.activeRobot] || [{ text: "No data." }];
    showDialogue(robotNames[gameState.activeRobot], d[0].text);
    const discoveryKey = `${type}-${gameState.activeRobot}`;
    if (!gameState.discoveries.includes(discoveryKey)) {
        gameState.discoveries.push(discoveryKey);
        addDiscovery(type, gameState.activeRobot);
    }
}

function interactPuzzle(puzzleId) {
    const puzzle = puzzles[puzzleId];
    const envP = dialogues.puzzles[puzzleId]?.[gameState.activeRobot] || [{ text: "No response." }];
    if (puzzle.solved || gameState.puzzlesSolved[puzzleId]) {
        showDialogue(robotNames[gameState.activeRobot], "Already solved!");
        return;
    }
    if (gameState.activeRobot === puzzle.required) {
        playSound('sfx-puzzle');
        gameState.puzzlesSolved[puzzleId] = true;
        showDialogue(robotNames[gameState.activeRobot], envP[0].text + " (Puzzle solved!)");
        setTimeout(renderEnvironment, 1200);
    } else {
        showDialogue(robotNames[gameState.activeRobot], envP[0].text + " (Try another robot!)");
    }
}

function talkToCat() {
    const d = dialogues.cat[gameState.activeRobot];
    if (gameState.activeRobot === "kvrc") {
        showBranchingDialogue(d, 0, 'The Cat');
    } else {
        showDialogue('The Cat', d[0].text);
    }
}

function showBranchingDialogue(nodes, idx, speaker) {
    const node = nodes[idx];
    showDialogue(speaker, node.text, node.options, (optIdx) => {
        if (node.options && node.options[optIdx].next !== undefined) {
            showBranchingDialogue(nodes, node.options[optIdx].next, speaker);
        } else {
            hideDialogue();
        }
    });
}

function showDialogue(speaker, text, options, onOption) {
    clearTimeout(gameState.dialogueTimeout);
    document.getElementById('speakerName').textContent = speaker;
    document.getElementById('dialogueText').textContent = text;
    const optionsDiv = document.getElementById('dialogueOptions');
    optionsDiv.innerHTML = "";
    if (options) {
        options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.textContent = opt.label;
            btn.onclick = () => { onOption(i); };
            optionsDiv.appendChild(btn);
        });
    }
    document.getElementById('dialogueBox').classList.add('show');
    if (!options) {
        gameState.dialogueTimeout = setTimeout(hideDialogue, 8000);
    }
}

function hideDialogue() {
    document.getElementById('dialogueBox').classList.remove('show');
    document.getElementById('dialogueOptions').innerHTML = "";
    clearTimeout(gameState.dialogueTimeout);
}

function addDiscovery(artifact, robot) {
    const list = document.getElementById('discoveryList');
    const item = document.createElement('div');
    item.className = 'discovery-item';
    const artifactNames = {
        soda: 'Soda Can', burger: 'Burger', jukebox: 'Jukebox', computer: 'Computer',
        dumbbell: 'Dumbbell', trophy: 'Trophy', map: 'Map'
    };
    item.textContent = `${artifactNames[artifact] || artifact} (${robotNames[robot]})`;
    list.appendChild(item);
}

function playSound(id) {
    const audio = document.getElementById(id);
    if (audio) { audio.currentTime = 0; audio.play(); }
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (["1", "2", "3"].includes(e.key)) selectRobot(["kvrc", "xbot", "g1145"][parseInt(e.key) - 1]);
    if (e.key === "Escape") hideDialogue();
});

// Hide dialogue on click
document.getElementById('dialogueBox').addEventListener('click', hideDialogue);

// Add atmosphere: floating dust particles
function addAtmosphere() {
    for (let i = 0; i < 20; i++) {
        const dust = document.createElement('div');
        dust.style.position = 'absolute';
        dust.style.width = '2px'; dust.style.height = '2px';
        dust.style.background = 'rgba(255,255,255,0.3)';
        dust.style.borderRadius = '50%';
        dust.style.left = Math.random() * 100 + '%';
        dust.style.top = Math.random() * 100 + '%';
        dust.style.animation = `float ${3 + Math.random() * 4}s ease-in-out infinite`;
        document.querySelector('.environment').appendChild(dust);
    }
}
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%,100% { transform: translateY(0px) translateX(0px); }
        25% { transform: translateY(-10px) translateX(5px);}
        50% { transform: translateY(-5px) translateX(-5px);}
        75% { transform: translateY(-15px) translateX(3px);}
    }
`;
document.head.appendChild(style);
setTimeout(addAtmosphere, 1500);

// On load, hide navigation and world until game starts
window.onload = () => {
    document.getElementById('envNav').style.display = 'none';
    document.getElementById('gameWorld').style.display = 'none';
    document.getElementById('bgm').volume = 0.5;
};
window.startGame = () => {
    document.getElementById('envNav').style.display = '';
    document.getElementById('gameWorld').style.display = '';
    startGame();
};
