'use strict';

/**
 * @ngdoc service
 * @name financieraClienteApp.config
 * @description
 * # config
 * Constant in the financieraClienteApp.
 */
var conf_cloud = {
    WSO2_SERVICE: "http://jbpm.udistritaloas.edu.co:8280/services",
    ACADEMICA_SERVICE: "http://10.20.0.127/urano/index.php?data=B-7djBQWvIdLAEEycbH1n6e-3dACi5eLUOb63vMYhGq0kPBs7NGLYWFCL0RSTCu1yTlE5hH854MOgmjuVfPWyvdpaJDUOyByX-ksEPFIrrQQ7t1p4BkZcBuGD2cgJXeD",
    ADMINISTRATIVA_MID_SERVICE: "http://10.20.0.254/administrativa_mid_api/v1/",
    ADMINISTRATIVA_SERVICE: "http://10.20.0.254/administrativa_amazon_api/v1/",
    AGORA_SERVICE: "http://10.20.0.254/agora_api/v1/",
    ARGO_SERVICE: "http://10.20.0.254/administrativa_api/v1/",
    ARKA_SERVICE: "http://10.20.0.254/arka_api_crud/v1/",
    CONFIGURACION_SERVICE: "http://10.20.0.254/configuracion_api/v1/",
    CORE_SERVICE: "http://10.20.0.254/core_api/v1/",
    FINANCIERA_MID_SERVICE: "http://10.20.0.254/financiera_mid_api/v1/",
    FINANCIERA_SERVICE: "http://10.20.0.254/financiera_api/v1/",
    MODELS_SERVICE: "scripts/models/",
    NOTIFICACION_WS: "ws://10.20.2.134:8080/ws/join",
    OIKOS_SERVICE: "http://10.20.0.254/oikos_api/v1/",
    PAGOS_SERVICE: "http://jbpm.udistritaloas.edu.co:8280/services/academicaProxyService/ingresos_concepto/",
    TITAN_SERVICE: "http://10.20.0.254/titan_api_crud/v1/",
    TOKEN: {
        AUTORIZATION_URL: "https://autenticacion.udistrital.edu.co/oauth2/authorize",
        URL_USER_INFO: "https://autenticacion.udistrital.edu.co/oauth2/userinfo",
        CLIENTE_ID: "2sbv8HxQIZCMC1CqPTP6yI6VPDca",
        REDIRECT_URL: "http://localhost:9000/",
        RESPONSE_TYPE: "code",
        SCOPE: "openid email",
        BUTTON_CLASS: "btn btn-warning btn-sm",
        SIGN_OUT_URL: "https://autenticacion.udistrital.edu.co/oidc/logout",
        SIGN_OUT_REDIRECT_URL: "http://localhost:9000/",
        SIGN_OUT_APPEND_TOKEN: "true",
        REFRESH_TOKEN: "https://autenticacion.udistrital.edu.co/oauth2/token",
        CLIENT_SECRET: "Y8WA3LDAH79QjiMvCkTfaiZsOtEa"
    },
};
var conf_presentacion = {
    ACADEMICA_SERVICE: "http://10.20.0.127/urano/index.php?data=B-7djBQWvIdLAEEycbH1n6e-3dACi5eLUOb63vMYhGq0kPBs7NGLYWFCL0RSTCu1yTlE5hH854MOgmjuVfPWyvdpaJDUOyByX-ksEPFIrrQQ7t1p4BkZcBuGD2cgJXeD",
    ADMINISTRATIVA_MID_SERVICE: "http://10.20.0.210/administrativa_mid_api/v1/",
    ADMINISTRATIVA_SERVICE: "http://10.20.0.210/administrativa_amazon_api/v1/",
    AGORA_SERVICE: "http://10.20.0.254/agora_api/v1/",
    ARGO_SERVICE: "http://10.20.0.210/administrativa_api/v1/",
    ARKA_SERVICE: "http://10.20.0.254/arka_api_crud/v1/",
    CONFIGURACION_SERVICE: "http://10.20.0.254/configuracion_api/v1/",
    CORE_SERVICE: "http://10.20.0.254/core_api/v1/",
    FINANCIERA_MID_SERVICE: "http://10.20.0.210/financiera_mid_api/v1/",
    FINANCIERA_SERVICE: "http://10.20.0.210/financiera_api/v1/",
    MODELS_SERVICE: "scripts/models/",
    NOTIFICACION_WS: "ws://10.20.2.134:8080/ws/join",
    OIKOS_SERVICE: "http://10.20.0.254/oikos_api/v1/",
    PAGOS_SERVICE: "http://jbpm.udistritaloas.edu.co:8280/services/academicaProxyService/ingresos_concepto/",
    TITAN_SERVICE: "http://10.20.0.254/titan_api_crud/v1/",
    TOKEN: {
        AUTORIZATION_URL: "https://autenticacion.udistrital.edu.co/oauth2/authorize",
        URL_USER_INFO: "https://autenticacion.udistrital.edu.co/oauth2/userinfo",
        CLIENTE_ID: "2sbv8HxQIZCMC1CqPTP6yI6VPDca",
        REDIRECT_URL: "http://localhost:9000/",
        RESPONSE_TYPE: "code",
        SCOPE: "openid email",
        BUTTON_CLASS: "btn btn-warning btn-sm",
        SIGN_OUT_URL: "https://autenticacion.udistrital.edu.co/oidc/logout",
        SIGN_OUT_REDIRECT_URL: "http://localhost:9000/",
        SIGN_OUT_APPEND_TOKEN: "true",
        REFRESH_TOKEN: "https://autenticacion.udistrital.edu.co/oauth2/token",
        CLIENT_SECRET: "Y8WA3LDAH79QjiMvCkTfaiZsOtEa"
    },
};
var conf_pruebas = {
    WSO2_SERVICE: "http://jbpm.udistritaloas.edu.co:8280/services",
    ACADEMICA_SERVICE: "http://10.20.0.127/urano/index.php?data=B-7djBQWvIdLAEEycbH1n6e-3dACi5eLUOb63vMYhGq0kPBs7NGLYWFCL0RSTCu1yTlE5hH854MOgmjuVfPWyvdpaJDUOyByX-ksEPFIrrQQ7t1p4BkZcBuGD2cgJXeD",
    ADMINISTRATIVA_MID_SERVICE: "http://10.20.0.254/administrativa_mid_api/v1/",
    ADMINISTRATIVA_SERVICE: "http://10.20.0.254/administrativa_amazon_api/v1/",
    ADMINISTRATIVA_PRUEBAS_SERVICE: "http://10.20.0.254/administrativa_api/v1/",
    AGORA_SERVICE: "http://10.20.0.254/administrativa_amazon_api/v1/",
    ARGO_SERVICE: "http://10.20.0.254/administrativa_api/v1/",
    ARKA_SERVICE: "http://10.20.0.254/arka_api_crud/v1/",
    CONFIGURACION_SERVICE: "http://10.20.0.254/configuracion_api/v1/",
    CORE_SERVICE: "http://10.20.0.254/core_api/v1/",
    FINANCIERA_MID_SERVICE: "http://10.20.0.254/financiera_mid_api/v1/",
    FINANCIERA_SERVICE: "http://10.20.0.254/financiera_api/v1/",
    MODELS_SERVICE: "scripts/models/",
    NOTIFICACION_WS: "ws://10.20.2.134:8080/ws/join",
    OIKOS_SERVICE: "http://10.20.0.254/oikos_api/v1/",
    PAGOS_SERVICE: "http://jbpm.udistritaloas.edu.co:8280/services/academicaProxyService/ingresos_concepto/",
    TITAN_SERVICE: "http://10.20.0.254/titan_api_crud/v1/",
    SPAGOBI_SERVICE: "https://intelligentia.udistrital.edu.co:8443/SpagoBI/restful-services/1.0/",
    TOKEN: {
        AUTORIZATION_URL: "https://autenticacion.udistrital.edu.co/oauth2/authorize",
        URL_USER_INFO: "https://autenticacion.udistrital.edu.co/oauth2/userinfo",
        CLIENTE_ID: "m3m5r9DACVJd58tAcbD1jIyktZQa",
        REDIRECT_URL: "http://kronos.portaloas.udistrital.edu.co/",
        RESPONSE_TYPE: "code",
        SCOPE: "openid email",
        BUTTON_CLASS: "btn btn-warning btn-sm",
        SIGN_OUT_URL: "https://autenticacion.udistrital.edu.co/oidc/logout",
        SIGN_OUT_REDIRECT_URL: "http://kronos.portaloas.udistrital.edu.co/",
        SIGN_OUT_APPEND_TOKEN: "true",
        REFRESH_TOKEN: "https://autenticacion.udistrital.edu.co/oauth2/token",
        CLIENT_SECRET: "kL8YZVnayCztbsWQQRkQ_x9FT9Ea"
    },
};
var conf_local = {
    WSO2_SERVICE: "http://jbpm.udistritaloas.edu.co:8280/services",
    ACADEMICA_SERVICE: "http://10.20.0.127/urano/index.php?data=B-7djBQWvIdLAEEycbH1n6e-3dACi5eLUOb63vMYhGq0kPBs7NGLYWFCL0RSTCu1yTlE5hH854MOgmjuVfPWyvdpaJDUOyByX-ksEPFIrrQQ7t1p4BkZcBuGD2cgJXeD",
    ADMINISTRATIVA_MID_SERVICE: "http://10.20.0.254/administrativa_mid_api/v1/",
    ADMINISTRATIVA_SERVICE: "http://10.20.0.254/administrativa_amazon_api/v1/",
    ADMINISTRATIVA_PRUEBAS_SERVICE: "http://10.20.0.254/administrativa_api/v1/",
    AGORA_SERVICE: "http://10.20.0.254/administrativa_amazon_api/v1/",
    ARGO_SERVICE: "http://10.20.0.254/administrativa_api/v1/",
    ARKA_SERVICE: "http://10.20.0.254/arka_api_crud/v1/",
    CONFIGURACION_SERVICE: "http://10.20.0.254/configuracion_api/v1/",
    CORE_SERVICE: "http://10.20.0.254/core_api/v1/",
    FINANCIERA_MID_SERVICE: "http://127.0.0.1:8087/v1/",
    FINANCIERA_SERVICE: "http://127.0.0.1:8084/v1/",
    MODELS_SERVICE: "scripts/models/",
    NOTIFICACION_WS: "ws://10.20.2.134:8080/ws/join",
    OIKOS_SERVICE: "http://10.20.0.254/oikos_api/v1/",
    PAGOS_SERVICE: "http://jbpm.udistritaloas.edu.co:8280/services/academicaProxyService/ingresos_concepto/",
    TITAN_SERVICE: "http://10.20.0.254/titan_api_crud/v1/",
    TOKEN: {
        AUTORIZATION_URL: "https://autenticacion.udistrital.edu.co/oauth2/authorize",
        URL_USER_INFO: "https://autenticacion.udistrital.edu.co/oauth2/userinfo",
        CLIENTE_ID: "2sbv8HxQIZCMC1CqPTP6yI6VPDca",
        REDIRECT_URL: "http://localhost:9000/",
        RESPONSE_TYPE: "code",
        SCOPE: "openid email",
        BUTTON_CLASS: "btn btn-warning btn-sm",
        SIGN_OUT_URL: "https://autenticacion.udistrital.edu.co/oidc/logout",
        SIGN_OUT_REDIRECT_URL: "http://localhost:9000/",
        SIGN_OUT_APPEND_TOKEN: "true",
        REFRESH_TOKEN: "https://autenticacion.udistrital.edu.co/oauth2/token",
        CLIENT_SECRET: "Y8WA3LDAH79QjiMvCkTfaiZsOtEa"
    },
};



angular.module('financieraClienteApp')
    .constant('CONF', {
        GENERAL: conf_pruebas
    });
