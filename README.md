# My Camera Web Component

Simple component based on JS custom elements, which allow you to get access to your current device camera. 
There's also ability to record stream and download.

[Demonstration](https://htmlpreview.github.io/?https://github.com/wanoo21/MyCamera/blob/master/dist/index.html).

Basic implementation:

`<my-camera controls autoplay audio record></my-camera>`

The **controls** and **autoplay** works like in video HTMLElement.

Include **audio** attribute if you want to record audio as well.

And finally, **record** attribute will inlcude a simple button on top of Video, **on click** it starts recording, **on stop** recorded video will be downloaded!
