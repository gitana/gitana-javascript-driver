/**
 * This gets added into the Gitana Driver to ensure compilation time compatibility with
 * the Appcelerator Titanium framework.
 */
/* jQuery Sizzle - these are to fool the Ti compiler into not reporting errors! */

/**
 * The driver assumes a globally-scoped "window" variable which is a legacy of browser-compatibility.
 * Frameworks such as Titanium do not have a window root-scoped variable, so we fake one.
 *
 * At minimum, the window variable must have a setTimeout variable.
 */
if (typeof window === "undefined")
{
    window = {
        "setTimeout": function(func, seconds)
        {
            setTimeout(func, seconds);
        }
    };
}
