Links.StevenZilberberg.com
==========================

This is my own implementation of a link shortener (i.e. - bitly)

## Usage

### Create a New Link

`POST` https://HOSTNAME

With a json body of:
```
{
    "ShortUrl": "{Name of ShortUrl}",
    "OriginalUrl": "{Full Url of where to be redirected}"
}
```

This will create a new link with a given short url which when called upon, will redirect to the OriginalUrl

#### Expected Errors and Returns

- 201: New link successfully created
- 405: Reserved 'link' path is not allowed
- 409: Link already exists

### Go to an existing link

`GET` https://HOSTNAME/shortUrl

This will go to an existing shorturl and redirect to the OriginalUrl

#### Expected Errors and Returns

- 302: Redirect to new path in saved database
- 404: Short link does not exist
- 500: Unexpected error occured when retrieving link

### Stats and Lists

`GET` https://HOSTNAME/links/list

Get a list of links and a short list of the shortLinks

#### Expected Errors and Returns

- 200: Successfully retrieved list of links
