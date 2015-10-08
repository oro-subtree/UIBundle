<a name="module_ApiAccessor"></a>
## ApiAccessor
Abstraction of api access point. This class is by design to be initiated from the server configuration.

#### Sample usage of api_accessor with a full set of options provided.
Example of configuration provided on the server:
``` yml
save_api_accessor:
    route: orocrm_opportunity_task_update # for example this route uses following mask
                        # to generate url /api/opportunity/{opportunity_id}/tasks/{id}
    http_method: POST
    headers:
        Api-Secret: ANS2DFN33KASD4F6OEV7M8
    default_route_parameters:
        opportunity_id: 23
    action: patch
    query_parameter_names: [action]
```

Then following code on the client:
``` javascript
var apiAP = new ApiAccessror(serverConfiguration);
apiAP.send({id: 321}, {name: 'new name'}).then(function(result) {
    console.log(result)
})
```
will raise POST request to `/api/opportunity/23/tasks/321?action=patch` with body == `{name: 'new name'}`
and will put response to console after completion

**Augment**: BaseClass  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Options container |
| options.route | <code>string</code> | Required. Route name |
| options.http_method | <code>string</code> | Http method to access this route (e.g. GET/POST/PUT/PATCH...)                          By default `'GET'`. |
| options.form_name | <code>string</code> | Optional. Wraps the request body into a form_name, so request will look like                          `{<form_name>:<request_body>}` |
| options.headers | <code>Object</code> | Optional. Allows to provide additional http headers |
| options.default_route_parameters | <code>Object</code> | Optional. Provides values of default parameter for route                          creation, this defaults will be merged with the row model data to get url |
| options.query_parameter_names | <code>Array.&lt;string&gt;</code> | Optional. Array of parameter names to put into query                          string (e.g. `?<parameter-name>=<value>&<parameter-name>=<value>`).                          (The reason of adding this argument is that FOSRestBundle doesn’t provide acceptable                          query parameters for client usage, so it is required to specify a list of them) |


* [ApiAccessor](#module_ApiAccessor)
  * [.initialize(Options)](#module_ApiAccessor#initialize)
  * [.send(urlParameters, body, headers)](#module_ApiAccessor#send) ⇒ <code>$.Promise</code>
  * [.getHeaders(headers)](#module_ApiAccessor#getHeaders) ⇒ <code>Object</code>
  * [.prepareUrlParameters(urlParameters)](#module_ApiAccessor#prepareUrlParameters) ⇒ <code>Object</code>
  * [.getUrl(urlParameters)](#module_ApiAccessor#getUrl) ⇒ <code>string</code>
  * [.formatBody(body)](#module_ApiAccessor#formatBody) ⇒ <code>Object</code>
  * [.formatResult(response)](#module_ApiAccessor#formatResult) ⇒ <code>Object</code>

<a name="module_ApiAccessor#initialize"></a>
### apiAccessor.initialize(Options)
**Kind**: an instance method of the <code>[ApiAccessor](#module_ApiAccessor)</code>  

| Param | Type | Description |
| --- | --- | --- |
| Options | <code>Object</code> | passed to the constructor |

<a name="module_ApiAccessor#send"></a>
### apiAccessor.send(urlParameters, body, headers) ⇒ <code>$.Promise</code>
Sends request to the server and returns $.Promise with abort() support

**Kind**: an instance method of the <code>[ApiAccessor](#module_ApiAccessor)</code>  
**Returns**: <code>$.Promise</code> - - Promise with abort() support  

| Param | Type | Description |
| --- | --- | --- |
| urlParameters | <code>Object</code> | Url parameters to compose the url |
| body | <code>Object</code> | Request body |
| headers | <code>Object</code> | Headers to send with the request |

<a name="module_ApiAccessor#getHeaders"></a>
### apiAccessor.getHeaders(headers) ⇒ <code>Object</code>
Prepares headers for the request.

**Kind**: an instance method of the <code>[ApiAccessor](#module_ApiAccessor)</code>  

| Param | Type | Description |
| --- | --- | --- |
| headers | <code>Object</code> | Headers to merge into the default list |

<a name="module_ApiAccessor#prepareUrlParameters"></a>
### apiAccessor.prepareUrlParameters(urlParameters) ⇒ <code>Object</code>
Prepares url parameters before the url build

**Kind**: an instance method of the <code>[ApiAccessor](#module_ApiAccessor)</code>  

| Param |
| --- |
| urlParameters | 

<a name="module_ApiAccessor#getUrl"></a>
### apiAccessor.getUrl(urlParameters) ⇒ <code>string</code>
Prepares url for the request.

**Kind**: an instance method of the <code>[ApiAccessor](#module_ApiAccessor)</code>  

| Param | Type | Description |
| --- | --- | --- |
| urlParameters | <code>Object</code> | Map of the url parameters to use |

<a name="module_ApiAccessor#formatBody"></a>
### apiAccessor.formatBody(body) ⇒ <code>Object</code>
Prepares the request body.

**Kind**: an instance method of the <code>[ApiAccessor](#module_ApiAccessor)</code>  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> | Map of the url parameters to use |

<a name="module_ApiAccessor#formatResult"></a>
### apiAccessor.formatResult(response) ⇒ <code>Object</code>
Formats response before it is sent from this API accessor.

**Kind**: an instance method of the <code>[ApiAccessor](#module_ApiAccessor)</code>  

| Param | Type |
| --- | --- |
| response | <code>Object</code> | 

