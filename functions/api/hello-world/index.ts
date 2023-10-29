/**
 * @link https://cloudflare.serverless-gems.dev/function/hello-world/
 */

// GET requests to /filename?name=<name> would return "Hello, <name>!"
export const onRequestGet = async ({request}) => {
  const urlParams = new URL(request.url || "").searchParams;
  const name = urlParams.get("name") || "World";

  return new Response(JSON.stringify({
    message: `Hello, ${name}!`
  }));
};

// POST requests to /filename with a JSON-encoded body would return "Hello, <name>!"
export const onRequestPost = async ({request}) => {
  const {name} = await request.json();

  return new Response(JSON.stringify({
    message: `Hello, ${name}!`
  }));
};
