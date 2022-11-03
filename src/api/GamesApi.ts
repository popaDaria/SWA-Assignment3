const myHeaders: Headers = new Headers();
myHeaders.append("Content-Type", "application/json");

export async function updateGame(token: string, id: number) {
    var raw = JSON.stringify({ "user": 1, "id": 4, "score": 10, "completed": false });

    var requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw
    };

    const response = await fetch("http://localhost:9090/games/" + id + "?token=" + token, requestOptions)
    if (!response.ok) {
        console.log(response.statusText)
        return;
    }
    const game = await response.json()
    return game
}

export async function getAllGames(token: string) {
    var requestOptions = {
        method: 'GET'
    };

    const response = await fetch("http://localhost:9090/games?token=" + token, requestOptions)
    if (!response.ok) {
        console.log(response.statusText)
        return;
    }
    const game = await response.json()
    return game
}

export async function startNewGame(token: string) {
    const requestOptions = {
        method: 'POST'
    };

    const response = await fetch("http://localhost:9090/games?token=" + token, requestOptions)
    if (!response.ok) {
        console.log(response.statusText)
        return;
    }
    const game = await response.json()
    return game
}

export async function getGameById(token: string, id: number) {
    var requestOptions = {
        method: 'GET'
    };

    const response = await fetch("http://localhost:9090/games?token=" + token + "&id=" + id, requestOptions)
    if (!response.ok) {
        console.log(response.statusText)
        return;
    }
    const game = await response.json()
    return game
}