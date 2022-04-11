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
        token: 'YOUR_API_TOKEN',
        appUid: 'YOUR_APP_UID',
        models: [{
          uid: 'YOUR_MODEL_UID_1',
        }],
      },
    },
  ],
};

// If you want to source from multiple spaces or multiple apps, add another configuration.
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-newt',
      options: {
        spaceUid: 'YOUR_SPACE_UID_1',
        token: 'YOUR_CDN_API_TOKEN_1',
        appUid: 'YOUR_APP_UID_1',
        models: [{
          uid: 'YOUR_MODEL_UID_1',
        }],
      },
    },
    {
      resolve: 'gatsby-source-newt',
      options: {
        spaceUid: 'YOUR_SPACE_UID_2',
        token: 'YOUR_CDN_API_TOKEN_2',
        appUid: 'YOUR_APP_UID_2',
        models: [{
          uid: 'YOUR_MODEL_UID_2',
        }],
      },
    },
  ],
};
```

#### Options

```js
{
  /**
   * `spaceUid` is your space uid.
   *
   * Required
   * Type: String
   **/
  spaceUid: 'YOUR_SPACE_UID',

  /**
   * `token` is an authentication token used for the API.
   * If you use the CDN API, enter the CDN API token; if you use the Newt API, enter the Newt API token.
   *
   * Required
   * Type: String
   **/
  token: 'YOUR_API_TOKEN',

  /**
   * `appUid` is your app uid.
   *
   * Required
   * Type: String
   **/
  appUid: 'blog',

  /**
   * `models` is an array of information about the models you want to source.
   *
   * Required.
   * Type: Array
   **/
  models: [{
    /**
     * `uid` is your model uid.
     *
     * Required
     * Type: String
     **/
    uid: 'article',

    /**
     * `type` is used to name the type in GraphQL.
     * If you specify 'post' as a type, then the type of GraphQL will be 'newtPost' and 'allNewtPost'.
     *
     * Optional
     * Type: String
     * Default: uid value
     **/
    type: 'post',

    /**
     * `query` specifies the condition of the content to be fetched.
     * See below for details on available queries.
     * https://github.com/Newt-Inc/newt-client-js#query-fields
     *
     * Optional
     * Type: Object
     **/
    query: {
      or: [
        { title: { match: 'update' } },
        { title: { match: 'アップデート' } }
      ],
      body: { fmt: 'text' },
    },
  }],

  /**
   * `apiType` specifies the API to be used.
   * If you use the CDN API, enter `cdn`; if you use the Newt API, enter `api`.
   *
   * Optional
   * Type: String
   * Default: `cdn`
   **/
  apiType: 'cdn',
}
```

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
