import * as fs from 'node:fs/promises';
import * as esbuild from 'esbuild';
import markdownIt from 'markdown-it';
import frontMatter from "markdown-it-front-matter";
import {iterSync} from "@j-cake/jcake-utils/iter";
import {oneOf} from "@j-cake/jcake-utils/args";

import log from './log.js';
import Path from "./path.js";
import markdownItFrontMatter from "markdown-it-front-matter";
import {buildPage} from "./build.js";

const md = () => new Promise(ok => markdownIt()
    .use(frontMatter, fm => ok(fm)));

export const config = {
    root: new Path(process.cwd()).join("pages"),
    build: new Path(process.cwd()).join("build"),
    logLevel: "info",
};

const logLevel = oneOf(Object.keys(log));

for (const {current: arg, skip: next} of iterSync.peekable(process.argv.slice(2)))
    if (arg === "--log-level" || arg === "-l")
        config.logLevel = logLevel(next());

    else if (arg === "--root")
        config.root = new Path(next());

    else if (arg === "--build")
        config.build = new Path(next());

log.debug(config);

await fs.mkdir(config.build.path, { recursive: true });

const progress = [];

for await (const file of config.root.readdir())
    if (file.ext() === "md")
        progress.push(buildPage(file)
            .then(res => fs.writeFile(file.replaceBase(config.root, config.build)
                .withExt("html"), res)));

await Promise.all(progress);