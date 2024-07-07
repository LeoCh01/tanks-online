export const BASE_URL = "http://192.168.2.42:5000";
export const canvas = document.querySelector("canvas");
export const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

export const SIZE = 1;
export const PP = (pos) => pos * ((Math.min(canvas.width, canvas.height) / 10) * SIZE);
