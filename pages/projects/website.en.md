---
title: "All about this website"
template: "./template.html"
---

# All about this website

For the most part, I'm anything but lazy. In fact I'm far too ambitious. I enjoy recreating things - sometimes to my own
detriment. Last week I decided I don't like Jekyll, or Hugo or ... anything not already finished and ready-to-go. On I
go to build by own hand-rolled static-site-generator that can work with GitHub Pages (since, you know, free for personal
use etc). And well it works!

To be fair to myself, it's not the first time dabbling with SSGs. For one, I've had the honour of building a website for
a company I work at who had the very real desire to not require knowledge of HTML or even Markdown. With promises like "
Yes, Microsoft Word will work just fine!" the task was quite substantial. Of course Wordpress, the engine we used at the
time doesn't have support for Office or anything ... no that would be far too simple.

I had written up a Python script which using a template HTML file, converted Word files to HTML using Pandoc and
deployed them to a static file server. It worked! Even things like localisation with the help of a few extra lines of
code was simple enough to implement. It worked roughly like this:

1. Generate a namespace for each language (a folder, Jake, it's a folder. Stop overcomplicating things).
2. Define a naming scheme: `[url].[lang].[ext]` and walk the page root, grouping each file of recognised formats by
   language
3. Convert to HTML page and place in the correct folder, omitting the language extension.
4. In the template HTML file, add a client-side URL redirection which simply adjusts the namespace.

I liked it because you literally could work with Word. Granted it took people a while to wrap their head around, but
since we had a NAS, implementing a CRON job to rebuild the staging environment based on a well-known location for pages
made it easy to work on. With a sensible CSS structure, life was easy. In fact the company still uses that structure
today.

But I had developed a sense of cleanliness using this approach. If you can separate the source of the pages from the
scripts which compile it, it's almost like magic. Needless to say, my future websites all used a similar approach.

That brings me to today. In about 10 hours, I had reimplemented these scripts using NodeJS and a lot of improvements
including parallelisation and proper CSS bundling using ESBuild. It works in much the same way, except I don't need Word
integration, so Markdown it is. 

This website now runs on push in GitHub actions. It's wonderful. Feel free to use it for your own Pages website. 