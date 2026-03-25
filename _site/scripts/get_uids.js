const placeIds = [
    4924922222, // Brookhaven
    2753915549, // Blox Fruits
    920587237,  // Adopt Me
    3236907311, // Tower Defense Simulator
    8737602449, // Pls Donate
    6872265039, // BedWars
    370731277,  // MeepCity
    286090429,  // Arsenal
    4623386862, // Piggy
    606849621,  // Jailbreak
    6516141723, // Doors
    2788229376, // Da Hood
    17017769292, // Anime Defenders
    13772394625, // Blade Ball
    142823684,  // Murder Mystery 2
    16498369169, // Pet Simulator 99
    185655149,  // Natural Disaster Survival
    893973440,  // Flee the Facility
    6403373529, // Slap Battles
    4520749081, // King Legacy
    6624163941, // Pet Simulator X
    1962086868, // Tower of Hell
    1537690962, // Bee Swarm Simulator
    4616652839  // Shindo Life
];

async function getUniverseIds() {
    const uids = [];
    for (const pid of placeIds) {
        try {
            const res = await fetch(`https://apis.roproxy.com/universes/v1/places/${pid}/universe`);
            const data = await res.json();
            if (data.universeId) uids.push(data.universeId);
        } catch (e) {
            console.error('Failed ID', pid, e.message);
        }
    }
    console.log(uids.join(', '));
}
getUniverseIds();
