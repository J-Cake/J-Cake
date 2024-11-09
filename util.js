import * as fs from 'node:fs/promises';
import * as esbuild from 'esbuild';

import { config } from './main.js';
import Path from "./path.js";
import log from './log.js';

export async function includeStylesheet(stylesheet) {
    log.verbose("Bundling Stylesheet", stylesheet)

    const out = await esbuild.build({
        entryPoints: [stylesheet],
        bundle: true,
        sourcemap: true,
        outdir: config.build.join("css").path,
        metafile: true
    });

    return Object.keys(out.metafile.outputs)
        .filter(i => i.endsWith(".css"))
        .map(i => `<link rel="stylesheet" href=${new Path(i)
            .replaceBase(config.build, new Path("/"))
            .path
            .replaceAll("\\", "/")}>`).join('\n');
}

export async function include(template) {
    return await fs.readFile(template, 'utf8');
}

export function langSwitch(lang) {
    return lang["en"];
}