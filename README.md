# My Camera

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/my-camera)

Simple component based on JS custom elements, which allow you to get access to your current device camera.

There's also ability to record stream and download.

## Installation

```bash
npm install my-camera
```

And include somewhere in your app:

```js
@import 'my-camera'
```

Or include stright in your index.html

```html
<script rel="import" src="node_modules/dist/my-camera.js"></script>
```

## Usage

<!--
```
<custom-element-demo>
  <template>
    <script type="text/javascript" src="https://mycam.netlify.com/my-camera.js"></script>
    <my-camera controls autoplay audio record></my-camera>
  </template>
</custom-element-demo>
```
-->

```html
<my-camera controls autoplay audio record></my-camera>
```

The **controls** and **autoplay** works like in video HTMLElement. Include **audio** attribute if you want to record audio as well.

And finally, **record** attribute will inlcude a simple button on top of Video, **on click** it starts recording, **on stop** recorded video will be downloaded!

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

First release

## License

Shared on MIT license, check [LICENSE.](https://github.com/myfrom/paper-pager/blob/master/LICENSE)
