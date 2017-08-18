<?php

/**
 * Scripts y Estilos necesarios para todo el desarrollo de la tienda PCFK Lovers
 * 
 * @author Felipe Echeverri <felipe.echeverri@ingeneo.com.co>
 * @copyright 2017 Linea Directa
 */
function wp_adding_scripts() {
    wp_enqueue_style("pcfklovers", get_stylesheet_directory_uri() . '/css/pcfklovers.css');
    wp_enqueue_style('datepicker.min', get_stylesheet_directory_uri() . '/css/datepicker.min.css');
    wp_enqueue_script('pcfklovers-lang', get_stylesheet_directory_uri() . '/js/pcfklovers-lang.js');
    wp_enqueue_script('pcfklovers-config', get_stylesheet_directory_uri() . '/js/pcfklovers-config.js');
    wp_enqueue_script('pcfklovers', get_stylesheet_directory_uri() . '/js/pcfklovers.js');
    wp_enqueue_script('datepicker.min', get_stylesheet_directory_uri() . '/js/datepicker.min.js');
    wp_enqueue_script('jquery.validate', get_stylesheet_directory_uri() . '/js/jquery.validate.js');
    wp_enqueue_script('services', get_stylesheet_directory_uri() . '/js/services.js');
}

add_action('wp_enqueue_scripts', 'wp_adding_scripts');

/**
 * Funcion para agregar pedidos a woocommerce via ajax
 * 
 * @global type $woocommerce
 * @author Felipe Echeverri <felipe.echeverri@ingeneo.com.co>
 * @copyright 2017 Linea Directa
 */
function add_order_pcfklovers() {
    try {

        //CAPTURO LA INFORMACION INGRESADA
        $nombre = esc_attr(trim($_POST['pedido']['nombre']));
        $apellido = esc_attr(trim($_POST['pedido']['apellido']));
        $email = esc_attr(trim($_POST['pedido']['email']));
        $direccion = esc_attr(trim($_POST['pedido']['address']));
        $celular = esc_attr(trim($_POST['pedido']['celular']));
        $date_nacimiento = esc_attr(trim($_POST['pedido']['date-nacimiento']));
        $tipo_documento = esc_attr(trim($_POST['pedido']['tipo-documento']));
        $documento = esc_attr(trim($_POST['pedido']['documento']));
        $date_expedicion = esc_attr(trim($_POST['pedido']['date-expedicion']));
        $asesora = esc_attr(trim($_POST['pedido']['asesora']));
        $asesoranm = esc_attr(trim($_POST['pedido']['asesoranm']));
        $prospecto = esc_attr(trim($_POST['pedido']['prospecto']));
        $conocimiento = esc_attr(trim($_POST['pedido']['conocimiento']));
        $municipio = esc_attr(trim($_POST['pedido']['municipio']));
        $pedido = esc_attr(trim($_POST['pedido']['pedido']));
        $facebook = $_POST['pedido']['facebook'];
        $valor = esc_attr(trim($_POST['pedido']['valor']));
        $codcupon = esc_attr(trim($_POST['pedido']['codcupon']));

        //CREO EL USUARIO SI NO EXISTE
        $user_id = null;
        $default_password = wp_generate_password();
        if (!$user = get_user_by('email', $email)) {
            $user = $user_id = wp_create_user($nombre, $default_password, $email);
        } else {
            $user_id = $user->id;
        }
        
        //INFO FACEBOOK
        $infoFace = '';
        foreach ($facebook as $key => $value) {
            $infoFace .= "{$key}: {$value}, \r\n";
        }
        
        //ACTUALIZACION DE INFO DE USUARIO
        update_user_meta($user_id, 'first_name', $nombre);
        update_user_meta($user_id, 'last_name', $apellido);
        update_user_meta($user_id, 'user_direccion', $direccion);
        update_user_meta($user_id, 'user_celular', $celular);
        update_user_meta($user_id, 'user_date_nacimiento', $date_nacimiento);
        update_user_meta($user_id, 'user_tipo_documento', $tipo_documento);
        update_user_meta($user_id, 'user_documento', $documento);
        update_user_meta($user_id, 'user_date_expedicion', $date_expedicion);
        update_user_meta($user_id, 'user_asesora', $asesora);
        update_user_meta($user_id, 'user_asesoranm', $asesoranm);
        update_user_meta($user_id, 'user_prospecto', $prospecto);
        update_user_meta($user_id, 'user_conocimiento', $conocimiento);
        update_user_meta($user_id, 'user_municipio', $municipio);
        update_user_meta($user_id, 'user_facebook', $infoFace);
        update_user_meta($user_id, 'user_valor', json_encode($valor));
        wp_update_user([
            'ID' => $user_id,
            'role' => 'customer'
        ]);

        //CREO EL PEDIDO SETEANDO EL CLIENTE
        $order = wc_create_order([
            'customer_id' => $user_id
        ]);

        //CONFIGURO LA DIRECCION DE FACTURACION Y ENTREGA IGUALES
        $address = [
            'first_name' => $nombre,
            'last_name' => $apellido,
            'company' => 'PCFKLovers',
            'email' => $email,
            'phone' => $celular,
            'address_1' => $direccion,
            'address_2' => '',
            'city' => $municipio,
            'state' => '',
            'postcode' => '',
            'country' => 'CO',
            'conocimiento' => 'conocimiento'
        ];
        $order->set_address($address, 'billing');
        $order->set_address($address, 'shipping');
        
        //AGREGO EL CODIGO DEL CUPON A LA ORDEN
        update_post_meta($order->id, '_order_cupon', $codcupon);
        
        //SETEO LOS PRODUCTOS
        $productos = explode("||", $pedido);
        foreach ($productos as $producto) {
            if (empty($producto)) {
                continue;
            }
            $detalle = explode("-", $producto);
            $product_id = end($detalle);
            $cant = $detalle[count($detalle) - 2];
            $seltalla = $detalle[count($detalle) - 3];
            
            //PRODUCTO VARIABLE
            $objProductoVariable = new WC_Product_Variable($product_id);
            $tallas = $objProductoVariable->get_available_variations();
            $tallasArray = array();            
            
            //VALIDO LAS TALLAS SELECCIONADAS
            foreach ($tallas as $talla) {
                if ($talla['attributes']['attribute_pa_tallas'] == $seltalla) {                    
                    $tallasArray['variation'] = $talla['attributes'];
                }
            }
            
            //AGREGO EL PRODUCTO SELECCIONADO Y SU TALLA
            $order->add_product(get_product($product_id), $cant, $tallasArray);
        }

        //COMPLETO EL PEDIDO
        $order->update_status('completed');

        //GENERO EL ENVIO GRATUITO
        $ship_rate_ob = new WC_Shipping_Rate();
        $ship_rate_ob->id = 0;
        $ship_rate_ob->label = 'Free Shipping';
        $ship_rate_ob->taxes = array(); //not required in your situation
        $ship_rate_ob->cost = 0; //not required in your situation
        $order->add_shipping($ship_rate_ob);
        $order->calculate_shipping();

        //CALCULO EL TOTAL DE LA FACTURA
        $order->calculate_totals();

        //RESPONDO EXITOSAMENTE
        wp_send_json_success($order->id);
        
    } catch (Exception $exc) {
        wp_send_json_error();
    }
}

add_action('wp_ajax_add_order_pcfklovers', 'add_order_pcfklovers');
add_action('wp_ajax_nopriv_add_order_pcfklovers', 'add_order_pcfklovers');

add_action('wp_head', 'ajaxurl');

function ajaxurl() {
    ?>
    <script type="text/javascript">
        var ajaxurl = '<?php echo admin_url('admin-ajax.php'); ?>';
    </script>
    <?php
}
