import * as fs from 'node:fs/promises';
import markdownIt from "markdown-it";
import markdownItFrontMatter from "markdown-it-front-matter";
import yaml from 'yaml';

import log from "./log.js";
import * as util from "./util.js";
import {config} from "./main.js";

export const render = path =>
    fs.readFile(path.path, 'utf8')
        .then(res => new Promise(ok => {
            const md = markdownIt({
                typographer: true,
                linkify: true
            })
                .use(markdownItFrontMatter, fm => setTimeout(() => ok({
                    fm: yaml.parse(fm, {}),
                    res: out
                })));

            const out = md.render(res);
        }));

export const evaluate = async (expr, fm, body, util) => await eval(expr);

export async function buildPage(path) {
    log.verbose("Building page", path.path);

    const {fm, res} = await render(path);

    let template = await fs.readFile('template' in fm ? fm['template'] : './template.html', 'utf8');

    while (true) {
        const startIndex = template.indexOf('{');
        let braceCount = 1;

        if (startIndex <= -1)
            break;

        for (const [key, char] of [...template.slice(startIndex + 1)].map((i, a) => [a, i]))
            if (char === "{")
                braceCount++;

            else if (char === "}") {
                if (--braceCount === 0) {
                    const fn = evaluate(template.slice(startIndex + 1, startIndex + key + 1), fm, res, util);

                    template = [
                        template.slice(0, startIndex),
                        await fn,
                        template.slice(startIndex + 2 + key)
                    ].join('');

                    break;
                }
            }
    }

    return template;
}

export function redirect(to) {
    return `<!DOCTYPE HTML><html><head><meta http-equiv="refresh" content="0; url=${encodeURI(to.replaceBase(config.build, '/').path.replaceAll('\\', '/'))}" /></head></html>`;
}