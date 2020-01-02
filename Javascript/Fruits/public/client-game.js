export default function createGame() {

    const observers = []

    const state = {
        screen: {
            width: 40,
            height: 40
        }
    }

    function subscribe(observerFunction) {
        observers.push(observerFunction)
    }

    function notifyAll(command) {
        for (const observerFunction of observers) {
            console.log(command)
            observerFunction(command)
        }
    }

    function moveServerPlayer(command, fruits) {

        const { player } = command

        notifyAll({ ...command })

        checkForFruitCollision({ playerId: player.Id, player, fruits })
    }

    function movePlayer(command, players, fruits, screen) {

        const acceptedCommands = {
            ArrowUp(player) {
                return {
                    ...player,
                    y: player.y - (player.y - 1 >= 0)
                }
            },
            ArrowDown(player) {
                return {
                    ...player,
                    y: player.y + (player.y + 1 < screen.height)
                }
            },
            ArrowLeft(player) {
                return {
                    ...player,
                    x: player.x - (player.x - 1 >= 0)
                }
            },
            ArrowRight(player) {
                return {
                    ...player,
                    x: player.x + (player.x + 1 < screen.width)
                }
            }
        }

        const { keyPressed, playerId } = command

        const player = players[playerId]

        const action = acceptedCommands[keyPressed]
        console.log(players && action)
        if (player && action) {

            console.log(`Moving ${command.playerId} with ${command.keyPressed}`)

            const playerOnNewPosition = action(player)

            notifyAll({
                type: 'move-player',
                 ...playerOnNewPosition
            })
            
            checkForFruitCollision({ playerId, player: playerOnNewPosition, fruits })
        }
    }

    function checkForFruitCollision({ playerId, player, fruits }) {
        var fruitId = `${player.x}:${player.y}`;

        if (fruits[fruitId]) {

            console.log("colidiu")

            //state.score[playerId].fruits++;

            notifyAll({
                type: 'fruit-taked',
                fruitId,
                playerId
            })

        }
    }

    return {
        movePlayer,
        moveServerPlayer,
        subscribe,
        state

    }
}