

const passwordOutput = document.getElementById("password");
const lengthInput = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const strengthOutput = document.getElementById("strength");
const message = document.getElementById("message");

const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercase = "abcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
const symbols = "!@#$%^&*()_+-=[]{}?";

lengthInput.addEventListener("input", () => {
    lengthValue.textContent = lengthInput.value;
});

function secureRandom(max) {
    const random = new Uint32Array(1);
    const limit = Math.floor(4294967296 / max) * max;

    let value;

    do {
        crypto.getRandomValues(random);
        value = random[0];
    } while (value >= limit);

    return value % max;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = secureRandom(i + 1);
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

function generatePassword() {
    const length = Number(lengthInput.value);

    let characterSets = [];

    if (document.getElementById("uppercase").checked) {
        characterSets.push(uppercase);
    }

    if (document.getElementById("lowercase").checked) {
        characterSets.push(lowercase);
    }

    if (document.getElementById("numbers").checked) {
        characterSets.push(numbers);
    }

    if (document.getElementById("symbols").checked) {
        characterSets.push(symbols);
    }

    if (characterSets.length === 0) {
        message.textContent = "Select at least one character type.";
        return;
    }

    let allCharacters = characterSets.join("");
    let password = [];

    // Ensure at least one character from each selected type.
    for (const set of characterSets) {
        password.push(set[secureRandom(set.length)]);
    }

    // Fill the remaining password length.
    while (password.length < length) {
        password.push(
            allCharacters[secureRandom(allCharacters.length)]
        );
    }

    // Shuffle the password characters.
    password = shuffle(password);

    const finalPassword = password.join("");

    passwordOutput.value = finalPassword;

    checkStrength(finalPassword, characterSets.length);

    message.textContent = "Password generated successfully!";
}

function checkStrength(password, selectedTypes) {
    let score = 0;

    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (selectedTypes >= 3) score++;
    if (selectedTypes === 4) score++;

    if (score <= 1) {
        strengthOutput.textContent = "Moderate";
        strengthOutput.style.color = "#d97706";
    } else if (score <= 2) {
        strengthOutput.textContent = "Good";
        strengthOutput.style.color = "#2563eb";
    } else {
        strengthOutput.textContent = "Strong";
        strengthOutput.style.color = "#0f766e";
    }
}

generateBtn.addEventListener("click", generatePassword);

copyBtn.addEventListener("click", async () => {
    if (!passwordOutput.value) {
        message.textContent = "Generate a password first.";
        return;
    }

    try {
        await navigator.clipboard.writeText(passwordOutput.value);
        message.textContent = "Password copied successfully!";
    } catch (error) {
        message.textContent = "Copy unavailable. Open this page using HTTPS or localhost.";
    }
});

// Generate a password when the page first loads.
generatePassword();