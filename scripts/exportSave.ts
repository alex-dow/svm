import { Parser } from '@etothepii/satisfactory-file-parser';
import * as fs from 'fs';



/*
async function main(saveFile: string) {    

    const buf = fs.readFileSync(saveFile);
    const save = Parser.ParseSave('MySave', buf.buffer);

    fs.writeFileSync(saveFile + '.json', JSON.stringify(save, null, 4));
}
    */


async function main(args: string[]) {

    const saveFile = args[0];

    const buf = fs.readFileSync(saveFile);
    const save = Parser.ParseSave('MySave', buf.buffer);

    fs.writeFileSync(saveFile + '.json', JSON.stringify(save, null, 4));

}

console.log(process.argv);

// first arg is node, second arg is the script file.
main(process.argv.slice(2))
.then(() => { console.log('done')})
.catch((err) => { console.error(err)})
