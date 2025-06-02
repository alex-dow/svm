import { expect, test } from "vitest";

import { parseSaveFile } from "@/workers/saveFileWorker";

test('parseSaveFile', async () => {
    const save = await parseSaveFile(new File([], 'testSave.sav'));
    expect(save).toBeDefined();
});