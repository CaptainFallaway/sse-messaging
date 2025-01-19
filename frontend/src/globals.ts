import { signal } from "@preact/signals";

function randomName() {
    return "User" + Math.floor(Math.random() * 1000);
}

export const firstTime = localStorage.getItem("author") == null;

export const username = signal(localStorage.getItem("author") || randomName())

username.subscribe((value) => {
    localStorage.setItem("author", value);
});

export const theme = signal(localStorage.getItem("theme") || "dark");

theme.subscribe((value) => {
    localStorage.setItem("theme", value);
    document.documentElement.setAttribute('data-theme', value);
});

export const themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset"
].sort();