window.environments = {
    ruins: {
        name: "Ruins",
        bg: "linear-gradient(180deg, #87CEEB 0%, #DEB887 40%, #8B4513 100%)",
        artifacts: [
            { type: "soda", x: 100, y: 150 },
            { type: "burger", x: 650, y: 180 },
            { type: "jukebox", x: 800, y: 120 },
            { type: "computer", x: 950, y: 160 }
        ],
        puzzles: []
    },
    gym: {
        name: "Gymnasium",
        bg: "linear-gradient(180deg, #c0c0c0 0%, #505050 100%)",
        artifacts: [
            { type: "dumbbell", x: 200, y: 200 },
            { type: "trophy", x: 700, y: 170 }
        ],
        puzzles: [
            { id: "treadmill", x: 500, y: 150, required: "xbot" }
        ]
    },
    silo: {
        name: "Missile Silo",
        bg: "linear-gradient(180deg, #222 0%, #555 70%, #222 100%)",
        artifacts: [
            { type: "map", x: 220, y: 200 }
        ],
        puzzles: [
            { id: "control-panel", x: 800, y: 150, required: "g1145" },
            { id: "heavy-missile", x: 650, y: 170, required: "xbot" }
        ]
    }
};
