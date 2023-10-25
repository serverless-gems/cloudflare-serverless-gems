---
title: Hello World
description: It`s a simple function that returns a string.
tags: [example]
---

```ts
// GET requests to /filename?name=<name> would return "Hello, <name>!"
export const onRequestGet = async ({request}) => {
  const urlParams = new URL(request.url || "").searchParams;
  const name = urlParams.get("name") || "World";

  return new Response(`Hello, ${name}!`);
};

// POST requests to /filename with a JSON-encoded body would return "Hello, <name>!"
export const onRequestPost = async ({request}) => {
  const {name} = await request.json();

  return new Response(`Hello, ${name}!`);
};
```

Check the source code on [GitHub](https://github.com/{{ build.issues.owner }}/{{ build.issues.repo }}/blob/main/functions/api/{{ title | slugify }}/index.ts).


## Test how it works

{% include "./test.njk" %}

