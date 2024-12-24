# Codename `poe-revelation`

This is a collaborative effort by [GGPK-Exposed](https://github.com/ggpk-exposed) and Path of Exile Wiki developers to improve the tooling around the wiki and prepare tooling for Path of Exile 2. This tool is meant to provide a better way to see the known data in the game files, provide a UI for non-developers to be able to see the data and export it in a more user-friendly way for the consumption by the wiki.

## WARNING - This is a work in progress

The code in this project is very early in development and is not yet ready for use. It is not yet feature complete and may not work as expected.

## Developing

Once you've installed dependencies with `pnpm install`, start a development server:

```bash
pnpm dev

# or start the server and open the app in a new browser tab
pnpm dev -- --open
```

## Building

To create a production version of your app:

```bash
pnpm build
```

You can preview the production build with `pnpm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.