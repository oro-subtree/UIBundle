<a name="module_ApiAccessor"></a>
## ApiAccessor
Abstraction of api access point. This class is designed to create from server configuration.

### Sample usage of api_accessor with full options provided.
Example configuration is provided on server:
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

Then following code on client:
``` javascript
var apiAP = new ApiAccessror(serverConfiguration);
apiAP.send({id: 321}, {name: 'new name'}).then(function(result) {
    console.log(result)
})
```
Will raise POST request to `/api/opportunity/23/tasks/321?action=patch` with body == `{name: 'new name'}`
and will put response to console after it will be finished

**Augment**: StdClass  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | Options container. |
| options.route | <code>string</code> | Required. Route name |
| options.http_method | <code>string</code> | Http method to access this route (e.g. GET/POST/PUT/PATCH...)                          By default `'GET'`. |
| options.form_name | <code>string</code> | Optional. Wraps request body into form_name, so request will look like                          `{<form_name>:<request_body>}` |
| options.headers | <code>object</code> | Optional. Allows to provide additional http headers |
| options.default_route_parameters | <code>object</code> | Optional. Provides default parameters values for route                          creation, this defaults will be merged with row model data to get url |
| options.query_parameter_names | <code>Array.&lt;string&gt;</code> | Optional. Array of parameter names to put into query                          string(e.g. `?<parameter-name>=<value>&<parameter-name>=<value>`).                          (The reason of adding this argument is that FOSRestBundle doesn’t provides acceptable                          query parameters for client usage, so it is required to specify list of them) |


* [ApiAccessor](#module_ApiAccessor)
  * [.initialize(Options)](#module_ApiAccessor#initialize)
  * [.send(urlParameters, body, headers)](#module_ApiAccessor#send) ⇒ <code>$.Promise</code>
  * [.getHeaders(headers)](#module_ApiAccessor#getHeaders) ⇒ <code>object</code>
  * [.prepareUrlParameters(urlParameters)](#module_ApiAccessor#prepareUrlParameters) ⇒ <code>object</code>
  * [.getUrl(urlParameters)](#module_ApiAccessor#getUrl) ⇒ <code>string</code>
  * [.formatBody(body)](#module_ApiAccessor#formatBody) ⇒ <code>object</code>
  * [.formatResult(response)](#module_ApiAccessor#formatResult) ⇒ <code>object</code>

<a name="module_ApiAccessor#initialize"></a>
### apiAccessor.initialize(Options)
**Kind**: instance method of <code>[ApiAccessor](#module_ApiAccessor)</code>  

| Param | Type | Description |
| --- | --- | --- |
| Options | <code>object</code> | passed to constructor |

<a name="module_ApiAccessor#send"></a>
### apiAccessor.send(urlParameters, body, headers) ⇒ <code>$.Promise</code>
Sends request to server and returns $.Promise with abort() support

**Kind**: instance method of <code>[ApiAccessor](#module_ApiAccessor)</code>  
**Returns**: <code>$.Promise</code> - - Promise with abort() support  

| Param | Type | Description |
| --- | --- | --- |
| urlParameters | <code>object</code> | Url parameters to combine url |
| body | <code>object</code> | Request body |
| headers | <code>object</code> | Headers to send with request |

<a name="module_ApiAccessor#getHeaders"></a>
### apiAccessor.getHeaders(headers) ⇒ <code>object</code>
Prepares headers for request.

**Kind**: instance method of <code>[ApiAccessor](#module_ApiAccessor)</code>  

| Param | Type | Description |
| --- | --- | --- |
| headers | <code>object</code> | Headers to merge into default list |

<a name="module_ApiAccessor#prepareUrlParameters"></a>
### apiAccessor.prepareUrlParameters(urlParameters) ⇒ <code>object</code>
Prepares url parameters before build url

**Kind**: instance method of <code>[ApiAccessor](#module_ApiAccessor)</code>  

| Param |
| --- |
| urlParameters | 

<a name="module_ApiAccessor#getUrl"></a>
### apiAccessor.getUrl(urlParameters) ⇒ <code>string</code>
Prepares url for request.

**Kind**: instance method of <code>[ApiAccessor](#module_ApiAccessor)</code>  

| Param | Type | Description |
| --- | --- | --- |
| urlParameters | <code>object</code> | Map of url parameters to use |

<a name="module_ApiAccessor#formatBody"></a>
### apiAccessor.formatBody(body) ⇒ <code>object</code>
Prepares request body.

**Kind**: instance method of <code>[ApiAccessor](#module_ApiAccessor)</code>  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>object</code> | Map of url parameters to use |

<a name="module_ApiAccessor#formatResult"></a>
### apiAccessor.formatResult(response) ⇒ <code>object</code>
Formats response before it will be sent out from this api accessor.

**Kind**: instance method of <code>[ApiAccessor](#module_ApiAccessor)</code>  

| Param | Type |
| --- | --- |
| response | <code>object</code> | 

