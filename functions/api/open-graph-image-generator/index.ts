/**
 * Open Graph Image Generator
 * @link https://claudflare.serverless-gems.dev/function/open-graph-image-generator/
 */
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");


export const onRequestGet = async ({request}) => {

  console.log({request});

  const urlParams = new URL(request.url || "").searchParams;

  const url = urlParams.get("url");

  if (!url)
    return new Response(JSON.stringify({
      message: `Missing required parameter: url`
    }), {
      status: 400
    });

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

    await page.goto(decodeURIComponent(url), { waitUntil: "networkidle2" });

    const buffer = await page.screenshot();

    return new Response(buffer, {
      headers: {
        "Content-Type": "image/png",
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      status: "error",
      message: error.message,
    }), {
      status: 500
    });
  }
};
