/**
 * 
 * @param {abc.json} data basiquement c'est le abc.json
 * @param {string} letter la lettre que tu veux
 * @returns return le writeArray par la lettre et non par l'index
 */
export const getWriteArrayByLetter = (data, letter) => {
    console.log("data", data, letter)
    const item = data.find(
        (el) => el.l.toLowerCase() === letter.toLowerCase()
    );
    return item ? item.writeArray : [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
};
