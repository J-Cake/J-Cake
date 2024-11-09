import * as fs from 'node:fs/promises';
import * as esbuild from 'esbuild';
import markdownIt from 'markdown-it';
import frontMatter from "markdown-it-front-matter";
import {iterSync} from "@j-cake/jcake-utils/iter";
import {oneOf} from "@j-cake/jcake-utils/args";

import log from './log.js';
import Path from "./path.js";
import markdownItFrontMatter from "markdown-it-front-matter";
import {buildPage, redirect} from "./build.js";

const md = () => new Promise(ok => markdownIt()
    .use(frontMatter, fm => ok(fm)));

export const config = {
    root: new Path(process.cwd()).join("pages"),
    build: new Path(process.cwd()).join("build"),
    logLevel: "info",
    defaultLanguage: "en"
};

const logLevel = oneOf(Object.keys(log));

for (const {current: arg, skip: next} of iterSync.peekable(process.argv.slice(2)))
    if (arg === "--log-level" || arg === "-l")
        config.logLevel = logLevel(next());

    else if (arg === "--root")
        config.root = new Path(next());

    else if (arg === "--build")
        config.build = new Path(next());

    else if (arg === "--default-language")
        config.defaultLanguage = next();

log.debug(config);

await fs.mkdir(config.build.path, { recursive: true });

const progress = [];

for await (const file of config.root.readdir())
    if (file.ext() === "md") {
        const dest = file.replaceBase(config.root, config.build)
            .withExt("html");

        progress.push(buildPage(file)
            .then(res => fs.writeFile(dest.path, res)));

        await fs.mkdir(dest.parent().path, { recursive: true });

        if (file.name().split(".").slice(-2)[0] === config.defaultLanguage)
            await fs.writeFile(file
                .replaceBase(config.root, config.build)
                .withName(file.name()
                    .split(".")
                    .slice(0, -2)
                    .concat("html")
                    .join(".")).path, redirect(dest));
    }

await Promise.all(progress);