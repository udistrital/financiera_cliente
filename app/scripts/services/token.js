'use strict';

/**
 * @ngdoc service
 * @name prototipoApp.token
 * @description
 * # token
 * Factory in the prototipoApp.
 */


// First, parse the query string
var params = {},
    queryString = location.hash.substring(1),
    regex = /([^&=]+)=([^&]*)/g,
    m;
while (!!(m = regex.exec(queryString))) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
}
// And send the token over to the server
var req = new XMLHttpRequest();
// consider using POST so query isn't logged
var query = 'https://' + window.location.host + '?' + queryString;
//console.log(query);
req.open('GET', query, true);

req.onreadystatechange = function(e) {
    console.log(e);
    if (req.readyState === 4) {
        if (req.status === 200) {
            window.location = params.state;
        } else if (req.status === 400) {
            window.alert('There was an error processing the token.');
        } else {
            //alert('something else other than 200 was returned');
            //console.log(req);
        }
    }
};

angular.module('financieraClienteApp')
    .factory('token_service', function($location, $http, $sessionStorage, CONF, $interval) {
        var service = {
            session: $sessionStorage.$default(params),
            header: null,
            token: null,

            config: {
                AUTORIZATION_URL: CONF.GENERAL.TOKEN.AUTORIZATION_URL,
                CLIENTE_ID: CONF.GENERAL.TOKEN.CLIENTE_ID,
                REDIRECT_URL: CONF.GENERAL.TOKEN.REDIRECT_URL,
                RESPONSE_TYPE: CONF.GENERAL.TOKEN.RESPONSE_TYPE,
                SCOPE: CONF.GENERAL.TOKEN.SCOPE,
                BUTTON_CLASS: CONF.GENERAL.TOKEN.BUTTON_CLASS,
                SIGN_OUT_URL: CONF.GENERAL.TOKEN.SIGN_OUT_URL,
                SIGN_OUT_REDIRECT_URL: CONF.GENERAL.TOKEN.SIGN_OUT_REDIRECT_URL,
                SIGN_OUT_APPEND_TOKEN: CONF.GENERAL.TOKEN.SIGN_OUT_APPEND_TOKEN
            },

            live_token: function() {
                if (typeof service.session.id_token === 'undefined' || service.session.id_token === null) {
                    return false;
                } else {
                    service.header = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(service.session.id_token.split(".")[0]));
                    service.token = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(service.session.id_token.split(".")[1]));
                    return true;
                }
            },
            logout: function() {
                window.location = $location.absUrl();
                var url = service.config.SIGN_OUT_URL;
                url = url + '?logout_redirect_uri=' + CONF.GENERAL.TOKEN.SIGN_OUT_REDIRECT_URL;
                url = url + '?id_token_hint=' + service.session.id_token;
                console.log(url);
                service.token = null;
                $sessionStorage.$reset();
                window.location.replace(url);
            },
            refresh: function() {
                var url = CONF.GENERAL.TOKEN.REFRESH_TOKEN;
                url = url + '?grant_type=refresh_token';
                url = url + '&refresh_token=' + $sessionStorage.access_token;
                $http.get(url, {
                        headers: {
                            'Authorization': 'Basic bfPMflsiPVN6WFjJZIpzjsLdlx8a:1kM_E4MZNaMLtPY3l9CvS3pOSioa'
                        }
                    })
                    .then(function(response) {
                        console.log(response.data);
                    });
            },
            valid_token: function() {
                var url = CONF.GENERAL.TOKEN.URL_USER_INFO;
                $http.get(url, {
                        headers: {
                            'Authorization': "Bearer " + $sessionStorage.access_token
                        }
                    })
                    .then(function(response) {
                        console.log(response.data);
                    });
            },
            setExpiresAt: function() {
                if (!(typeof service.session.id_token === 'undefined' || service.session.id_token === null)) {
                    var expires_at = new Date();
                    expires_at.setSeconds(expires_at.getSeconds() + parseInt($sessionStorage.expires_in) - 60); // 60 seconds less to secure browser and response latency
                    $sessionStorage.expires_at = expires_at;
                }
            },
            expired: function() {
                return ($sessionStorage.expires_at < new Date());
            },

            timer: function() {
                if (!(typeof service.session.id_token === 'undefined' || service.session.id_token === null)) {
                    $interval(function() {
                        if (service.expired()) {
                            service.logout();
                        }
                    }, 5000);
                    console.log($sessionStorage.expires_in);
                }
            }

        };
        service.setExpiresAt();
        service.timer();
        return service;
    });