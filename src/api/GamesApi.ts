import { GameData } from "../slices/gameSlice";

const myHeaders: Headers = new Headers();
myHeaders.append("Content-Type", "application/json");

export async function updateGame(token: string, id: number, gameData: GameData) {
    var raw = JSON.stringify(gameData);

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
    //console.log(response)
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
    const game: GameData[] = await response.json()
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
    return await response.json()
}

export async function getGameById(token: string, id: number) {
    var requestOptions = {
        method: 'GET'
    };

    const response = await fetch("http://localhost:9090/games/" + id + "?token=" + token, requestOptions)
    if (!response.ok) {
        console.log(response.statusText)
        return;
    }
    return await response.json()
}

export async function registerUser(username: string, password: string) {
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({ username: username, password: password })
    };

    const response = await fetch("http://localhost:9090/users", requestOptions)
    if (!response.ok) {
        return 'Username already taken';
    }
}

export async function loginUser(username: string, password: string) {
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({ username: username, password: password })
    };

    const response = await fetch("http://localhost:9090/login", requestOptions)
    if (!response.ok) {
        return 'Invalid username or password';
    }
    return await response.json()
}

export async function logoutUser(token: string) {
    var requestOptions = {
        method: 'POST',
    };

    const response = await fetch("http://localhost:9090/logout?token=" + token, requestOptions)
    if (!response.ok) {
        return;
    }

}

export async function getUser(token: string, id: number) {
    var requestOptions = {
        method: 'GET',
    };

    const response = await fetch("http://localhost:9090/users/"+id+"?token=" + token, requestOptions)
    if (!response.ok) {
        return;
    }
    return await response.json()
}

export async function changePassword(token: string, newPassword: string, id: number) {
    var requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: JSON.stringify({ password: newPassword })
    };

    const response = await fetch("http://localhost:9090/users/"+id+"?token=" + token, requestOptions)
    if (!response.ok) {
        return;
    }

}