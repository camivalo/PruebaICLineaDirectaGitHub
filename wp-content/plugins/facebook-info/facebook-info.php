<?php
/*
  Plugin Name: Información Facebook Asesoras
  Plugin URI: http://www.pcfklovers.com.co
  Description: Este plugin se encargará de visualizar la información de facebook capturada en el login de PCFKLovers.
  Version: 1.0
  Author: Felipe Echeverri
  Author URI: http://www.ingeneo.com.co
  Author email: felipe.echeverri@ingeneo.com.co
 */
add_action('admin_menu', 'info_facebook_asesoras_menu');

/**
 * Metodo para crear el menu llamado Info Face PCFK
 * 
 * @author Felipe Echeverri <felipe.echeverri@ingeneo.com.co>
 * @copyright 2017 Linea Directa
 */
function info_facebook_asesoras_menu() {
    add_menu_page('Información Facebook Asesoras'
            , 'Info Face PCFK', 'manage_options'
            , 'info-facebook'
            , 'info_facebook_asesoras_init'
            , plugins_url('facebook-info/images/icon-face.png')
    );
}

/**
 * Metodo que obtiene toda la informacion de facebook de una asesora 
 * y la visualiza en pantalla
 * 
 * @author Felipe Echeverri <felipe.echeverri@ingeneo.com.co>
 * @copyright 2017 Linea Directa
 */
function info_facebook_asesoras_init() {
    
    ?>

    <div class="contentface" style="float: left; margin: 0 15px;">
        <h1>Información Facebook</h1>
        <?php
        //URL DESCARGAR EXCEL
        $urlExcel = 'http://10.8.8.54/pcfklovers/exportarPedidos';
        ?>
        <?php if (isset($_GET['id']) && !empty($_GET['id']) && is_numeric($_GET['id'])) : ?>

            <?php
            //URL SERVICIO WEB
            //$urlPerfil = 'http://10.8.8.54/pcfklovers/obtenerPerfil/' . $_GET['id'];
            $urlPerfil = 'http://localhost/pruebas/funcion.php';
            //ABRO CONEXION CURL
            $ch = curl_init();
            //SETEO URL EN LA CONEXION,
            curl_setopt($ch, CURLOPT_URL, $urlPerfil);
            //¿DEVUELVE EL DATO O LO PINTA? (true = return, false = print)
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            //SETEO TIEMPO DE ESPERA EN SEGUNDOS
            $timeout = 5;
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
            //INCLUIR CABECERA EN EL RESULTADO? (0 = SI, 1 = NO)
            curl_setopt($ch, CURLOPT_HEADER, 0);
            //EJECUTO UR Y DEVUELVO RESPUESTA
            $result = curl_exec($ch);
            //CIERRO CONEXION
            curl_close($ch);
            //PROCESO EL JSON
            $objResult = json_decode($result);
            //PROCESO EL JSON DE FACEBOOK
            $objFacebok = json_decode($objResult->facebook);

            if (!isset($objResult) ||
                    empty($objResult) ||
                    is_null($objResult) ||
                    !is_object($objResult) ||
                    $objResult->error ||
                    !is_object($objFacebok)) {
                echo "<div class='update-nag update-message notice-error notice-alt'><p>Ha ocurrido un error en la visualización de la información</p></div>";
                exit;
            }
            ?>
            <p>
                A continuación podrás visualizar toda la información que 
                Facebook permitió recolectar para el usuario especificado.
            </p>
            <table class="wp-list-table widefat fixed striped tablepress-all-tables">
                <thead>
                    <tr>
                        <th class="manage-column">Atributo</th>
                        <th class="manage-column">Valor</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($objFacebok as $att => $valor) : ?>
                        <tr>
                            <th><b><?= $att; ?></b></th>
                            <td><?= $valor; ?></td>
                        </tr>

                    <?php endforeach; ?>
                </tbody>
            </table>

        <?php else: ?>


            <div class="update-nag">
                <p>
                    Este plugin se encarga de visualizar toda la información 
                    del facebook de una asesora recolectada en la tienda web PCFKLovers.                    
                </p>
                <p>
                    Por favor ingresa al documento de Excel que contiene 
                    el listado de pedidos realizados, y a continuación, 
                    presione el enlace llamado <b>‘Ver Perfil’</b> para ver en detalle 
                    toda la información recolectada desde Facebook para una asesora.                    
                </p>
                <p>
                    <img src="<?= plugins_url('facebook-info/images/ej-verperfil-excel.png'); ?>"
                         style="width: 550px; "/>
                </p>
                <p>
                    También puede obtener esta información manualmente ingresando la URL <br />
                    <code>
                        http://www.pcfklovers.com.co/wp-admin/admin.php?page=info-facebook<span style="color: red; font-weight: bold">&id={ID}</span>
                    </code>
                    donde <code><span style="color: red; font-weight: bold">{ID}</span></code> 
                    debe ser remplazado por el número del ID del registro 
                    que puede encontrar en la primera columna del exportable en Excel.
                </p>
                <p>
                    <img src="<?= plugins_url('facebook-info/images/ej-id-excel.png'); ?>"
                         style="width: 550px; "/>
                </p>
                <p class="wrap">
                    <a class="page-title-action"
                       href="<?= $urlExcel; ?>">
                        Descargar Excel de pedidos
                    </a>
                </p>
            </div>
        <?php endif; ?>
    </div>
    <?php
}
?>