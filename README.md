# vitest-nyancat-reporter

This was forked from [philihp/jest-nyan-reporter](https://github.com/philihp/jest-nyancat-reporter).

![Jest Nyan Reporter Image](https://i.imgur.com/oPawvXV.png)

## Installation

You can install by typing the following command in terminal.

For **Yarn**

```
yarn add -D vitest-nyancat-reporter
```

For **NPM**

```
npm install --save-dev vitest-nyancat-reporter
```

### Configure

In order to configure the Nyancat Reporter, you can add the following configuration in your `vite.config.js`.

```json
{
  "test": {
    "reporters": ["vitest-nyancat-reporter"],
  }
},
```