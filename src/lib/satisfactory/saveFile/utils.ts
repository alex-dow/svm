import { SatisfactorySave } from "@etothepii/satisfactory-file-parser";
import { SaveItem } from "./pathTypes";


export function collectAllItems(save: SatisfactorySave) {
    return Object.values(save.levels).reduce((a, level) => {
        return a.concat(level.objects);
    }, [] as SaveItem[]);
}

export async function collectItems(save: SatisfactorySave, typePaths: Readonly<(readonly string[] | string)[]>) {

    const items: SaveItem[][] = Array.from({length: typePaths.length}, () => []);

    const levels = Object.values(save.levels);
    for (let i = 0; i < levels.length; i++) {
        const level = levels[i];
        for (let j = 0; j < level.objects.length; j++) {
            const obj = level.objects[j];

            const index = typePaths.findIndex((path) => {
                if (Array.isArray(path)) {
                    return path.includes(obj.typePath);
                }
                return path === obj.typePath;
            });

            if (index !== -1) {
                if (obj.instanceName === 'Persistent_Level:PersistentLevel.Build_ConveyorAttachmentMerger_C_2147458218.Output0') {
                    console.log('adding mystery thing');
                }
                items[index].push(obj);
            }

        }
    }

    return items;
}


