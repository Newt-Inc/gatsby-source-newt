# gatsby-source-newt

## Install

Install the package with:

```sh
npm install gatsby-source-newt

# or

yarn add gatsby-source-newt
```

## Basic Usage

### gatsby-config.js

You need to declare the plugin use and its options in `gatsby-config.js`

```js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-newt',
      options: {
        spaceUid: 'YOUR_SPACE_UID',
        appUid: 'YOUR_APP_UID',
        modelUid: 'YOUR_MODEL_UID',
        token: 'YOUR_CDN_API_TOKEN',
        apiType: 'cdn',  // You can specify "cdn" or "api".
      },
    },
  ],
};
```

#### Options

| Name | Default | Description |
| :--- | :--- | :--- |
| `spaceUid` | | **Required.** Your space uid. |
| `appUid` | | **Required.** Your app uid. |
| `modelUid` | | **Required.** Your model uid. |
| `token` | | **Required.** Your Newt CDN API token or Newt API token. |
| `apiType` | `cdn` | You can specify `cdn` or `api`. Please specify `cdn` to send a request to the Newt CDN API, or `api` to send a request to the Newt API. |

### gatsby-node.js

```js
const path = require('path')

exports.createPages = async ({graphql, actions}) => {
  const {createPage} = actions

  const result = await graphql(`
    {
      allNewtArticle {
        edges {
          node {
            _id
            slug
          }
        }
      }
    }
  `)

  if (result.errors) {
    throw result.errors
  }

  result.data.allNewtArticle.edges.forEach((edge) => {
    createPage({
      path: edge.node.slug,
      component: path.resolve('./src/templates/article.js'),
      context: {
        _id_: edge.node._id
      },
    })
  })
}
```

## License

This repository is published under the [MIT License](https://github.com/Newt-Inc/gatsby-source-newt/blob/main/LICENSE).
