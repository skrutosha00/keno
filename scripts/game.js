import { activateAudio, setBalanceField, shuffle, changeBalance, animateOnce } from "./functions.js"

setBalanceField()
activateAudio()

let betAmount = document.querySelector('.bet_amount')
let balance = document.querySelector('.balance')
let warning = document.querySelector('.warning')

let rewardData = [0, 0, 2, 4, 10, 15, 25, 75, 150, 350, 500, 1000]

let active = true
let chosen = []

for (let i = 0; i < 80; i++) {
    let cell = document.createElement('div')
    cell.classList.add('cell', 'block')
    cell.innerHTML = cell.dataset.num = i + 1

    cell.onclick = () => {
        if (!active) { return }

        if (!(chosen.includes(cell.innerHTML))) {
            if (chosen.length != 10 && Number(betAmount.innerHTML) + 50 <= Number(balance.innerHTML)) {
                betAmount.innerHTML = Number(betAmount.innerHTML) + 50
                cell.classList.add('chosen')
                chosen.push(cell.innerHTML)
            }
        } else {
            betAmount.innerHTML = Number(betAmount.innerHTML) - 50
            cell.classList.remove('chosen')
            chosen.splice(chosen.indexOf(cell.innerHTML), 1)
        }

        updateIndicators()
    }

    document.querySelector('.field').appendChild(cell)
}

for (let i = 1; i < 11; i++) {
    let line = document.createElement('div')
    line.classList.add('line')

    let hitSpan = document.createElement('span')
    hitSpan.classList.add('line_hit')
    hitSpan.innerHTML = i

    let winSpan = document.createElement('div')
    winSpan.classList.add('line_win')
    winSpan.innerHTML = rewardData[i] + 'x'

    line.append(hitSpan, winSpan)
    document.querySelector('.reward_info').appendChild(line)
}

for (let i = 0; i < 10; i++) {
    let indicator = document.createElement('div')
    indicator.classList.add('indicator', 'block')
    indicator.innerHTML = i + 1

    document.querySelector('.indicator_cont').appendChild(indicator)
}

for (let i = 0; i < 10; i++) {
    let number = document.createElement('div')
    number.classList.add('number', 'block', 'hidden')

    document.querySelector('.numbers').appendChild(number)
}

document.querySelector('.clear').onclick = () => {
    if (!active) { return }

    clearField()
}

document.querySelector('.random').onclick = () => {
    if (!active || Number(balance.innerHTML) < 500) { return }
    betAmount.innerHTML = 500

    clearField()
    let numList = shuffle(Array.from({ length: 80 }, (v, i) => String(i + 1)))

    for (let i = 0; i < 10; i++) {
        document.querySelector('.cell[data-num="' + numList[i] + '"]').classList.add('chosen')
        chosen.push(numList[i])
    }

    updateIndicators()
}

document.querySelector('.play').onclick = () => {
    if (!active || !chosen.length || !Number(betAmount.innerHTML) || Number(betAmount.innerHTML) > Number(balance.innerHTML)) { return }
    active = false
    changeBalance(-Number(betAmount.innerHTML))

    let winList = shuffle(Array.from({ length: 80 }, (v, i) => String(i + 1))).slice(0, chosen.length)
    let reward = Number(betAmount.innerHTML) * rewardData[countCommon(chosen, winList)]

    for (let i = 0; i < winList.length; i++) {
        let number = document.querySelectorAll('.number')[i]

        if (chosen.includes(winList[i])) {
            number.classList.add('win')
        }
        number.innerHTML = winList[i]
        number.classList.remove('hidden')

        document.querySelector('.cell[data-num="' + winList[i] + '"]').classList.add('win')
    }

    setTimeout(() => {
        if (reward) {
            changeBalance(reward)
            animateOnce('.balance')
        }

        warning.querySelector('.outcome').innerHTML = reward ? 'You win' : 'You lose'
        warning.querySelector('.reward').innerHTML = reward

        warning.style.left = '50%'
    }, 1000);
}

document.querySelector('.again').onclick = () => {
    warning.style.left = '-50%'

    for (let number of document.querySelectorAll('.number')) {
        number.classList.remove('win')
        number.classList.add('hidden')
        number.innerHTML = ''
    }

    for (let cell of document.querySelectorAll('.cell')) {
        cell.classList.remove('win', 'chosen')
    }

    chosen = []
    betAmount.innerHTML = 0
    active = true

    updateIndicators()
}

function updateIndicators() {
    for (let i = 0; i < 10; i++) {
        if ((i + 1) <= chosen.length) {
            document.querySelectorAll('.indicator')[i].classList.add('active')
        } else {
            document.querySelectorAll('.indicator')[i].classList.remove('active')
        }
    }
}

function clearField() {
    for (let cell of document.querySelectorAll('.cell')) {
        cell.classList.remove('chosen')
    }

    chosen = []
    updateIndicators()
}

function countCommon(arr1, arr2) {
    let res = 0
    for (let elem of arr1) {
        if (arr2.includes(elem)) {
            res += 1
        }
    }

    return res
}
