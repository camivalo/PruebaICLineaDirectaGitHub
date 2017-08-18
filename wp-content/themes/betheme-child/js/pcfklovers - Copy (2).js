/* 
 * Created on : 26/05/2017, 08:15:14 AM
 * Author     : Felipe Echeverri <felipe.echeverri@ingeneo.com.co> * 
 */
jQuery(document).ready(function () {

    /**
     * Metodo que ingresa los productos al carrito en el sitio
     * de www.pcfklovers.com.co
     * 
     * @author Felipe Echeverri <felipe.echeverri@ingeneo.com.co>
     * @copyright 2017 Linea Directa
     */
    jQuery('.on-want').click(function () {
        //VALIDO QUE SE HAYA SELECCIONADO UN TALLA
        var tallas = jQuery(this).parent('.btn-buy').siblings('.box-size').children('div');
        var talla = '';
        jQuery(tallas).each(function () {
            var cellText = jQuery(this);
            if (jQuery(cellText).hasClass('active')) {
                talla = cellText.data('size');
            }
        });
        if (talla == '') {
            //MOSTRAR POPUP ERROR
            mostrarPopup('error', langpcfk.selTalla);
            return;
        }
        //IMAGEN DEL PRODUCTO
        var imagen = jQuery(this)
                .parent('.btn-buy')
                .parent('.item-product-car')
                .parent('.desc')
                .siblings('.image_frame')
                .children('.image_wrapper')
                .children('img.scale-with-grid')
                .attr('src');
        //ALMACENO LOS VALORES DEL PEDIDO
        var precio = jQuery(this).data('precio');
        var titulo = jQuery(this).data('titu');
        var plu = jQuery(this).data('plu');
        //ARMO LA TABLA DE PEDIDO
        var registro = '';
        registro += '<tr data-precioped="' + precio + '" data-cantidadped="1" data-talla="' + talla + '" data-plu="' + plu + '">';
        registro += '    <td class="column-1"><div class="image-product-car"><br>';
        registro += '            <img src="' + imagen + '" width="50px"><br>';
        registro += '            <h3>' + titulo + '<br>';
        registro += '                <span>Plu: ' + plu + '</span>';
        registro += '            </h3>';
        registro += '            <br>';
        registro += '            <div class="content-table-movil">';
        registro += '                <br>';
        registro += '                <p>Talla: ' + talla + '</p><br>';
        registro += '                <p>Precio: $' + addCommas(precio) + '</p><br>';
        registro += '                <p>Cant: <input type="number" name="cantidad" value="1" class="cntd" /></p><br>';
        registro += '            </div>';
        registro += '            <br>';
        registro += '        </div>';
        registro += '    </td>';
        registro += '    <td class="column-2">';
        registro += '        <p>' + talla + '</p>';
        registro += '    </td>';
        registro += '    <td class="column-3">';
        registro += '        <p>$' + addCommas(precio) + '</p>';
        registro += '    </td>';
        registro += '    <td class="column-4">';
        registro += '        <p><input type="number" name="cantidad" value="1" class="cntd" /></p>';
        registro += '    </td>';
        registro += '    <td class="column-5">';
        registro += '        <h4>$' + addCommas(precio) + '</h4>';
        registro += '    </td>';
        registro += '    <td class="column-6">';
        registro += '        <a href="javascript:void(0)" class="borrar"><i class="icon-cancel"></i></a>';
        registro += '    </td>';
        registro += '</tr>';
        //INSERTO LOS NUEVOS PEDIDOS EN LA TABLA ANTES DE LA ULTIMA POSICION
        jQuery("#tablepress-1 tbody.row-hover tr").last().before(registro);
        //REORGANIZO EL DISENO DE LA TABLA Y EL VALOR DE LAS FILAS
        construirTablaPedidos();
        //HABILITO EL PASO 2
        jQuery(".jq-tabs").tabs("enable", 1);
        jQuery('.rigth > a.btn-buy').show();
        //QUITO LA SELECCION DE TALLA
        jQuery('.box-size').children('.active').removeClass('active');
    });

    /**
     * Metodo para borrar pedidos preseleccionados
     * 
     * @author Felipe Echeverri <felipe.echeverri@ingeneo.com.co>
     * @copyright 2017 Linea Directa
     */
    jQuery(document).on('click', '.borrar', function (event) {
        event.preventDefault();
        jQuery(this).closest('tr').remove();
        //REORGANIZO EL DISENO DE LA TABLA Y EL VALOR DE LAS FILAS
        construirTablaPedidos();
    });

    /**
     * Metodo validar que la cantidad en el carrito sea entera y ajustar los 
     * valores totales
     *  
     * @author Felipe Echeverri <felipe.echeverri@ingeneo.com.co>
     * @copyright 2017 Linea Directa
     */
    jQuery(document).on('change', '.cntd', function (event) {
        if (jQuery.isNumeric(jQuery(this).val()) && jQuery(this).val() > 0) {
            //OBTENGO EL VALOR DEL PRDUCTO
            var precioped = jQuery(this).parent('p').parent('td').parent('tr').data('precioped');
            //VERIFICO SI ES MOVIL
            if (typeof precioped === 'undefined' || precioped === null) {
                var precioped = jQuery(this)
                        .parent('p')
                        .parent('div')
                        .parent('div')
                        .parent('td')
                        .parent('tr')
                        .data('precioped');
                //CAMBIO LA CANTIDAD DEL PRODCUTO
                jQuery(this).parent('p')
                        .parent('div')
                        .parent('div')
                        .parent('td')
                        .parent('tr')
                        .attr("data-cantidadped", jQuery(this).val());
                jQuery(this).parent('p')
                        .parent('div')
                        .parent('div')
                        .parent('td')
                        .siblings('.column-4')
                        .children('p')
                        .children('.cntd')
                        .val(jQuery(this).val());
            } else {
                //CAMBIO LA CANTIDAD DEL PRODCUTO
                jQuery(this).parent('p')
                        .parent('td')
                        .parent('tr')
                        .attr("data-cantidadped", jQuery(this).val());
                jQuery(this).parent('p')
                        .parent('td')
                        .siblings('.column-1')
                        .children('div')
                        .children('div')
                        .children('p')
                        .children('.cntd')
                        .val(jQuery(this).val());
            }
        } else {
            //MOSTRAR POPUP ERROR
            mostrarPopup('error', langpcfk.valoresEnteros);
            jQuery(this).val(1);
        }
        //REORGANIZO EL DISENO DE LA TABLA Y EL VALOR DE LAS FILAS
        construirTablaPedidos();
    });

    /**
     * Metodo para abrir la pestana del carrito directamente desde el enlace
     * jQuery('.ui-tabs').tabs("option", "active", 1);
     * El numero 1 como parametro es las segunda pestana, pues empiza en 0, 1, 2, 3
     *  
     * @author Felipe Echeverri <felipe.echeverri@ingeneo.com.co>
     * @copyright 2017 Linea Directa
     */
    jQuery('.scroll').click(function () {
        jQuery('.ui-tabs').tabs("option", "active", 1);
    });

    /**
     * Metodo para cerrar el banner principal en los pasos 2, 3 y 4
     *  
     * @author Felipe Echeverri <felipe.echeverri@ingeneo.com.co>
     * @copyright 2017 Linea Directa
     */
    jQuery(".jq-tabs").on("tabsactivate", function (event, ui) {
        var tabselected = ui.newPanel.selector;
        if (tabselected == '#-1') {
            jQuery('#BannerMain').show('slow');
            jQuery('.tab-products-buy').removeClass('margtop');
            jQuery('.logo').removeClass('logot');
        } else {
            jQuery('#BannerMain').hide('slow');
            jQuery('.tab-products-buy').addClass('margtop');
            jQuery('.logo').addClass('logot');
        }
    });

    /**
     * Metodo para hacer el checkout final del pedido
     * 
     * @author Felipe Echeverri <felipe.echeverri@ingeneo.com.co>
     * @copyright 2017 Linea Directa
     */
    jQuery(".wpcf7-form").submit(function (event) {
        event.preventDefault();
        if (jQuery(".wpcf7-form").valid()) {
            //ARMO EL OBJETO CON TODA LA INFORMACION DEL PEDIDO
            var pedido = '';
            jQuery("#tablepress-1 tbody.row-hover tr").each(function () {
                if (typeof jQuery(this).data('plu') !== 'undefined' &&
                        typeof jQuery(this).data('talla') !== 'undefined' &&
                        typeof jQuery(this).data('cantidadped') !== 'undefined') {
                    pedido += '||' + jQuery(this).data('plu') + '-' + jQuery(this).data('talla') + '-' + jQuery(this).data('cantidadped');
                }
            });
            var pedido = {
                'nombre': jQuery('#your-name').val(),
                'apellido': jQuery('#your-apellido').val(),
                'email': jQuery('#your-email').val(),
                'address': jQuery('#address').val(),
                'celular': jQuery('#celular').val(),
                'date-nacimiento': jQuery('#date-nacimiento').val(),
                'tipo-documento': jQuery('#tipo-documento').val(),
                'documento': jQuery('#documento').val(),
                'date-expedicion': jQuery('#date-expedicion').val(),
                'asesora': jQuery('#asesora').val(),
                'prospecto': jQuery('#prospecto').val(),
                'conocimiento': jQuery('#conocimiento').val(),
                'pedido': pedido,
                'facebook': 'infoProfileFace',
            };
            //INVOCO LA FUNCION DE LOS PEDIDOS
            jQuery.ajax({
                type: "POST",
                url: configpcfk.urlEnviarPedido,
                dataType: 'json',
                data: pedido,
                beforeSend: function () {
                    createLoading();
                },
                complete: function () {
                    removeLoading();
                },
                success: function (response) {
                    if (!response.error) {
                        //HABILITO LA PESTANA DE EXITO EN PEDIDO
                        jQuery(".jq-tabs").tabs("enable", 3);
                        jQuery('.jq-tabs').tabs("option", "active", 3);
                        //BLOQUEO LAS PESTANAS PASADAS PARA EVITAR NUEVOS PEDIDOS
                        jQuery(".jq-tabs").tabs({
                            disabled: [0, 1, 2]
                        });
                        //VACIO EL CARRITO
                        jQuery(".modal-notificacion .rigth .number").html("0");
                        //VACIO LA TABLA DE PEDIDOS
                        jQuery("#tablepress-1").empty();
                    } else if (response.error) {
                        mostrarPopup('error', langpcfk.errorPedido);
                    }
                },
                error: function (error) {
                    mostrarPopup('error', langpcfk.error500);
                }
            });
        }
    });
    jQuery(".wpcf7-form").validate({
        errorElement: 'span',
        errorClass: 'error not-valid-tip',
        rules: {
            celular: {
                maxlength: 10,
                minlength: 10
            }
        }
    });

    /**
     * Metodo para ingresar manualmente le cupon y validarlo
     * 
     * @author Felipe Echeverri <felipe.echeverri@ingeneo.com.co>
     * @copyright 2017 Linea Directa
     */
    jQuery(".cupon-form").submit(function (event) {
        event.preventDefault();
        if (jQuery(".cupon-form").valid()) {
            validarCupon(jQuery("#cupon").val());
        }
    });
    jQuery(".cupon-form").validate({
        errorElement: 'span',
        errorClass: 'error not-valid-tip'
    });

    /**
     * Metodo para poner calendarios en los campos fecha de nacimiento y expedición
     * 
     * @author Felipe Echeverri <felipe.echeverri@ingeneo.com.co>
     * @copyright 2017 Linea Directa
     */
    jQuery.datepicker.regional['es'] = {
        closeText: 'Cerrar',
        prevText: '<Ant',
        nextText: 'Sig>',
        currentText: 'Hoy',
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Juv', 'Vie', 'Sáb'],
        dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
        weekHeader: 'Sm',
        dateFormat: 'dd/mm/yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    };
    jQuery.datepicker.setDefaults(jQuery.datepicker.regional['es']);
    jQuery(".wpcf7-date").datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'yy-mm-dd',
        yearRange: '1930:2020'
    });

    /**
     * Metodo para validar existencia de cupon
     * 
     * @author Felipe Echeverri <felipe.echeverri@ingeneo.com.co>
     * @copyright 2017 Linea Directa
     */
    var cuponexist = false;
    var codcupon = false;
    jQuery.each(document.location.search.substr(1).split('&'), function (c, q) {
        var i = q.split('=');
        if (i[0] == 'codigo' && typeof i[1] !== 'undefined') {
            cuponexist = true;
            codcupon = i[1];
            return false;
        }
    });

    /*
     * SI EXISTE CUPON, CONSULTO EL SERVICIO WEB DE CUPON 
     * SINO, ESCONDO PASOS Y MUESTRO FORMULARIO
     */
    if (cuponexist) {
        jQuery('.titupretab').hide();
        jQuery('.column_tabs').hide();
        jQuery('.box-cupon').show();
        jQuery('.modal-buttom-buy').hide();
        jQuery('#cupon').val(codcupon);
    } else {
        jQuery('.titupretab').hide();
        jQuery('.column_tabs').hide();
        jQuery('.modal-buttom-buy').hide();
        jQuery('.box-cupon').show();
    }    

    /**
     * Desactivo por defecto los pasos 2, 3 y 4.
     * Se iran activado a medida que se haga el paso a paso correctamente
     */
    jQuery(".jq-tabs").tabs({
        disabled: [1, 2, 3]
    });

    /**
     * Metodo para abrir el paso 3
     * 
     * @author Felipe Echeverri <felipe.echeverri@ingeneo.com.co>
     * @copyright 2017 Linea Directa
     */
    jQuery(".btn-buy.scroll").click(function () {
        jQuery(".jq-tabs").tabs("enable", 2);
        jQuery('.jq-tabs').tabs("option", "active", 2);
    });

    /**
     * Metodo para activar los botones  Anterior y Siguiente
     * 
     * @author Felipe Echeverri <felipe.echeverri@ingeneo.com.co>
     * @copyright 2017 Linea Directa
     */
    jQuery('.rigth > a.btn-buy, .left > a.btn-pre').hide();
    jQuery('.rigth > a.btn-buy').click(function () {
        var selectedTab = jQuery(".jq-tabs").tabs('option', 'active');
        if (selectedTab == 1) {
            jQuery(".jq-tabs").tabs("enable", 2);
            jQuery('.jq-tabs').tabs("option", "active", 2);
        }
        jQuery(".jq-tabs").tabs("option", "active", selectedTab + 1);
        return false;
    });
    jQuery('.left > a.btn-pre').click(function () {
        var selectedTab = jQuery(".jq-tabs").tabs('option', 'active');
        jQuery(".jq-tabs").tabs("option", "active", selectedTab - 1);
        return false;
    });

    /**
     * Metodo para controlar los botones atras y siguiente dependiendo del paso
     * em el que se este
     * 
     * @author Felipe Echeverri <felipe.echeverri@ingeneo.com.co>
     * @copyright 2017 Linea Directa
     */
    jQuery(".jq-tabs").on("tabsactivate", function (event, ui) {
        var selectedTab = jQuery(".jq-tabs").tabs('option', 'active');
        if (selectedTab == 1) {
            //VALIDO QUE EL TOTAL EL PEDIDO NO HAYA SUPERADO LOS 70 MIL
            if (jQuery('.btn-buy.scroll').css('display') == 'none') {
                jQuery('.rigth > a.btn-buy').hide();
                jQuery('.left > a.btn-pre').show();
            } else {
                jQuery('.rigth > a.btn-buy').show();
                jQuery('.left > a.btn-pre').show();
            }
        } else if (selectedTab == 2) {
            jQuery('.rigth > a.btn-buy, .left > a.btn-pre').show();
        } else if (selectedTab == 0) {
            jQuery('.left > a.btn-pre').hide();
            jQuery('.rigth > a.btn-buy').show();
        } else {
            jQuery('.rigth > a.btn-buy, .left > a.btn-pre').hide();
        }
    });

    /**
     * Metodo para ingresar manualmente la cedula y validarla
     * 
     * @author Felipe Echeverri <felipe.echeverri@ingeneo.com.co>
     * @copyright 2017 Linea Directa
     */
    jQuery(".cedula-form").submit(function (event) {
        event.preventDefault();
        if (jQuery(".cedula-form").valid()) {
            validarCedula(jQuery("#cedula").val());
        }
    });
    jQuery(".cedula-form").validate({
        errorElement: 'span',
        errorClass: 'error not-valid-tip'
    });

    /**
     * Metodo para validar si estoy en la vista de asesora o de administrador
     * 
     * @author Felipe Echeverri <felipe.echeverri@ingeneo.com.co>
     * @copyright 2017 Linea Directa
     */
    var urlpath = window.location.pathname;
    if (urlpath == '/home/') {
        var cedexist = false;
        var cedula;
        jQuery.each(document.location.search.substr(1).split('&'), function (c, q) {
            var i = q.split('=');
            if (i[0] == 'cedula' && typeof i[1] !== 'undefined') {
                cedexist = true;
                cedula = i[1];
                return false;
            }
        });
        /*
         * SI EXISTE CUPON, CONSULTO EL SERVICIO WEB DE CUPON 
         * SINO, ESCONDO PASOS Y MUESTRO FORMULARIO
         */
        if (cedexist) {
            validarCedula(cedula);
        } else {
            jQuery('.box-list-clientes').hide();
            jQuery('.box-cedula').show();
        }
    }

    /**
     * Metodo para realizar scroll al body en el paso a paso
     * 
     * @author Felipe Echeverri <felipe.echeverri@ingeneo.com.co>
     * @copyright 2017 Linea Directa
     */
    jQuery('.ui-tabs-anchor, .scroll, .rigth > a.btn-buy, .left > a.btn-pre').click(function () {
        jQuery("html, body").stop().animate({
            scrollTop: jQuery("body").offset().top
        });
    });

    /**
     * Metodo que valida el celular solo tenga 10 digitos y sean numeros
     * 
     * @author Felipe Echeverri <felipe.echeverri@ingeneo.com.co>
     * @copyright 2017 Linea Directa
     */
    jQuery("#celular").on('keydown keyup', function () {
        var $that = jQuery(this),
                maxlength = $that.attr('maxlength')
        if (jQuery.isNumeric(maxlength)) {
            $that.val($that.val().substr(0, maxlength));
        }
        ;
    });

    var fechaActual = new Date();
    calcularFechaPago(fechaActual, configpcfk.diasFechaPago);
    /**
     * Metodo para sumar 20 dias a la fecha de pago del pedido
     * 
     * @param string fecha
     * @param int dias
     * @returns string
     */
    function calcularFechaPago(fecha, dias) {
        //ELIMINO SABADOS Y DOMINGOS DE LA SUMA
        var i = 0;
        while (i < dias) {
            fecha.setDate(fecha.getDate() + 1);
            if (fecha.getDay() != 6 && fecha.getDay() != 0) {
                i++;
            }
        }
        //MESES EN ESPANOL
        var meses = [
            'enero',
            'febrero',
            'marzo',
            'abril',
            'mayo',
            'junio',
            'julio',
            'agosto',
            'septiembre',
            'octubre',
            'noviembre',
            'diciembre'
        ];
        //ESCRIBO LA FEHCA DE PAGO CALCULADA
        jQuery("#fechaPago").html(fecha.getDate() + ' de ' + meses[fecha.getMonth()]);

    }

    /**
     * Metodo que valida el cupon
     * 
     * @param string cupon
     * @author Felipe Echeverri <felipe.echeverri@ingeneo.com.co>
     * @copyright 2017 Linea Directa
     */
    function validarCupon(cupon) {
        jQuery.ajax({
            type: "GET",
            url: configpcfk.urlValidarCupon,
            data: {
                'codigo': cupon
            },
            dataType: 'json',
            beforeSend: function () {
                createLoading();
            },
            complete: function () {
                removeLoading();
            },
            success: function (response) {
                if (!response.error) {
                    jQuery('.titupretab').show();
                    jQuery('.column_tabs').show();
                    jQuery('.box-cupon').hide();
                    jQuery('#asesora').val(response.asesora.id);
                    jQuery('#asesoranm').val(response.asesora.nombre);
                    jQuery('#prospecto').val(response.prospecto.id);
                    jQuery('.errorcupon').html('');
                    jQuery('.errorcupon').hide();
                    jQuery('.modal-buttom-buy').show();
                } else if (response.error) {
                    //SI HUBO ERROR VOY AL PASO 4 Y MUESTRO EL ERROR
                    if (response.tipo == 'incorrecto') {
                        jQuery('.errorcupon').html(langpcfk.invalidCupon);
                    } else if (response.tipo == 'redimido') {
                        jQuery('.errorcupon').html(langpcfk.cuponRedimido);
                    }
                    jQuery('.titupretab').hide();
                    jQuery('.column_tabs').hide();
                    jQuery('.box-cupon').show();
                    jQuery('.modal-buttom-buy').hide();
                }
            },
            error: function (error) {
                mostrarPopup('error', langpcfk.error500);
            }
        });
    }

    /**
     * Metodo que valida el cupon
     * 
     * @param string cupon
     * @returns {undefined}
     * @author Felipe Echeverri <felipe.echeverri@ingeneo.com.co>
     * @copyright 2017 Linea Directa
     */
    function validarCedula(cedula) {
        jQuery.ajax({
            type: "GET",
            url: configpcfk.urlValidarAsesora,
            data: {
                'cedula': cedula
            },
            dataType: 'json',
            beforeSend: function () {
                createLoading();
            },
            complete: function () {
                removeLoading();
            },
            success: function (response) {
                if (!response.error) {
                    jQuery('.box-cedula').hide();
                    jQuery('.box-list-clientes').show();
                    jQuery('.errorcedula').html('');
                    //LEO LOS CLIENTES DISPONIBLES PARA CUPON Y CREO LA TABLA
                    var whatsApp = ' ';
                    jQuery.each(response.prospectoList, function (i, item) {

                        //VALIDO SI SE ABRE DESDE UN CELULAR PARA MOSTAR ICONO WHATSAPP
                        if (isMobile()) {
                            whatsApp = '<a href="whatsapp://send?text=http://services.pcfklovers.com.co/compartirCupon/' + item.cupon + '/' + item.nombre + '_' + item.apellido + '" data-action="share/whatsapp/share">\n\
                                        <img src="/wp-content/uploads/2017/04/icon-whatsapp.png" style="width: 32px" />\n\
                                    </a>';
                        }
                        jQuery('table.list-clientes tbody')
                                .append('<tr><td class="content-pc"><h4>' + item.nombre + ' <b>' + item.apellido + '</b></h4>\n\
                                </td><td class="content-pc"><h4>' + item.cupon + '</h4></td>\n\
                                    <td class="content-pc">\n\
                                        ' + whatsApp + '\n\
                                        &nbsp;&nbsp;\n\
                                        <span data-layout="button" data-size="small" data-mobile-iframe="false" data-href="/wp-content/uploads/2017/04/icon-face.png" >\n\
                                            <a class="fb-xfbml-parse-ignore" href="javascript:void(0);" onclick="objSocial.fOpenFacebook(\'http://services.pcfklovers.com.co/compartirCupon/' + item.cupon + '/' + item.nombre + ' ' + item.apellido + '\');">\n\
                                                <img src="/wp-content/uploads/2017/04/icon-face.png" style="width: 32px" />\n\
                                            </a>\n\
                                        </span>\n\
                                    </td>\n\
                                    <td class="content-movil">\n\
                                        <div>\n\
                                            <p><b>Nombre:</b> ' + item.nombre + '  ' + item.apellido + ' </p>\n\
                                            <p><b>Cupón:</b> ' + item.cupon + '</p>\n\
                                            <p><span data-layout="button" data-size="small" data-mobile-iframe="false" data-href="/wp-content/uploads/2017/04/icon-face.png" >\n\
                                                    <a class="fb-xfbml-parse-ignore" href="javascript:void(0);" onclick="objSocial.fOpenFacebook(\'http://services.pcfklovers.com.co/compartirCupon/' + item.cupon + '/' + item.nombre + ' ' + item.apellido + '\');">\n\
                                                        <img src="/wp-content/uploads/2017/04/icon-face.png" style="width: 32px" />\n\
                                                    </a>\n\
                                                </span>\n\
                                                &nbsp;&nbsp;' + whatsApp + '\n\
                                            </p>\n\
                                        </div>\n\
                                    </td>\n\
                                    </tr>');
                        if (isMobile()) {
                            jQuery('.content-movil').show();
                            jQuery('.content-pc').hide();
                        } else {
                            jQuery('.content-movil').hide();
                            jQuery('.content-pc').show();
                        }
                    });
                } else if (response.error) {
                    //SI HUBO ERROR VOY AL PASO 4 Y MUESTRO EL ERROR
                    jQuery('.errorcedula').html(langpcfk.invalidCedula);
                    jQuery('.box-list-clientes').hide();
                    jQuery('.box-cedula').show();
                }
            },
            error: function (error) {
                //MUESTRO ERROR Y ABRO EL FORMULARIO DE CEDULA
                mostrarPopup('error', langpcfk.error500);
                jQuery('.box-list-clientes').hide();
                jQuery('.box-cedula').show();
            }
        });
    }

    /**
     * Metodo para construir la tabla de pedido y organizar el diseno de la misma
     * 
     * @author Felipe Echeverri <felipe.echeverri@ingeneo.com.co>
     * @copyright 2017 Linea Directa
     */
    function construirTablaPedidos() {
        var row = 2;
        var cantidadpedido = 0;
        var preciopedido = 0;
        var cantPd = 0;
        jQuery("#tablepress-1 tbody.row-hover tr").each(function () {

            var precioped = jQuery(this).data('precioped');
            if (typeof precioped !== 'undefined' && precioped !== null) {
                cantPd++;
                //MULTIPLICO CANTIDAD Y PRECIO
                var cantidadped = jQuery(this).children('td.column-4').children('p').children('.cntd').val();
                if (typeof cantidadped !== 'undefined' && cantidadped !== null && jQuery.isNumeric(cantidadped)) {
                    precioped *= cantidadped;
                } else {
                    precioped *= 1;
                }
                preciopedido += precioped;
                //ACTUALIZO TOTAL DEL PEDIDO
                jQuery(this).children('td.column-5').children('h4').html('$' + addCommas(precioped));
            }
            //QUITO TODAS LAS CLASES PARA REORGANIZAR
            jQuery(this).attr('class', '');
            //ASIGNO CADA VALOR DE ROW SECIENCIALMENTE
            jQuery(this).addClass("row-" + row);
            //MANEJO DE CEBRA INTERCALADO
            var cebra = "even";
            if (row % 2 == 0) {
                cebra = "odd";
            }
            jQuery(this).addClass(cebra);
            row++;
        });
        //CAMBIO EL PRECIO        
        jQuery('.comprar > h5').html('Subtotal: $' + addCommas(preciopedido));        
        if (preciopedido > configpcfk.limitePedidos || preciopedido <= 0) {
            //MOSTRAR POPUP ERROR
            mostrarPopup('error', langpcfk.maxPedido);
            jQuery('.comprar > a.btn-buy').hide();
            jQuery('.rigth > a.btn-buy').hide();
            jQuery(".jq-tabs").tabs({
                disabled: [2, 3]
            });
        } else {
            jQuery('.comprar > a.btn-buy').show();
            jQuery('.rigth > a.btn-buy').show();
        }
        var disponible = configpcfk.limitePedidos;
        disponible -= preciopedido;
        jQuery("#table-products > h6 > b").html("$" + addCommas(disponible));
        jQuery(".modal-notificacion .center strong").html("$" + addCommas(disponible));
        jQuery(".modal-notificacion .rigth .number").html(cantPd);
    }

    /**
     * Metodo que formatea los numeros y pone las unidades de miles
     * 
     * @param string nStr
     * @returns string
     * @author Felipe Echeverri <felipe.echeverri@ingeneo.com.co>
     * @copyright 2017 Linea Directa
     */
    function addCommas(nStr) {
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }

    /**
     * Metodo para generar el velo de gif 
     * 
     * @returns string
     * @author Felipe Echeverri <felipe.echeverri@ingeneo.com.co>
     * @copyright 2017 Linea Directa
     */
    function createLoading() {
        jQuery('body').append('<div class="dvLoading"></div>');
    }

    /**
     * Metodo para retirar el velo de gif 
     * 
     * @returns string
     * @author Felipe Echeverri <felipe.echeverri@ingeneo.com.co>
     * @copyright 2017 Linea Directa
     */
    function removeLoading() {
        jQuery('.dvLoading').remove();
    }

    /**
     * Metodo para detectar si se ingreso desde un dispositivo movil
     * 
     * @returns boolean
     * @author Felipe Echeverri <felipe.echeverri@ingeneo.com.co>
     * @copyright 2017 Linea Directa
     */
    function isMobile() {
        return (
                (navigator.userAgent.match(/Android/i)) ||
                (navigator.userAgent.match(/webOS/i)) ||
                (navigator.userAgent.match(/iPhone/i)) ||
                (navigator.userAgent.match(/iPod/i)) ||
                (navigator.userAgent.match(/iPad/i)) ||
                (navigator.userAgent.match(/BlackBerry/i))
                );
    }
});

/**
 * Metodo para mostrar un popup en css mejor que los alerts
 * @param atring tipo
 * @param atring msj
 * @author Felipe Echeverri <felipe.echeverri@ingeneo.com.co>
 * @copyright 2017 Linea Directa
 */
function mostrarPopup(tipo, msj) {
    jQuery('.txt-modal').html(msj);
    if (tipo == 'success') {
        jQuery('#id01 > div > div').removeClass('w3error');
        jQuery('#id01 > div > div').addClass('w3success');
        jQuery('#id01').show();
        setTimeout(function () {
            jQuery("#id01").fadeOut(1000);
        }, 100);
    } else if (tipo == 'error') {
        jQuery('#id01 > div > div').removeClass('w3success');
        jQuery('#id01 > div > div').addClass('w3error');
        jQuery('#id01').show();
    }
}

/**
 * Metodo encargado de procesar el estado del login a facebook para mostrar u
 * ocultar el formulario de subscripcion
 * Este metodo debe estar fuera del jQuery(document).ready();
 * 
 * @param json response
 * @returns string
 */
var infoProfileFace = {};
function statusChangeCallback(response) {

    //SI EL LOGIN FUE EXITOSO TRAIGO LA INFORMACIÓN BASICA
    if (response.status === 'connected') {
        FB.api('/me', function (response) {
            infoProfileFace = response;
        });
        jQuery('.form-subscribe').show();
        jQuery('.faceconnect').hide();
    } else {
        //MOSTRAR POPUP ERROR
        mostrarPopup('error', langpcfk.errorLoginFacebook);
    }
}