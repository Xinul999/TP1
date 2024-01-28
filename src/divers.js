/**
 * @description Definie la variable pour le hash du premier bloc
 * @type {string}
 */
export const monSecret = "";

/**
 * @description Retourne un timestamp au format aaaammjj-hh:mm:ss
 * @return {string}
 */
export function getDate() {
     const d = new Date();
     const mm = (d.getMonth() + 1 < 10) ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
     const dd = (d.getDate() < 10) ? "0" + d.getDate() : d.getDate();
     const yyyymmdd = d.getFullYear() + mm + dd;
     const time = d.getHours() + ':' +
         ((d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes() )+ ':' +
         ((d.getSeconds() < 10) ? "0" + d.getSeconds() : d.getSeconds());
     return yyyymmdd + '-' + time;
}