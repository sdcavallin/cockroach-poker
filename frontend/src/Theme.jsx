import { extendTheme, theme as base } from "@chakra-ui/react";

const fonts = {
    myHeading: `'Anthrope', ${base.fonts?.heading}, sans-serif`,
    myBody: `'Anthrope', ${base.fonts?.body}, sans-serif`,
};

const theme = extendTheme({ fonts });

export default theme;