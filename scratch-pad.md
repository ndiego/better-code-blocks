# WordPress Playground Blueprint for Better Code Blocks
steps:
  - step: Install WordPress
    version: 6.7
    locale: en_US
    
  - step: Activate plugin from source
    pluginZipFile: 
      url: https://github.com/ndiego/better-code-blocks/archive/main.zip
      
  - step: Create post
    post:
      type: post
      title: Better Code Blocks Demo
      content: |
        <!-- wp:heading -->
        <h2>PHP Example</h2>
        <!-- /wp:heading -->

        <!-- wp:code {"language":"php","title":"Example PHP Function","hasLineNumbers":true} -->
        <pre class="wp-block-code"><code>function hello_world() {
            echo "Hello, World!";
            return true;
        }</code></pre>
        <!-- /wp:code -->

        <!-- wp:heading -->
        <h2>JavaScript Example</h2>
        <!-- /wp:heading -->

        <!-- wp:code {"language":"javascript","title":"Example JS Function","hasCopy":true} -->
        <pre class="wp-block-code"><code>function sayHello() {
            console.log("Hello from JavaScript!");
            return true;
        }</code></pre>
        <!-- /wp:code -->

  - step: Navigate
    path: /better-code-blocks-demo 