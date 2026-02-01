// ==UserScript==
// @name         Auto Fill CAPTCHA UIT
// @version      1.2
// @match        https://student.uit.edu.vn/*
// @match        https://daa.uit.edu.vn/*
// ==/UserScript==

(function () {
    'use strict';

    function autoFillCaptcha() {
        const label = document.querySelector(
            'label[for="edit-english-captcha-answer"]'
        );
        const input = document.getElementById('edit-english-captcha-answer');

        if (!label || !input) return;

        const match = label.innerText.match(/\(([^)]+)\)/);
        if (match && match[1]) {
            input.value = match[1].trim();
            input.style.backgroundColor = "#d4edda";
            console.log("UIT CAPTCHA auto-filled:", match[1]);
        }
    }

    window.addEventListener('load', autoFillCaptcha);
})();
