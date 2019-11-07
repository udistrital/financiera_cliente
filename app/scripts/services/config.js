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
    ORGANIZACION_SERVICE: "http://10.20.0.254/organizacion_crud/v1/",
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
        CLIENTE_ID: "1aTCvNz4kxA7_p8Z8E1NPtCxtx8a",
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
    UBICACIONES_SERVICE: "http://pruebasapi.intranetoas.udistrital.edu.co:8085/v1/",
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
    FINANCIERA_MID_SERVICE: "http://10.20.0.254/financiera_mid_api/v1/",
    FINANCIERA_SERVICE: "http://10.20.0.254/financiera_api/v1/",
    MODELS_SERVICE: "scripts/models/",
    NOTIFICACION_WS: "ws://10.20.2.134:8080/ws/join",
    OIKOS_SERVICE: "http://10.20.0.254/oikos_api/v1/",
    ORGANIZACION_SERVICE: "http://10.20.0.254/organizacion_crud/v1/",
    PAGOS_SERVICE: "http://jbpm.udistritaloas.edu.co:8280/services/academicaProxyService/ingresos_concepto/",
    TITAN_SERVICE: "http://10.20.0.254/titan_api_crud/v1/",
    TOKEN: {
        AUTORIZATION_URL: "https://autenticacion.udistrital.edu.co/oauth2/authorize",
        URL_USER_INFO: "https://autenticacion.udistrital.edu.co/oauth2/userinfo",
        CLIENTE_ID: "1aTCvNz4kxA7_p8Z8E1NPtCxtx8a",
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
    UBICACIONES_SERVICE: "http://pruebasapi.intranetoas.udistrital.edu.co:8085/v1/",
};
var conf_pruebas = {
    WSO2_SERVICE: "http://jbpm.udistritaloas.edu.co:8280/services",
    ACADEMICA_SERVICE: "http://10.20.0.127/urano/index.php?data=B-7djBQWvIdLAEEycbH1n6e-3dACi5eLUOb63vMYhGq0kPBs7NGLYWFCL0RSTCu1yTlE5hH854MOgmjuVfPWyvdpaJDUOyByX-ksEPFIrrQQ7t1p4BkZcBuGD2cgJXeD",
    ADMINISTRATIVA_MID_SERVICE: "http://pruebasapi.intranetoas.udistrital.edu.co:8091/v1/",
    ADMINISTRATIVA_SERVICE: "http://pruebasapi.intranetoas.udistrital.edu.co:8104/v1/",
    ADMINISTRATIVA_PRUEBAS_SERVICE: "http://pruebasapi.intranetoas.udistrital.edu.co:8104/v1/",
    AGORA_SERVICE: "http://pruebasapi.intranetoas.udistrital.edu.co:8104/v1/",
    ARGO_SERVICE: "http://pruebasapi.intranetoas.udistrital.edu.co:8090/v1/",
    ARKA_SERVICE: "http://10.20.0.254/arka_api_crud/v1/",
    CONFIGURACION_SERVICE: "http://pruebasapi.intranetoas.udistrital.edu.co:8096/v1/",
    CORE_SERVICE: "http://pruebasapi.intranetoas.udistrital.edu.co:8092/v1/",
    FINANCIERA_MID_SERVICE: "http://pruebasapi.intranetoas.udistrital.edu.co:8089/v1/",
    FINANCIERA_SERVICE: "http://pruebasapi.intranetoas.udistrital.edu.co:8084/v1/",
    MODELS_SERVICE: "scripts/models/",
    NOTIFICACION_WS: "http://pruebasapi.intranetoas.udistrital.edu.co:8199/v1/",
    OIKOS_SERVICE: "http://pruebasapi.intranetoas.udistrital.edu.co:8087/v1/",
    ORGANIZACION_SERVICE: "http://pruebasapi.intranetoas.udistrital.edu.co:8097/v1/",
    PAGOS_SERVICE: "http://jbpm.udistritaloas.edu.co:8280/services/academicaProxyService/ingresos_concepto/",
    TITAN_SERVICE: "http://pruebasapi.intranetoas.udistrital.edu.co:8081/v1/",
    SPAGOBI_SERVICE: "https://intelligentia.udistrital.edu.co:8443/SpagoBI/restful-services/1.0/",
    UBICACIONES_SERVICE: "http://pruebasapi.intranetoas.udistrital.edu.co:8085/v1/",
     TOKEN: {
        AUTORIZATION_URL: "https://autenticacion.portaloas.udistrital.edu.co/oauth2/authorize",
        URL_USER_INFO: "https://autenticacion.portaloas.udistrital.edu.co/oauth2/userinfo",
        CLIENTE_ID: "sWe9_P_C76DWGOsLcOY4T7BYH6oa",
        REDIRECT_URL: "http://localhost:9000/",
        RESPONSE_TYPE: "id_token token",
        SCOPE: "openid email documento",
        BUTTON_CLASS: "btn btn-warning btn-sm",
        SIGN_OUT_URL: "https://autenticacion.portaloas.udistrital.edu.co/oidc/logout",
        SIGN_OUT_REDIRECT_URL: "http://localhost:9000/",
        SIGN_OUT_APPEND_TOKEN: "true",
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
    FINANCIERA_MID_SERVICE: "http://localhost:8087/v1/",
    FINANCIERA_SERVICE: "http://localhost:8084/v1/",
    MODELS_SERVICE: "scripts/models/",
    NOTIFICACION_WS: "ws://127.0.0.1:8080/ws/join",
    NOTIFICACION_SERVICE: "http://localhost:8080/api/",
    OIKOS_SERVICE: "http://10.20.0.254/oikos_api/v1/",
    ORGANIZACION_SERVICE: "http://localhost:8089/v1/",
    PAGOS_SERVICE: "http://jbpm.udistritaloas.edu.co:8280/services/academicaProxyService/ingresos_concepto/",
    TITAN_SERVICE: "http://10.20.0.254/titan_api_crud/v1/",
    TOKEN: {
        AUTORIZATION_URL: "https://autenticacion.portaloas.udistrital.edu.co/oauth2/authorize",
        URL_USER_INFO: "https://autenticacion.portaloas.udistrital.edu.co/oauth2/userinfo",
        CLIENTE_ID: "1aTCvNz4kxA7_p8Z8E1NPtCxtx8a",
        REDIRECT_URL: "http://localhost:9000/",
        RESPONSE_TYPE: "id_token token",
        SCOPE: "openid email",
        BUTTON_CLASS: "btn btn-warning btn-sm",
        SIGN_OUT_URL: "https://autenticacion.portaloas.udistrital.edu.co/oidc/logout",
        SIGN_OUT_REDIRECT_URL: "http://localhost:9000/",
        SIGN_OUT_APPEND_TOKEN: "true",
        REFRESH_TOKEN: "https://autenticacion.portaloas.udistrital.edu.co/oauth2/token",
        CLIENT_SECRET: "2crHq2IRkFHEVTBfpznLhKHyKVIa"
    },
    UBICACIONES_SERVICE: "http://127.0.0.1:8092/v1/",
};



angular.module('financieraClienteApp')
    .constant('CONF', {
        GENERAL: conf_pruebas
    });
