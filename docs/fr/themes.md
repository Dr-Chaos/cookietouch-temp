# Cookie Themes
--

## Foreword

This is the guide to understand the new Cookie Theme system. This system is based on Material-UI.

Cookie Themes will you give the possibility to:

 - Change the main color
 - Change the secondary color
 - Change font size

## Installation of a theme

For now the theme installation is very easy simply download your theme file of copy your theme json at:

```
./resources/themes/theme.json

```

## Theme Example:

To help you create atheme here is the template of the **Wood Cookie Theme**

To easily create a theme you can use: [Material UI Theme Editor](https://in-your-saas.github.io/material-ui-theme-editor/)

```json
{
    "palette": {
        "common": {
            "black": "#000",
            "white": "#fff"
        },
        "background": {
            "paper": "rgba(230, 200, 152, 1)",
            "default": "rgba(255, 240, 218, 1)"
        },
        "primary": {
            "light": "rgba(190, 116, 53, 1)",
            "main": "rgba(139, 87, 42, 1)",
            "dark": "rgba(100, 63, 31, 1)",
            "contrastText": "#fff"
        },
        "secondary": {
            "light": "rgba(35, 101, 177, 1)",
            "main": "rgba(24, 89, 167, 1)",
            "dark": "rgba(11, 55, 107, 1)",
            "contrastText": "#fff"
        },
        "error": {
            "light": "#e57373",
            "main": "#f44336",
            "dark": "#d32f2f",
            "contrastText": "#fff"
        },
        "text": {
            "primary": "rgba(0, 0, 0, 0.87)",
            "secondary": "rgba(0, 0, 0, 0.54)",
            "disabled": "rgba(0, 0, 0, 0.38)",
            "hint": "rgba(0, 0, 0, 0.38)"
        }
    }
}
```

## Road map

Here are the future plans for the themeing engine:

 - A simple theme manager ui being able to select the current theme from the cookie interface
 - A custom theme format letting people identify, update, name themes
 - A theme sharing system
 - A theme ranking system

## More Information


**Author:** **『　　』**

**Last Edit:** 22 Feb 2019
 
