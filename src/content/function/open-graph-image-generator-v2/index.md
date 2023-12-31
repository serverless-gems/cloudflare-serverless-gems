---
title: Open Graph Image Generator v2
description: The function generates an image using HTML template.
tags: [image, open-graph, puppeteer, html]
---

The Open Graph Image Generator is a function that generates an Open Graph image using HTML template.

It uses Puppeteer and Chromium to launch a headless browser, set to use HTML template as a content for the page, to take a screenshot, and return the image as a base64-encoded string. It handles `HTTP GET` requests and returns appropriate error messages for invalid or missing parameters. The function is compatible with Netlify and has a maximum execution time of 10 seconds before Netlify closes the connection.

The source code for the function:

```js
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

exports.handler = async (event, context) => {

  console.log({event}, {context});

  const { httpMethod, queryStringParameters } = event;

  if (httpMethod !== "GET")
    return {
      statusCode: 405,
      body: JSON.stringify({
        status: "error",
        message: `${httpMethod} method not allowed. Use GET.`,
      }),
    };

  let { title, subtitle } = queryStringParameters;

  title = decodeURIComponent(title || `Hello World!`);
  subtitle = decodeURIComponent(subtitle || `serverless-gems.com`);

  let template = `
    <!doctype html>
    <html lang="en" style="width:1200px;height:630px">
    <head>
      <meta charset="UTF-8">
      <meta name="robots" content="noindex,nofollow">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <title>${title}</title>
      <style>
        h1{overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3}
        .card{background:#111;background-image:linear-gradient(43deg,#4158d0 0,#c850c0 46%,#ffcc70 100%)}
        .shadow{text-shadow:0 0 10px rgba(0,0,0,.5)}
        .img-shadow{box-shadow:0 0 10px rgba(0,0,0,.5)}
      </style>
    </head>
    <body style="width:1200px;height:630px;padding:0;margin:0;font-family:sans-serif">
      <div class="card" style="width:1200px;height:630px;box-sizing:border-box;color:#fff;padding:70px 70px">
        <img class="img-shadow" style="border-radius:999px;border:4px solid #404040"
             width="120" height="120"
             src="data:image/png;base64,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"
             alt="Serverless Gems">
        <h1 class="shadow" style="font-size:72px;font-weight:700;margin:20px 0 10px 40px">${title}</h1>
        <p class="shadow" style="margin:20px 0 0 40px;font-size:24px;font-weight:700">${subtitle.toUpperCase()}</p>
      </div>
    </body>
    </html>
  `;

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { height: 630, width: 1200 },
      executablePath:
        process.env.CHROME_EXECUTABLE_PATH ||
        (await chromium.executablePath(
          "/var/task/node_modules/@sparticuz/chromium/bin"
        )),
    });

    const page = await browser.newPage();

    await page.setContent(template);

    const buffer = await page.screenshot();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "image/png",
      },
      body: buffer.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: "error",
        message: error.message,
      }),
    };
  }
};
```

Netlify requires setup config like this:

```yaml
[functions]
  node_bundler = "esbuild"
  external_node_modules = ["@sparticuz/chromium"]
```

Check the source code on [GitHub](https://github.com/{{ build.issues.owner }}/{{ build.issues.repo }}/blob/main/netlify/functions/{{ title | slugify }}/index.js).

{% include "./test.njk" %}

## Netlify limits

Netlify serverless function executing time limited by 10 seconds.

If you reach out 10 seconds limit, Netlify will close connection for your request.
