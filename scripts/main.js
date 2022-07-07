import { activateAudio, setBalanceField } from "./functions.js";

if (!localStorage.getItem('balance_keno')) {
    localStorage.setItem('balance_keno', 5000)
}

setBalanceField()
activateAudio()