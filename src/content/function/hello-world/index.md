---
title: Hello World
description: It`s a simple function that returns a string.
tags: [example]
---

The Hello World function is a simple function that returns the string "Hello [name]!", where [name] is either the value provided in the name query parameter for a `GET` request or the value provided in the name field of the request body for a `POST` request.

The function uses the event and context parameters and logs them to the console. It handles both `GET` and `POST` requests and returns a JSON response with a message field containing the personalized greeting.

The source code for the function:

```ts
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
```

Check the source code on [GitHub](https://github.com/{{ build.issues.owner }}/{{ build.issues.repo }}/blob/main/functions/api/{{ title | slugify }}/index.ts).

{% include "./test.njk" %}

