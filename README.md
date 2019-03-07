## Build Project

`yarn build`

This will automatically rebuild dependencies when source changes.

## Implementation notes

The sample code provided used the es6 class syntax, so this project does same, using webpack to bundle output for the browser.

There's a main.js entrypoint which runs the test commands and can be verified in the browser.

The surface area of the API was left as provided. However, a good practice would be to type the interface to avoid programmer error & allow for better autocomplete within IDE.

FastPriorityQueue is used to store the ranges within RangeCollection as a convenience for print(). It is not expected to improve the worst-case runtime, and indeed FastPriorityQueue.forEach `clone`'s the queue, which is O(N).
