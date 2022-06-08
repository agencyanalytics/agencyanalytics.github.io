# AA Email Signature Generator

> Generate team member signatures using MJML & mustache

## References

-   [MJML](https://mjml.io)
-   [Mustache](https://github.com/janl/mustache.js/)

## Development

-   Install lerna globally `npm install --g lerna`
-   Install yarn globally `npm install --g yarn`
-   Install dependencies (**must be Yarn due to custom MJML yarn package**) `yarn`
-   Launch live-reload dev server > `yarn dev`
-   Or Manually compile > `yarn build`

## Overview

-   `signature.mustache.mjml` is the main signature template that uses a modified fork of MJML & Mustache templating
-   This gets compiled into `dist/compiled.html` upon building
-   `dist/index.html` is the generator form which pulls in that compiled html and is rendered with Mustache


## Flag art

Country flags used in Sales phone numbers were sourced from https://www.flaticon.com/. The Canada flag had a customized leaf applied.
