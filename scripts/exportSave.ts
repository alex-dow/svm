import { Parser } from '@etothepii/satisfactory-file-parser';
import * as fs from 'fs';

async function main(saveFile: string) {    

    const buf = fs.readFileSync(saveFile);
    const save = Parser.ParseSave('MySave', buf.buffer);

    fs.writeFileSync(saveFile + '.json', JSON.stringify(save, null, 4));
}

main('testSave.sav')
.then(() => { console.log('done')})
.catch((err) => { console.error(err)})