/* ==========================================================================

   BIRTHDAY WEBSITE — JAVASCRIPT CODE MAP

   Use CTRL + F to quickly find any feature.

   --------------------------------------------------------------------------

   [COUNTDOWN + LOCK]
   Controls the birthday countdown and website lock.

   [THEME SWITCH]
   Switches between BLUE/GREEN and PINK/PURPLE themes.

   [COUNTDOWN EFFECTS]
   3 HOURS → 2 HOURS → 1 HOUR → 30 MIN → 10 MIN → 1 MIN

   [COUNTDOWN PARTIES]
   10-minute confetti.
   1-minute confetti + balloons/cakes.

   [AUDIO]
   Background music, birthday music, dance music and click sounds.

   [MONEY]
   Automatically generates money.

   [HUNGER]
   Hunger increases over time and causes blur.

   [CHAT]
   Hidden conversation unlocked from the shop.

   [FOOD]
   Restaurant system and hunger reduction.

   [FOODIE EMERGENCY]
   Secret ending after enough food is purchased.

   [SHOP]
   Conversation, message and blur upgrades.

   [GIFT]
   Final birthday gift.

   [HOBBY EASTER EGGS]
   Dancing, movies and books.

   [TYPING SECRETS]
   "avigna"
   "secret"
   "cake"

   [KONAMI CODE]
   ↑ ↑ ↓ ↓ ← → ← → B A

   [IDLE NUDGE]
   Messages after inactivity.

   [SECRET LOGO]
   Click A. five times.

   ========================================================================== */


/* ==========================================================================
   GLOBAL SETTINGS
========================================================================== */

window.history.scrollRestoration =
    "manual";


/* ==========================================================================
   BIRTHDAY COUNTDOWN + LOCK SYSTEM
========================================================================== */


/* =========================================
   COUNTDOWN ELEMENTS
========================================= */

const lockScreen =
    document.getElementById(
        "birthday-lock-screen"
    );


const countdownDays =
    document.getElementById(
        "countdown-days"
    );


const countdownHours =
    document.getElementById(
        "countdown-hours"
    );


const countdownMinutes =
    document.getElementById(
        "countdown-minutes"
    );


const countdownSeconds =
    document.getElementById(
        "countdown-seconds"
    );


const countdownStatus =
    document.getElementById(
        "countdown-status"
    );


let birthdayCountdownInterval =
    null;


/* =========================================
   COUNTDOWN EFFECT VARIABLES
========================================= */

let countdownEffectStage =
    "normal";


let tenMinutePartyStarted =
    false;


let oneMinutePartyStarted =
    false;


/* =========================================
   INDIA TIME HELPERS
========================================= */

/*
    IMPORTANT:

    The countdown uses IST.

    IST =
    Asia/Kolkata =
    UTC + 5:30

    This prevents a friend's device timezone
    from changing the countdown.
*/

function getIndiaDateParts() {

    const formatter =
        new Intl.DateTimeFormat(
            "en-CA",
            {
                timeZone:
                    "Asia/Kolkata",

                year:
                    "numeric",

                month:
                    "2-digit",

                day:
                    "2-digit",

                hour:
                    "2-digit",

                minute:
                    "2-digit",

                second:
                    "2-digit",

                hourCycle:
                    "h23"
            }
        );


    const parts =
        formatter.formatToParts(
            new Date()
        );


    const values = {};


    parts.forEach(
        function (part) {

            if (
                part.type !==
                "literal"
            ) {

                values[part.type] =
                    part.value;

            }

        }
    );


    return {

        year:
            Number(
                values.year
            ),

        month:
            Number(
                values.month
            ),

        day:
            Number(
                values.day
            ),

        hour:
            Number(
                values.hour
            ),

        minute:
            Number(
                values.minute
            ),

        second:
            Number(
                values.second
            )

    };

}


/* =========================================
   GET NEXT BIRTHDAY
========================================= */

function getBirthdayTarget() {

    const india =
        getIndiaDateParts();


    /*
        Birthday:

        29 August
        12:00 AM IST

        IST is UTC+5:30.

        Therefore:

        29 Aug 00:00 IST
        =
        28 Aug 18:30 UTC
    */

    let target =
        new Date(
            Date.UTC(
                india.year,
                7,
                28,
                18,
                30,
                0,
                0
            )
        );


    /*
        Once August 29 has started
        in India, the next birthday is
        next year's August 29.
    */

    if (
        india.month === 8 &&
        india.day >= 29
    ) {

        target =
            new Date(
                Date.UTC(
                    india.year + 1,
                    7,
                    28,
                    18,
                    30,
                    0,
                    0
                )
            );

    }


    return target;

}


/* =========================================
   CHECK BIRTHDAY
========================================= */

function isBirthdayToday() {

    const india =
        getIndiaDateParts();


    return (
        india.month === 8 &&
        india.day === 29
    );

}


/* =========================================
   FORMAT NUMBER
========================================= */

function formatNumber(
    number
) {

    return String(
        number
    ).padStart(
        2,
        "0"
    );

}


/* =========================================
   RESET COUNTDOWN EFFECTS
========================================= */

function resetCountdownEffectClasses() {

    document.body.classList.remove(

        "countdown-normal",

        "countdown-3-hours",

        "countdown-2-hours",

        "countdown-1-hour",

        "countdown-30-minutes",

        "countdown-10-minutes",

        "countdown-1-minute"

    );

}


/* =========================================
   COUNTDOWN EFFECT SYSTEM
========================================= */

function updateCountdownEffects(
    totalSeconds
) {

    let newStage =
        "normal";


    /*
        1 MINUTE
    */

    if (
        totalSeconds <= 60
    ) {

        newStage =
            "1-minute";

    }


    /*
        10 MINUTES
    */

    else if (
        totalSeconds <= 600
    ) {

        newStage =
            "10-minutes";

    }


    /*
        30 MINUTES
    */

    else if (
        totalSeconds <= 1800
    ) {

        newStage =
            "30-minutes";

    }


    /*
        1 HOUR
    */

    else if (
        totalSeconds <= 3600
    ) {

        newStage =
            "1-hour";

    }


    /*
        2 HOURS
    */

    else if (
        totalSeconds <= 7200
    ) {

        newStage =
            "2-hours";

    }


    /*
        3 HOURS
    */

    else if (
        totalSeconds <= 10800
    ) {

        newStage =
            "3-hours";

    }


    /*
        Apply CSS stage class
        only when the stage changes.
    */

    if (
        newStage !==
        countdownEffectStage
    ) {

        countdownEffectStage =
            newStage;


        resetCountdownEffectClasses();


        document.body.classList.add(
            "countdown-" +
            newStage
        );

    }


    /*
        10-MINUTE CELEBRATION
    */

    if (
        totalSeconds <= 600 &&
        !tenMinutePartyStarted
    ) {

        tenMinutePartyStarted =
            true;


        triggerTenMinuteParty();

    }


    /*
        1-MINUTE CELEBRATION
    */

    if (
        totalSeconds <= 60 &&
        !oneMinutePartyStarted
    ) {

        oneMinutePartyStarted =
            true;


        triggerOneMinuteParty();

    }

}


/* =========================================
   UPDATE COUNTDOWN
========================================= */

function updateBirthdayCountdown() {

    if (!lockScreen) {

        return;

    }


    /*
        If August 29 has begun
        in India, unlock immediately.
    */

    if (
        isBirthdayToday()
    ) {

        unlockBirthdayWebsite();

        return;

    }


    const now =
        new Date();


    const target =
        getBirthdayTarget();


    const difference =
        target.getTime() -
        now.getTime();


    if (
        difference <= 0
    ) {

        unlockBirthdayWebsite();

        return;

    }


    const totalSeconds =
        Math.floor(
            difference / 1000
        );


    const days =
        Math.floor(
            totalSeconds /
            86400
        );


    const hours =
        Math.floor(
            (
                totalSeconds %
                86400
            ) /
            3600
        );


    const minutes =
        Math.floor(
            (
                totalSeconds %
                3600
            ) /
            60
        );


    const seconds =
        totalSeconds %
        60;


    /* =====================================
       UPDATE DISPLAY
    ====================================== */

    if (countdownDays) {

        countdownDays.textContent =
            formatNumber(
                days
            );

    }


    if (countdownHours) {

        countdownHours.textContent =
            formatNumber(
                hours
            );

    }


    if (countdownMinutes) {

        countdownMinutes.textContent =
            formatNumber(
                minutes
            );

    }


    if (countdownSeconds) {

        countdownSeconds.textContent =
            formatNumber(
                seconds
            );

    }


    if (countdownStatus) {

        countdownStatus.textContent =
            "SYSTEM LOCKED";

    }


    /* =====================================
       UPDATE VISUAL EFFECT
    ====================================== */

    updateCountdownEffects(
        totalSeconds
    );

}


/* =========================================
   UNLOCK WEBSITE
========================================= */

function unlockBirthdayWebsite() {

    if (
        birthdayCountdownInterval
    ) {

        clearInterval(
            birthdayCountdownInterval
        );


        birthdayCountdownInterval =
            null;

    }


    resetCountdownEffectClasses();


    document.body.classList.remove(
        "birthday-locked"
    );


    document.body.classList.add(
        "birthday-unlocked"
    );


    if (countdownStatus) {

        countdownStatus.textContent =
            "ACCESS GRANTED";

    }


    setTimeout(
        function () {

            if (lockScreen) {

                lockScreen.remove();

            }

        },
        2200
    );

}


/* =========================================
   INITIALIZE BIRTHDAY LOCK
========================================= */

function initializeBirthdayLock() {

    /*
        BEFORE AUGUST 29 IST:
        Countdown screen.

        ON AUGUST 29 IST:
        Website opens.

        AFTER AUGUST 29:
        Next year's birthday is used.
    */

    if (
        isBirthdayToday()
    ) {

        document.body.classList.add(
            "birthday-unlocked"
        );


        if (countdownStatus) {

            countdownStatus.textContent =
                "ACCESS GRANTED";

        }


        setTimeout(
            function () {

                if (lockScreen) {

                    lockScreen.remove();

                }

            },
            2200
        );


        return;

    }


    document.body.classList.add(
        "birthday-locked"
    );


    updateBirthdayCountdown();


    birthdayCountdownInterval =
        setInterval(
            updateBirthdayCountdown,
            1000
        );

}


initializeBirthdayLock();


/* ==========================================================================
   THEME SWITCH
========================================================================== */


/* =========================================
   THEME ELEMENTS
========================================= */

const themeSwitch =
    document.getElementById(
        "theme-switch"
    );


const themeSwitchText =
    document.getElementById(
        "theme-switch-text"
    );


const themeIcon =
    document.getElementById(
        "theme-icon"
    );


/* =========================================
   UPDATE THEME BUTTON
========================================= */

function updateThemeButton() {

    const pinkMode =
        document.body.classList.contains(
            "theme-pink"
        );


    if (themeSwitchText) {

        themeSwitchText.textContent =
            pinkMode
                ? "PINK MODE"
                : "BLUE MODE";

    }


    if (themeIcon) {

        themeIcon.textContent =
            pinkMode
                ? "🌸"
                : "🌲";

    }


    if (themeSwitch) {

        themeSwitch.setAttribute(
            "aria-label",
            pinkMode
                ? "Switch to blue theme"
                : "Switch to pink theme"
        );

    }

}


/* =========================================
   TOGGLE THEME
========================================= */

function toggleTheme() {

    document.body.classList.toggle(
        "theme-pink"
    );


    const pinkMode =
        document.body.classList.contains(
            "theme-pink"
        );


    localStorage.setItem(
        "birthday-theme",
        pinkMode
            ? "pink"
            : "blue"
    );


    updateThemeButton();

}


/* =========================================
   THEME BUTTON CLICK
========================================= */

if (themeSwitch) {

    themeSwitch.addEventListener(
        "click",
        function () {

            toggleTheme();

        }
    );

}


/* =========================================
   LOAD SAVED THEME
========================================= */

function initializeTheme() {

    const savedTheme =
        localStorage.getItem(
            "birthday-theme"
        );


    if (
        savedTheme ===
        "pink"
    ) {

        document.body.classList.add(
            "theme-pink"
        );

    }

    else {

        document.body.classList.remove(
            "theme-pink"
        );

    }


    updateThemeButton();

}


initializeTheme();


/* ==========================================================================
   COUNTDOWN PARTY — 10 MINUTES
========================================================================== */

function triggerTenMinuteParty() {

    if (
        typeof confetti !==
        "function"
    ) {

        return;

    }


    /* =====================================
       MAIN BURST
    ====================================== */

    confetti({

        particleCount:
            180,

        spread:
            160,

        startVelocity:
            55,

        gravity:
            0.8,

        ticks:
            300,

        origin: {

            x:
                0.5,

            y:
                0.65

        }

    });


    /* =====================================
       SIDE BURSTS
    ====================================== */

    let bursts =
        0;


    const partyInterval =
        setInterval(
            function () {

                confetti({

                    particleCount:
                        18,

                    spread:
                        100,

                    startVelocity:
                        35,

                    gravity:
                        0.8,

                    origin: {

                        x:
                            Math.random() *
                            0.35,

                        y:
                            0.9

                    }

                });


                confetti({

                    particleCount:
                        18,

                    spread:
                        100,

                    startVelocity:
                        35,

                    gravity:
                        0.8,

                    origin: {

                        x:
                            0.65 +
                            Math.random() *
                            0.35,

                        y:
                            0.9

                    }

                });


                bursts++;


                if (
                    bursts >=
                    15
                ) {

                    clearInterval(
                        partyInterval
                    );

                }

            },
            450
        );

}


/* ==========================================================================
   COUNTDOWN PARTY — 1 MINUTE
========================================================================== */

function triggerOneMinuteParty() {

    if (
        typeof confetti ===
        "function"
    ) {

        /* =================================
           HUGE CENTER BURST
        ================================== */

        confetti({

            particleCount:
                350,

            spread:
                180,

            startVelocity:
                70,

            gravity:
                0.75,

            ticks:
                400,

            origin: {

                x:
                    0.5,

                y:
                    0.6

            }

        });


        /* =================================
           LEFT CANNON
        ================================== */

        confetti({

            particleCount:
                150,

            angle:
                60,

            spread:
                55,

            startVelocity:
                60,

            gravity:
                0.8,

            origin: {

                x:
                    0,

                y:
                    1

            }

        });


        /* =================================
           RIGHT CANNON
        ================================== */

        confetti({

            particleCount:
                150,

            angle:
                120,

            spread:
                55,

            startVelocity:
                60,

            gravity:
                0.8,

            origin: {

                x:
                    1,

                y:
                    1

            }

        });

    }


    startCountdownPartyObjects();

}


/* ==========================================================================
   COUNTDOWN BALLOONS + CAKES
========================================================================== */

function startCountdownPartyObjects() {

    let objectCount =
        0;


    const objectInterval =
        setInterval(
            function () {

                createCountdownPartyObject();


                objectCount++;


                if (
                    objectCount >=
                    45
                ) {

                    clearInterval(
                        objectInterval
                    );

                }

            },
            250
        );

}


/* =========================================
   CREATE PARTY OBJECT
========================================= */

function createCountdownPartyObject() {

    const object =
        document.createElement(
            "div"
        );


    object.className =
        "countdown-party-object";


    /*
        55% balloon.
        45% cake.
    */

    const isBalloon =
        Math.random() <
        0.55;


    if (isBalloon) {

        object.classList.add(
            "countdown-balloon"
        );


        object.textContent =
            "🎈";

    }

    else {

        object.classList.add(
            "countdown-cake"
        );


        object.textContent =
            Math.random() <
            0.5
                ? "🎂"
                : "🧁";

    }


    object.style.left =
        Math.random() *
        100 +
        "vw";


    object.style.animationDuration =
        (
            3 +
            Math.random() *
            3
        ) +
        "s";


    object.style.animationDelay =
        (
            Math.random() *
            0.5
        ) +
        "s";


    document.body.appendChild(
        object
    );


    setTimeout(
        function () {

            object.remove();

        },
        7000
    );

}


/* ==========================================================================
   ALWAYS START AT HERO
========================================================================== */

window.addEventListener(
    "load",
    function () {

        if (
            document.body.classList.contains(
                "birthday-unlocked"
            )
        ) {

            window.scrollTo(
                0,
                0
            );

        }

    }
);


/* ==========================================================================
   ELEMENT REFERENCES
========================================================================== */

const blackOut =
    document.querySelector(
        ".black-screen"
    );


const foodButtons =
    document.querySelectorAll(
        ".food-button"
    );


const affordtext =
    document.getElementById(
        "afford-text"
    );


const chat =
    document.getElementById(
        "msg-card"
    );


const nextMsg =
    document.getElementById(
        "nextMessage"
    );


const shopButtons =
    document.querySelectorAll(
        ".shop-button"
    );


const shopaffordtext =
    document.getElementById(
        "shop-afford-text"
    );


const clickAudio =
    document.getElementById(
        "click-audio"
    );


const backgroundAudio =
    document.getElementById(
        "background-audio"
    );


const bdayAudio =
    document.getElementById(
        "bday-audio"
    );


const danceAudio =
    document.getElementById(
        "dance-audio"
    );


const pageContent =
    document.getElementById(
        "page-content"
    );


const muteBtn =
    document.getElementById(
        "mute-toggle"
    );


const scrollProgress =
    document.getElementById(
        "scroll-progress"
    );


const avignaToast =
    document.getElementById(
        "avigna-toast"
    );


const secretLogo =
    document.getElementById(
        "secret-logo"
    );


/* ==========================================================================
   GAME STATE VARIABLES
========================================================================== */

let msgIndex =
    0;


let money =
    0;


let hungerPercent =
    0;


let boughtConvo =
    false;


let boughtMsg =
    false;


let boughtBlur =
    false;


let doblur =
    true;


let movieModeOn =
    false;


let foodBought =
    0;


let warningGiven =
    false;


let foodieEndingTriggered =
    false;


let confettiStarted =
    false;


let audioStarted =
    false;


let isMuted =
    false;


let avignaToastTimeout;


let typedBuffer =
    "";


let konamiIndex =
    0;


let logoClicks =
    0;


let logoClickTimer =
    null;


let idleTimer =
    null;


let idleNudgeCount =
    0;


/* ==========================================================================
   AUDIO SYSTEM
========================================================================== */


/* =========================================
   CLICK SOUND
========================================= */

function playClick() {

    if (
        !document.body.classList.contains(
            "birthday-unlocked"
        )
    ) {

        return;

    }


    if (!clickAudio) {

        return;

    }


    clickAudio.currentTime =
        0;


    clickAudio.play().catch(
        function () {}
    );

}


/* =========================================
   BACKGROUND MUSIC
========================================= */

function startBackgroundAudio() {

    if (
        !document.body.classList.contains(
            "birthday-unlocked"
        )
    ) {

        return;

    }


    if (
        audioStarted
    ) {

        return;

    }


    if (!backgroundAudio) {

        return;

    }


    audioStarted =
        true;


    backgroundAudio.loop =
        true;


    backgroundAudio.play().catch(
        function () {}
    );

}


document.addEventListener(
    "click",
    startBackgroundAudio
);


/* =========================================
   DANCE AUDIO FINISHED
========================================= */

if (danceAudio) {

    danceAudio.addEventListener(
        "ended",
        function () {

            if (!backgroundAudio) {

                return;

            }


            backgroundAudio.currentTime =
                0;


            backgroundAudio.play().catch(
                function () {}
            );

        }
    );

}


/* =========================================
   BIRTHDAY AUDIO FINISHED
========================================= */

if (bdayAudio) {

    bdayAudio.addEventListener(
        "ended",
        function () {

            if (!backgroundAudio) {

                return;

            }


            backgroundAudio.currentTime =
                0;


            backgroundAudio.play().catch(
                function () {}
            );

        }
    );

}


/* ==========================================================================
   MUTE
========================================================================== */

if (muteBtn) {

    muteBtn.addEventListener(
        "click",
        function () {

            isMuted =
                !isMuted;


            const audioElements = [

                backgroundAudio,

                bdayAudio,

                danceAudio,

                clickAudio

            ];


            audioElements.forEach(
                function (audio) {

                    if (audio) {

                        audio.muted =
                            isMuted;

                    }

                }
            );


            muteBtn.textContent =
                isMuted
                    ? "🔇"
                    : "🔊";

        }
    );

}


/* ==========================================================================
   PAGE FILTER
========================================================================== */

function updatePageFilter() {

    if (!pageContent) {

        return;

    }


    const filters = [];


    if (doblur) {

        filters.push(
            `blur(${hungerPercent / 65}px)`
        );

    }


    if (movieModeOn) {

        filters.push(
            "grayscale(0.6)"
        );


        filters.push(
            "sepia(0.3)"
        );

    }


    pageContent.style.filter =
        filters.join(" ");

}


/* ==========================================================================
   MONEY DISPLAY
========================================================================== */

function refreshMoneyDisplay() {

    const moneyDisplay =
        document.getElementById(
            "display-money"
        );


    if (moneyDisplay) {

        moneyDisplay.textContent =
            "Money: $" +
            money;

    }


    if (affordtext) {

        affordtext.innerHTML =
            `<p>Money: $${money}</p>`;

    }


    if (shopaffordtext) {

        shopaffordtext.innerHTML =
            `<p>Money: $${money}</p>`;

    }

}


/* ==========================================================================
   HUNGER DISPLAY
========================================================================== */

function refreshHungerDisplay() {

    const hungerBar =
        document.querySelector(
            ".hunger-bar"
        );


    const hungerLabel =
        document.querySelector(
            ".hunger-percentage"
        );


    if (hungerBar) {

        hungerBar.innerHTML =
            `<span style="width:${hungerPercent}%"></span>`;

    }


    if (hungerLabel) {

        hungerLabel.textContent =
            hungerPercent +
            "%";

    }

}


/* ==========================================================================
   MONEY SYSTEM
========================================================================== */

function updatemoney() {

    if (
        !document.body.classList.contains(
            "birthday-unlocked"
        )
    ) {

        return;

    }


    money +=
        25;


    refreshMoneyDisplay();

}


/* =========================================
   REDUCE MONEY
========================================= */

function reducemoney(
    price
) {

    money -=
        price;


    if (
        money < 0
    ) {

        money =
            0;

    }


    refreshMoneyDisplay();

}


/* ==========================================================================
   HUNGER SYSTEM
========================================================================== */

function hungerUpdate() {

    if (
        !document.body.classList.contains(
            "birthday-unlocked"
        )
    ) {

        return;

    }


    if (
        hungerPercent < 100
    ) {

        hungerPercent +=
            1;

    }


    refreshHungerDisplay();

    updatePageFilter();

}


/* ==========================================================================
   AUTOMATIC TIMERS
========================================================================== */

const hungerInterval =
    setInterval(
        hungerUpdate,
        1000
    );


setInterval(
    updatemoney,
    1000
);


/* ==========================================================================
   SCROLL PROGRESS
========================================================================== */

function updateScrollProgress() {

    if (!scrollProgress) {

        return;

    }


    const scrollTop =
        window.scrollY ||
        document.documentElement.scrollTop;


    const documentHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;


    const percent =
        documentHeight > 0
            ? (
                scrollTop /
                documentHeight
            ) * 100
            : 0;


    scrollProgress.style.width =
        percent +
        "%";

}


window.addEventListener(
    "scroll",
    updateScrollProgress
);


window.addEventListener(
    "resize",
    updateScrollProgress
);


updateScrollProgress();


/* ==========================================================================
   TAB TITLE
========================================================================== */

const originalTitle =
    document.title;


document.addEventListener(
    "visibilitychange",
    function () {

        if (
            document.hidden
        ) {

            document.title =
                "come back pleamseee 🥺";

        }

        else {

            document.title =
                originalTitle;

        }

    }
);


/* ==========================================================================
   CHAT SYSTEM
========================================================================== */

const messages = [

    {
        name:
            "Neerav",

        text:
            "Hailoooo"
    },

    {
        name:
            "Avigna",

        text:
            "helloo"
    },

    {
        name:
            "Neerav",

        text:
            "Well there wasn't really any secret, it was a scam...500$ gone..."
    },

    {
        name:
            "Avigna",

        text:
            "fck u"
    },

    {
        name:
            "Neerav",

        text:
            "areeeee using such language on ur bday, so uncivilised"
    },

    {
        name:
            "Avigna",

        text:
            "......"
    },

    {
        name:
            "Neerav",

        text:
            "acha acha, happy birthday, eat some aloo, be better"
    },

    {
        name:
            "Avigna",

        text:
            "Thanksss"
    },

    {
        name:
            "Neerav",

        text:
            "btw there is a secret...but u will not get it, it is something u need to guess"
    },

    {
        name:
            "Avigna",

        text:
            "ki baje....bol naaaa"
    },

    {
        name:
            "Neerav",

        text:
            "😜😜😜😜 nahii"
    }

];


if (nextMsg) {

    nextMsg.addEventListener(
        "click",
        function () {

            playClick();


            if (!boughtConvo) {

                return;

            }


            if (
                msgIndex >=
                messages.length
            ) {

                return;

            }


            if (!chat) {

                return;

            }


            const message =
                messages[
                    msgIndex
                ];


            const p =
                document.createElement(
                    "p"
                );


            p.className =
                "messages";


            p.innerHTML =
                `<strong>${message.name}:</strong> ${message.text}`;


            chat.appendChild(
                p
            );


            msgIndex++;

        }
    );

}


/* ==========================================================================
   FOOD / RESTAURANT
========================================================================== */

foodButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const price =
                    Number(
                        button.dataset.price
                    );


                const saturation =
                    Number(
                        button.dataset.saturation
                    );


                playClick();


                if (
                    money < price ||
                    foodieEndingTriggered
                ) {

                    return;

                }


                reducemoney(
                    price
                );


                foodBought++;


                if (
                    foodBought > 45 &&
                    !warningGiven
                ) {

                    warningGiven =
                        true;


                    alert(
                        "Stomach is about to burst, take it easy bhai"
                    );

                }


                hungerPercent -=
                    saturation;


                if (
                    hungerPercent < 0
                ) {

                    hungerPercent =
                        0;

                }


                refreshHungerDisplay();

                updatePageFilter();


                if (
                    foodBought >= 25
                ) {

                    activateFoodieEnding();

                }

            }
        );

    }
);


/* ==========================================================================
   FOODIE EMERGENCY ENDING
========================================================================== */

function activateFoodieEnding() {

    if (
        foodieEndingTriggered
    ) {

        return;

    }


    foodieEndingTriggered =
        true;


    clearInterval(
        hungerInterval
    );


    if (blackOut) {

        blackOut.classList.add(
            "black-out"
        );

    }


    const ending =
        document.createElement(
            "div"
        );


    ending.className =
        "foodie-ending-text";


    ending.innerHTML = `

        <div class="foodie-header">
            🚑 FOODIE EMERGENCY 🚑
        </div>


        <p>
            So… you ate
            <strong>
                <em>everything.</em>
            </strong>
        </p>


        <p>
            At first, it was fine.
            You ate one thing, then another,
            and honestly nobody judged you.
        </p>


        <p>
            But then you kept eating.
        </p>


        <p>
            Pizza? Gone.
            <br>
            Burger? Gone.
            <br>
            Momos? Absolutely demolished.
        </p>


        <p>
            Aur phir bhi ruk nahi rahi thi sali. 💀
        </p>


        <p>
            Itna khaya sala restaurant bankrupt ho gaya,
            koi sharam hai.
        </p>


        <p>
            Now... paramedics have appeared.
        </p>


        <p>
            They looked at u...
            they looked at the restaurant owner...
            and sighed.
        </p>


        <p>
            They put u in the ambulance...
            it couldn't move...
        </p>


        <p>
            sala tanki hai.
        </p>


        <p>
            The doctors were shipped to ur location
            but it was too late....
        </p>


        <p>
            <strong>
                <em>
                    SECRET ENDING UNLOCKED 💀
                </em>
            </strong>
        </p>


        <p>
            Now restart and next time...
        </p>


        <p>
            please eat a little less.
        </p>


        <p>
            It's a bit concerning.
        </p>

    `;


    document.body.appendChild(
        ending
    );


    createRestartButton();

}


/* ==========================================================================
   RESTART BUTTON
========================================================================== */

function createRestartButton() {

    if (
        document.querySelector(
            ".restart-button"
        )
    ) {

        return;

    }


    const button =
        document.createElement(
            "button"
        );


    button.className =
        "restart-button";


    button.textContent =
        "Restart Website";


    button.addEventListener(
        "click",
        function () {

            location.reload();

        }
    );


    document.body.appendChild(
        button
    );

}


/* ==========================================================================
   SHOP SYSTEM
========================================================================== */

shopButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                playClick();


                const price =
                    Number(
                        button.dataset.price
                    );


                const unlock =
                    button.dataset.unlock;


                if (

                    (
                        unlock ===
                        "conversation" &&
                        boughtConvo
                    )

                    ||

                    (
                        unlock ===
                        "message" &&
                        boughtMsg
                    )

                    ||

                    (
                        unlock ===
                        "blur" &&
                        boughtBlur
                    )

                ) {

                    return;

                }


                if (
                    money < price
                ) {

                    refreshMoneyDisplay();

                    return;

                }


                reducemoney(
                    price
                );


                /* =================================
                   CONVERSATION
                ================================== */

                if (
                    unlock ===
                    "conversation"
                ) {

                    boughtConvo =
                        true;


                    const lockedChat =
                        document.getElementById(
                            "locked-chat"
                        );


                    if (lockedChat) {

                        lockedChat.textContent =
                            "🔓";

                    }

                }


                /* =================================
                   MESSAGE
                ================================== */

                if (
                    unlock ===
                    "message"
                ) {

                    boughtMsg =
                        true;


                    const message =
                        document.getElementById(
                            "message"
                        );


                    const lockedMessage =
                        document.getElementById(
                            "locked-message"
                        );


                    if (message) {

                        message.classList.add(
                            "message-animation"
                        );

                        /*
                            Your CSS can use
                            .message-animation
                            to reveal the message.
                        */

                        message.style.opacity =
                            "1";

                    }


                    if (lockedMessage) {

                        lockedMessage.textContent =
                            "🔓";

                    }

                }


                /* =================================
                   REMOVE BLUR
                ================================== */

                if (
                    unlock ===
                    "blur"
                ) {

                    doblur =
                        false;


                    boughtBlur =
                        true;


                    clearInterval(
                        hungerInterval
                    );


                    updatePageFilter();

                }


                button.textContent =
                    "Bought";


                button.style.background =
                    "black";


                refreshMoneyDisplay();


                checkGiftUnlock();

            }
        );

    }
);


/* ==========================================================================
   GIFT UNLOCK
========================================================================== */

function checkGiftUnlock() {

    if (
        boughtConvo &&
        boughtMsg &&
        boughtBlur
    ) {

        const lockedNotice =
            document.getElementById(
                "gift-locked-notice"
            );


        const giftSection =
            document.getElementById(
                "gift-section"
            );


        if (lockedNotice) {

            lockedNotice.style.display =
                "none";

        }


        if (giftSection) {

            giftSection.style.display =
                "block";

        }

    }

}


/* ==========================================================================
   FINAL GIFT
========================================================================== */

const bdayBtn =
    document.querySelector(
        ".gift-button"
    );


if (bdayBtn) {

    bdayBtn.addEventListener(
        "click",
        function () {

            if (!pageContent) {

                return;

            }


            pageContent.classList.add(
                "gift-layout"
            );


            pageContent.innerHTML = `

                <h2 class="section-header white appear">
                    Gift Unlocked
                </h2>


                <img
                    src="image/Screenshot 2026-08-19 181429.png"
                    alt="bday cake"
                    class="appear"
                >


                <p class="white appear">

                    The audacity for u to ask more
                    after all this btw... sighhh

                </p>

            `;


            if (blackOut) {

                blackOut.classList.add(
                    "black-out"
                );

            }


            playClick();


            if (backgroundAudio) {

                backgroundAudio.pause();

            }


            if (bdayAudio) {

                bdayAudio.currentTime =
                    0;


                bdayAudio.volume =
                    1;


                bdayAudio.play().catch(
                    function () {}
                );

            }


            createRestartButton();

        }
    );

}


/* ==========================================================================
   GIFT CONFETTI
========================================================================== */

const confettiBtn =
    document.getElementById(
        "confettiBtn"
    );


if (confettiBtn) {

    confettiBtn.addEventListener(
        "click",
        function () {

            if (
                confettiStarted ||
                typeof confetti !==
                    "function"
            ) {

                return;

            }


            confettiStarted =
                true;


            const canvas =
                document.createElement(
                    "canvas"
                );


            canvas.className =
                "gift-confetti-canvas";


            if (pageContent) {

                pageContent.appendChild(
                    canvas
                );

            }


            const giftConfetti =
                confetti.create(
                    canvas,
                    {
                        resize:
                            true,

                        useWorker:
                            true
                    }
                );


            function shootConfetti() {

                giftConfetti({

                    particleCount:
                        10,

                    angle:
                        60,

                    spread:
                        50,

                    startVelocity:
                        80,

                    gravity:
                        0.8,

                    ticks:
                        250,

                    origin: {

                        x:
                            0,

                        y:
                            1

                    }

                });


                giftConfetti({

                    particleCount:
                        10,

                    angle:
                        120,

                    spread:
                        50,

                    startVelocity:
                        80,

                    gravity:
                        0.8,

                    ticks:
                        250,

                    origin: {

                        x:
                            1,

                        y:
                            1

                    }

                });

            }


            shootConfetti();


            setInterval(
                shootConfetti,
                100
            );

        }
    );

}


/* ==========================================================================
   HOBBY EASTER EGG SYSTEM
========================================================================== */

const HOBBY_CLICKS_TO_UNLOCK =
    10;


function setupHobbyEasterEgg(
    selector,
    threshold,
    onUnlock,
    repeatable
) {

    const card =
        document.querySelector(
            selector
        );


    if (!card) {

        return;

    }


    let clicks =
        0;


    let locked =
        false;


    card.addEventListener(
        "click",
        function () {

            if (locked) {

                return;

            }


            clicks++;


            playClick();


            if (
                clicks <
                threshold
            ) {

                return;

            }


            if (repeatable) {

                clicks =
                    0;

            }

            else {

                locked =
                    true;

            }


            onUnlock(
                card
            );

        }
    );

}


/* ==========================================================================
   DANCE EASTER EGG
========================================================================== */

setupHobbyEasterEgg(
    ".dance",
    HOBBY_CLICKS_TO_UNLOCK,
    function (card) {

        card.classList.add(
            "dance-mode"
        );


        if (
            !card.querySelector(
                ".dance-label"
            )
        ) {

            const label =
                document.createElement(
                    "p"
                );


            label.className =
                "hobby-unlock-text dance-label";


            label.textContent =
                "SHE'S GOT THE MOVES 💃";


            card.appendChild(
                label
            );

        }


        if (backgroundAudio) {

            backgroundAudio.pause();

        }


        if (danceAudio) {

            danceAudio.currentTime =
                0;


            danceAudio.play().catch(
                function () {}
            );

        }


        if (
            typeof confetti ===
            "function"
        ) {

            let bursts =
                0;


            const danceBurst =
                setInterval(
                    function () {

                        confetti({

                            particleCount:
                                6,

                            spread:
                                100,

                            startVelocity:
                                35,

                            origin: {

                                x:
                                    Math.random() *
                                    0.4 +
                                    0.3,

                                y:
                                    0.7

                            }

                        });


                        bursts++;


                        if (
                            bursts >
                            15
                        ) {

                            clearInterval(
                                danceBurst
                            );

                        }

                    },
                    150
                );

        }


        setTimeout(
            function () {

                card.classList.remove(
                    "dance-mode"
                );

            },
            10000
        );

    },
    true
);


/* ==========================================================================
   MOVIES EASTER EGG
========================================================================== */

setupHobbyEasterEgg(
    ".movies",
    HOBBY_CLICKS_TO_UNLOCK,
    function (card) {

        if (
            document.querySelector(
                ".movie-overlay"
            )
        ) {

            return;

        }


        const overlay =
            document.createElement(
                "div"
            );


        overlay.className =
            "movie-overlay";


        overlay.innerHTML =
            '<span class="movie-countdown">3</span>';


        document.body.appendChild(
            overlay
        );


        const countdownEl =
            overlay.querySelector(
                ".movie-countdown"
            );


        let count =
            3;


        const countdownTimer =
            setInterval(
                function () {

                    count--;


                    if (
                        count > 0
                    ) {

                        countdownEl.textContent =
                            count;

                    }

                    else if (
                        count === 0
                    ) {

                        countdownEl.textContent =
                            "CINEMA 🎬";

                    }

                    else {

                        clearInterval(
                            countdownTimer
                        );


                        overlay.remove();


                        movieModeOn =
                            true;


                        updatePageFilter();

                    }

                },
                1000
            );


        if (
            !document.querySelector(
                ".no-cinema-button"
            )
        ) {

            const offButton =
                document.createElement(
                    "button"
                );


            offButton.className =
                "no-cinema-button";


            offButton.textContent =
                "Cinema Mode Off";


            offButton.addEventListener(
                "click",
                function () {

                    movieModeOn =
                        false;


                    updatePageFilter();


                    offButton.remove();

                }
            );


            document.body.appendChild(
                offButton
            );

        }


        if (
            !card.querySelector(
                ".movies-label"
            )
        ) {

            const label =
                document.createElement(
                    "p"
                );


            label.className =
                "hobby-unlock-text movies-label";


            label.textContent =
                '"one movie" — the biggest lie she tells 🎬';


            card.appendChild(
                label
            );

        }

    },
    true
);


/* ==========================================================================
   BOOKS EASTER EGG
========================================================================== */

setupHobbyEasterEgg(
    ".books",
    HOBBY_CLICKS_TO_UNLOCK,
    function (card) {

        card.classList.add(
            "book-mode"
        );


        if (
            !card.querySelector(
                ".books-label"
            )
        ) {

            const label =
                document.createElement(
                    "p"
                );


            label.className =
                "hobby-unlock-text books-label";


            label.textContent =
                '"just one more chapter" — famous last words 📖';


            card.appendChild(
                label
            );

        }


        showBirthdayPoem();

    },
    true
);


/* ==========================================================================
   BIRTHDAY POEM
========================================================================== */

function showBirthdayPoem() {

    if (
        document.querySelector(
            ".poem-overlay"
        )
    ) {

        return;

    }


    const page =
        document.querySelector(
            "#page-content"
        );


    if (!page) {

        return;

    }


    page.classList.add(
        "page-fade-out"
    );


    const poemOverlay =
        document.createElement(
            "div"
        );


    poemOverlay.className =
        "poem-overlay";


    poemOverlay.innerHTML = `

        <div class="poem-text">

            <p>
                Today, <br> <br>

                In the dead of night, fireworks blossom like tiny stars.
                <br>
                Seated on the garden soil, the seasons turn without notice.
            </p>


            <p>
                In this garden of life, another flower blooms
                <br>
                With stories both radiant and dreary.
            </p>


            <p>
                The flowers, with their beauty and grime,
                <br>
                are reflections of our actions over time.
            </p>


            <p>
                The sound of laughter and muffled cries
                <br>
                breathe a soul into one's life.
            </p>


            <p>
                Under the winds of change and time
                <br>
                Mountains erode, rivers run dry, and yet—the flowers remain,
                <br>
                quietly unchanged.
            </p>


            <p>
                And so, between the silence and noise, we remain
                <br>
                not forever, but nurturing a flower while we still can,
                <br>
                forever immortalizing ourselves, in the panels of time.
            </p>

        </div>


        <button class="button poem-return-button">
            ← Back to the page
        </button>

    `;


    document.body.appendChild(
        poemOverlay
    );


    setTimeout(
        function () {

            poemOverlay.classList.add(
                "visible"
            );

        },
        1000
    );


    const returnBtn =
        poemOverlay.querySelector(
            ".poem-return-button"
        );


    returnBtn.addEventListener(
        "click",
        function () {

            playClick();


            poemOverlay.classList.remove(
                "visible"
            );


            setTimeout(
                function () {

                    poemOverlay.remove();


                    page.classList.remove(
                        "page-fade-out"
                    );

                },
                1000
            );

        }
    );

}


/* ==========================================================================
   TYPING SECRETS
========================================================================== */


/*
    Type these words anywhere on the page:

    avigna
    secret
    cake
*/

const typingSecrets = {

    avigna: {

        messages: [

            "Yoooo. you found the secret. congrats.",

            "Aloo",

            "U know u are pretty narcissistic man",

            "Alrrr we get it okay, this website is for u",

            "Stop typing, and explore my work dummy"

        ],

        action:
            showAvignaToast

    },


    secret: {

        messages: [

            "🚨 YOU FOUND A SECRET SECRET",

            "This secret was hidden from Avigna.",

            "Neerav definitely spent too much time making this.",

            "There is absolutely nothing useful here.",

            "Congratulations. You wasted your time professionally."

        ],

        action:
            showSecretToast

    },


    cake: {

        action:
            spawnFloatingCakes

    }

};


const MAX_TYPED_BUFFER =
    30;


document.addEventListener(
    "keydown",
    function (event) {

        if (
            !document.body.classList.contains(
                "birthday-unlocked"
            )
        ) {

            return;

        }


        if (
            event.key.length !== 1
        ) {

            return;

        }


        typedBuffer +=
            event.key.toLowerCase();


        if (
            typedBuffer.length >
            MAX_TYPED_BUFFER
        ) {

            typedBuffer =
                typedBuffer.slice(
                    -MAX_TYPED_BUFFER
                );

        }


        const words =
            Object.keys(
                typingSecrets
            );


        for (
            let i = 0;
            i < words.length;
            i++
        ) {

            const word =
                words[i];


            if (
                typedBuffer.endsWith(
                    word
                )
            ) {

                const secret =
                    typingSecrets[word];


                if (
                    secret.messages
                ) {

                    const message =
                        secret.messages[
                            Math.floor(
                                Math.random() *
                                secret.messages.length
                            )
                        ];


                    secret.action(
                        message
                    );

                }

                else {

                    secret.action();

                }


                typedBuffer =
                    "";


                break;

            }

        }

    }
);


/* ==========================================================================
   AVIGNA TOAST
========================================================================== */

function showAvignaToast(
    message
) {

    if (!avignaToast) {

        return;

    }


    clearTimeout(
        avignaToastTimeout
    );


    avignaToast.textContent =
        message;


    avignaToast.classList.add(
        "show"
    );


    avignaToastTimeout =
        setTimeout(
            function () {

                avignaToast.classList.remove(
                    "show"
                );

            },
            2600
        );

}


/* ==========================================================================
   SECRET TOAST
========================================================================== */

function showSecretToast(
    message
) {

    showAvignaToast(
        "🔐 " +
        message
    );

}


/* ==========================================================================
   FLOATING CAKES
========================================================================== */

function spawnFloatingCakes() {

    for (
        let i = 0;
        i < 18;
        i++
    ) {

        const cake =
            document.createElement(
                "div"
            );


        cake.className =
            "floating-cake";


        cake.textContent =
            "🎂";


        cake.style.left =
            Math.random() *
            100 +
            "vw";


        cake.style.animationDuration =
            (
                3 +
                Math.random() *
                3
            ) +
            "s";


        cake.style.animationDelay =
            (
                Math.random() *
                0.8
            ) +
            "s";


        cake.style.fontSize =
            (
                1.5 +
                Math.random() *
                2
            ) +
            "rem";


        document.body.appendChild(
            cake
        );


        setTimeout(
            function () {

                cake.remove();

            },
            7000
        );

    }

}


/* ==========================================================================
   KONAMI CODE
========================================================================== */

const konamiCode = [

    "ArrowUp",
    "ArrowUp",

    "ArrowDown",
    "ArrowDown",

    "ArrowLeft",
    "ArrowRight",

    "ArrowLeft",
    "ArrowRight",

    "b",
    "a"

];


document.addEventListener(
    "keydown",
    function (event) {

        if (
            !document.body.classList.contains(
                "birthday-unlocked"
            )
        ) {

            return;

        }


        const key =
            event.key.length === 1

                ? event.key.toLowerCase()

                : event.key;


        if (
            key ===
            konamiCode[
                konamiIndex
            ]
        ) {

            konamiIndex++;


            if (
                konamiIndex ===
                konamiCode.length
            ) {

                activateKonamiCode();


                konamiIndex =
                    0;

            }

        }

        else {

            konamiIndex =
                key ===
                konamiCode[0]
                    ? 1
                    : 0;

        }

    }
);


/* ==========================================================================
   KONAMI ACTIVATION
========================================================================== */

function activateKonamiCode() {

    showAvignaToast(
        "🎮 KONAMI CODE ACTIVATED. YOU CHEATED."
    );


    if (
        typeof confetti !==
        "function"
    ) {

        return;

    }


    confetti({

        particleCount:
            150,

        spread:
            180,

        startVelocity:
            60,

        gravity:
            0.8,

        origin: {

            x:
                0.5,

            y:
                0.6

        }

    });


    setTimeout(
        function () {

            confetti({

                particleCount:
                    100,

                spread:
                    120,

                startVelocity:
                    45,

                origin: {

                    x:
                        0.1,

                    y:
                        0.7

                }

            });


            confetti({

                particleCount:
                    100,

                spread:
                    120,

                startVelocity:
                    45,

                origin: {

                    x:
                        0.9,

                    y:
                        0.7

                }

            });

        },
        250
    );

}


/* ==========================================================================
   IDLE NUDGE
========================================================================== */

const IDLE_TIME =
    20000;


const idleMessages = [

    "👀 You still there?",

    "Bro... you haven't touched anything in a while.",

    "The website is getting lonely.",

    "Psst... there are secrets hidden here.",

    "Try clicking around. You might find something.",

    "Avigna would probably have found a secret by now.",

    "You're really just gonna stare at the website?"

];


function resetIdleTimer() {

    if (
        !document.body.classList.contains(
            "birthday-unlocked"
        )
    ) {

        return;

    }


    clearTimeout(
        idleTimer
    );


    idleTimer =
        setTimeout(
            showIdleNudge,
            IDLE_TIME
        );

}


function showIdleNudge() {

    if (
        !document.body.classList.contains(
            "birthday-unlocked"
        )
    ) {

        return;

    }


    const message =
        idleMessages[
            idleNudgeCount %
            idleMessages.length
        ];


    idleNudgeCount++;


    showAvignaToast(
        message
    );


    resetIdleTimer();

}


[
    "mousemove",
    "mousedown",
    "keydown",
    "scroll",
    "touchstart"
].forEach(
    function (eventName) {

        document.addEventListener(
            eventName,
            resetIdleTimer,
            {
                passive:
                    true
            }
        );

    }
);


resetIdleTimer();


/* ==========================================================================
   SECRET LOGO
   CLICK A. FIVE TIMES
========================================================================== */

if (secretLogo) {

    secretLogo.addEventListener(
        "click",
        function () {

            logoClicks++;


            playClick();


            clearTimeout(
                logoClickTimer
            );


            logoClickTimer =
                setTimeout(
                    function () {

                        logoClicks =
                            0;

                    },
                    1200
                );


            if (
                logoClicks >=
                5
            ) {

                logoClicks =
                    0;


                showAvignaToast(
                    "🤫 You found the CEO button."
                );


                if (
                    typeof confetti ===
                    "function"
                ) {

                    confetti({

                        particleCount:
                            60,

                        spread:
                            100,

                        startVelocity:
                            35,

                        origin: {

                            x:
                                0.12,

                            y:
                                0.12

                        }

                    });

                }


                secretLogo.animate(

                    [

                        {

                            transform:
                                "rotate(0deg) scale(1)"

                        },

                        {

                            transform:
                                "rotate(-15deg) scale(1.3)"

                        },

                        {

                            transform:
                                "rotate(15deg) scale(1.3)"

                        },

                        {

                            transform:
                                "rotate(0deg) scale(1)"

                        }

                    ],

                    {

                        duration:
                            600,

                        easing:
                            "ease-in-out"

                    }

                );

            }

        }
    );

}


/* ==========================================================================
   INITIAL DISPLAY
========================================================================== */

refreshMoneyDisplay();

refreshHungerDisplay();

updatePageFilter();