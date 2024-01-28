import {readFile, writeFile} from 'node:fs/promises'
import {getDate} from "./divers.js";
import {createHash} from 'node:crypto'
import {v4 as uuidv4} from 'uuid';

/* Chemin de stockage des blocks */
const path = '/home/linuxlite/PhpStorm/tp1/data/blockchain.json'
//const path = '../data/blockchain.json'

/**
 * Mes définitions
 * @typedef { id: string, nom: string, don: number, date: string,hash: string} Block
 * @property {string} id
 * @property {string} nom
 * @property {number} don
 * @property {string} date
 * @property {string} string
 *
 */

/**
 * Renvoie un tableau json de tous les blocks
 * @return {Promise<any>}
 */
export async function findBlocks() {
   try{
       const response = await readFile(path);
       return new Promise(resolve => {
           if(response.length === 0) resolve(null);
           resolve(JSON.parse(response));
       });
   }catch (err){
       return new Promise(reject => reject(null));
   }

}

/**
 * Trouve un block à partir de son id
 * @param partialBlock
 * @return {Promise<Block[]>}
 */
export async function findBlock(partialBlock) {
    const blocks = await findBlocks();
    let prev = undefined;
    blocks.find(f => {
        if(f.id !== partialBlock.id) prev = f;
        else return f;
    });

    return new Promise(resolve => {
        const hashData = creatingHash('sha256', prev);
        const value = hashData.digest('hex', hashData);
        if(value !== prev.hash){
            return resolve(partialBlock);
        }else{
            return resolve(null);
        }
    });

}

/**
 * Trouve le dernier block de la chaine
 * @return {Promise<Block|null>}
 */
export async function findLastBlock() {
    const blocks = await findBlocks();
    const lastBlock = (blocks === null || undefined) ? null : blocks[blocks.length - 1];
    return new Promise(resolve => resolve(lastBlock));

}

/**
 * Creation d'un block depuis le contenu json
 * @param contenu
 * @return {Promise<Block[]>}
 */
export async function createBlock(contenu) {
    const obj = {
        id: uuidv4(),
        nom: contenu.nom,
        don: contenu.don,
        date: getDate(),
    }
    try{
        const isOk = await verifBlocks();
        console.log("Check blocks : ", isOk);
        const blockAll = await findBlocks();
        obj.hash = hashMe(await findLastBlock(), obj);
        const arr = (blockAll === null || blockAll === undefined) ? [obj] : [...blockAll, obj];
        const json = JSON.stringify(arr, null, 2);
        await writeFile(path, json);
        return new Promise(resolve => resolve(arr));
    }catch(err){
        console.log(err);
    }
}

/**
 * Creation du hash
 * @param previousBlock
 * @param currentBlock
 * @returns {Promise<ArrayBuffer>|null}
 */
const hashMe = (previousBlock, currentBlock) => {
    if(previousBlock === null || previousBlock === undefined) return null;
    if(previousBlock.id !== currentBlock.id){
        const data = creatingHash('sha256' , previousBlock);
        return data.digest('hex', data);
    }
    return null;
}
/**
 * Vérification de tout les block json
 * @return {boolean}
 */
const verifBlocks = async () => {
    const blockAll = await findBlocks();
    for(let i = 1; i < blockAll.length; ++i){
        const previousBlock = blockAll[i - 1];
        const hashData = creatingHash('sha256', previousBlock);
        const value = hashData.digest('hex', hashData);
        if(value !== blockAll[i].hash) {
            const dataTest = await findBlock(blockAll[i]);
            console.log("Block error", dataTest);
            return false;
        }
    }
    return true;
}
/**
 * Creation du hash
 * @param param
 * @param block
 * @returns {any}
 */
const creatingHash = (param, block) => {
    return createHash(param).update(JSON.stringify(block));
}



