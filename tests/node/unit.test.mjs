/**
 * The tests that need no server, run headless under node:test.
 *
 * Everything else in tests/js authenticates against a live Cloud CMS instance and
 * runs from tests/node/integration.
 */

for (const name of [
    "testChaining1",
    "testChaining2",
    "testChaining3",
    "testChaining4"
])
{
    await import("../js/" + name + ".mjs");
}
