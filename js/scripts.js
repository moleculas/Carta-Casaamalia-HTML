const detectaIdioma = () => {
    const idiomas = ["es", "ca", "en", "fr"];
    const htmlLang = $("html").attr("lang");
    return idiomas.includes(htmlLang) ? htmlLang : undefined;
};

const detectaObjeto = () => {
    return $("html").attr("tipus");
};

const cargaCartaPrincipal = () => {
    const objeto = detectaObjeto();
    const idioma = detectaIdioma();
    const rutaApi = window.location.href.indexOf("casaamalia.com") > -1 ? "gestio/api/" : "../api_casaamalia_v2/";
    $.ajax({
        url: `${rutaApi}obtener_carta_general_html.php`,
        type: "POST",
        data: { objeto, idioma },
        dataType: "json",
        success: function (res) {
            gestionaCarta(res, idioma, objeto);
        }
    });
};

const reemplazarApostrofe = (cadena) => {
    var cadenaModificada = cadena.replace(/’/g, "'");
    return cadenaModificada;
};

const gestionaCarta = (res, idioma, objeto) => {
    const tipus = res.carta.tipus;
    const PARADES = objeto === "plats" ? res.parades.map(parada => ({
        ...parada,
        imatges: JSON.parse(parada.imatges)
    })) : null;
    const PRODUCCIO = objeto === "plats" ? res.produccio.map(prod => ({
        ...prod,
        imatges: JSON.parse(prod.imatges)
    })) : null;
    const zones = objeto === "vins" ? res.zones : null;
    const rutaImatgesHeaders = (window.location.href.indexOf("casaamalia.com") > -1)
        ? `gestio/api/images/header_${objeto}/${tipus === "normal" ? "carta" : tipus}/`
        : `../api_casaamalia_v2/images/header_${objeto}/${tipus === "normal" ? "carta" : tipus}/`;
    const rutaImatgesItems = (window.location.href.indexOf("casaamalia.com") > -1)
        ? `gestio/api/images/${objeto}_imatges/`
        : `../api_casaamalia_v2/images/${objeto}_imatges/`;
    const rutaImatgesZones = (window.location.href.indexOf("casaamalia.com") > -1)
        ? `gestio/api/images/zones/`
        : `../api_casaamalia_v2/images/zones/`;
    const categoriesCarta = { plats: [1, 2, 3, 4, 5], vins: [1, 2, 3, 4] };
    const propietatsPerIdioma = {
        titolCarta: res.carta[`nom_${objeto}_${idioma}`],
        titolCategoria: res.titols
            .sort((a, b) => a.ordre - b.ordre)
            .map((titol) => titol[`titol_${idioma}`]),
        ...categoriesCarta[objeto].reduce((obj, categoria) => {
            obj[`nomsItemsCategoria${categoria}`] = res.items
                .sort((a, b) => a.ordre - b.ordre)
                .filter((item) => item.categoria === categoria)
                .map((item) => objeto === "plats" ? (item[`nom_${idioma}`]) : (item[`nom`]));
            return obj;
        }, {}),
        ...categoriesCarta[objeto].reduce((obj, categoria) => {
            obj[`descripcionsItemsCategoria${categoria}`] = res.items
                .sort((a, b) => a.ordre - b.ordre)
                .filter((item) => item.categoria === categoria)
                .map((item) => item[`descripcio_${idioma}`]);
            return obj;
        }, {})
    };
    const imatgeGeneral = objeto === "plats" ? res.carta.imatge_plats : res.carta.imatge_vins;
    $('.titolCarta').text(propietatsPerIdioma.titolCarta);
    $("#bckgrGn").attr("data-bg", `${rutaImatgesHeaders}${imatgeGeneral}`);
    res.titols.forEach((titol, index) => {
        if (titol.ordre === index + 1) {
            $(`.titol${objeto === "plats" ? index : index + 1}`).text(`${propietatsPerIdioma.titolCategoria[index]}`);
            $(`#bckgr${objeto === "plats" ? index : index + 1}`).attr("data-bg", `${rutaImatgesHeaders}${titol.imatge}`);
        }
    });
    //categoria destacts oculta per defecte
    //objeto === "plats" && !res.items.some(item => item.categoria === 1) && $('.visible-cat-1').addClass('ocultar');
    objeto === "plats" && $('.visible-cat-1').addClass('ocultar');
    const divsToggleP = [], divsToggleA = [];
    if (objeto === "plats") {
        const categoriaAfegirCarta = categoriesCarta[`plats`].map((categoria, index) =>
            res.items
                .sort((a, b) => a.ordre - b.ordre)
                .filter(item => item.categoria === categoria)
                .map((item, index) => {
                    const arrParada = item.parada?.split(",") || null;
                    const arrProduccio = item.produccio?.split(",") || null;
                    const arrAlergens = item.alergens.split(",");
                    let parades = "", produccio = "", alergens = "";
                    let totalMarcadorsP = 0, totalMarcadorsA = 0;
                    const claseDestacat = +item.destacat === 1 ? "destacat" : "";
                    if (arrParada) {
                        parades = arrParada.map((parada, index) => `<div data-parada="${parada}" class="mostrar parada botoParada${index}"><img src="images/market_loc.png" alt=""></div>`).join('');
                        divsToggleP.push({ categoria, index, items: arrParada.length });
                        totalMarcadorsP += arrParada.length;
                    };
                    if (arrProduccio) {
                        produccio = arrProduccio.map((producte, index) => `<div data-producte="${producte}" class="mostrar produccio botoProducte${index}"><img src="images/prod_loc.png" alt=""></div>`).join('');
                        divsToggleP.push({ categoria, index, items: arrProduccio.length });
                        totalMarcadorsP += arrProduccio.length;
                    };
                    if (arrAlergens[0] !== "0") {
                        alergens = arrAlergens.map((alergen, index) => `<div data-alergen="${alergen}" class="ocultar alergen botoAlergens${index}"><img src="images/al-i-${alergen}.png" alt=""></div>`).join('');
                        divsToggleA.push({ categoria, index, items: arrAlergens.length });
                        totalMarcadorsA += arrAlergens.length;
                    };
                    return `<div class="hero-menu-item">
                            ${+item.destacat === 1 ? ("<div class='destacat-icona'><i class='fa fa-star'></i></div>") : ""}
                            <a href="${rutaImatgesItems}${item.imatge}" class="hero-menu-item-img image-popup ${claseDestacat}"><img src="${rutaImatgesItems}thumbnails/${item.imatge}" alt=""></a>
                            <div class="hero-menu-item-title fl-wrap">
                                <h6>${reemplazarApostrofe(propietatsPerIdioma[`nomsItemsCategoria${categoria}`][index])}</h6>
                                <div class="hmi-dec"></div>
                                <span class="hero-menu-item-price">${item.preu}</span>
                                ${parades}${produccio}${alergens}
                            </div>                       
                            <div id="des-${categoria}-${index}" class="descripcio hero-menu-item-details marcadors${totalMarcadorsP || ''}">
                                <p>${reemplazarApostrofe(propietatsPerIdioma[`descripcionsItemsCategoria${categoria}`][index])}</p>
                            </div>                      
                        </div>`;
                }).join('')
        );
        categoriesCarta[objeto].forEach((_, index) => $(`#menu-section-${index}`).append(categoriaAfegirCarta[index]));
    };
    if (objeto === "vins") {
        const categoriaAfegirVins = ['', '', '', ''];
        for (const categoria of categoriesCarta[`vins`]) {
            const vins = res.items.filter(item => item.categoria === categoria);
            const todasZonasVinsNotNull = vins.every(vi => vi.zona !== null);
            if (todasZonasVinsNotNull) {
                const vinsPerZona = {};
                vins.forEach(vin => {
                    const zona = vin.zona;
                    if (!vinsPerZona[zona]) {
                        vinsPerZona[zona] = [];
                    }
                    vinsPerZona[zona].push(vin);
                });
                const vinsPerZonaOrdenats = {};
                for (const clave in vinsPerZona) {
                    const ordreSubCategoria = zones?.find(zon => zon.id === Number(clave)).ordre;
                    vinsPerZonaOrdenats[ordreSubCategoria] = [vinsPerZona[clave], Number(clave)];
                };
                let isFirstElement = true;
                for (let zona in vinsPerZonaOrdenats) {
                    const marginTopStyle = isFirstElement ? '' : 'margin-top: 30px;';
                    const { [`titol_${idioma}`]: titolZona, imatge: imatgeZona } = zones?.find(zon => zon.id === Number(vinsPerZonaOrdenats[zona][1])) || {};
                    const headerZona = `<div class="menu-wrapper-title fl-wrap" data-scrollax-parent="true" style=" ${marginTopStyle}">
                    <div class="menu-wrapper-title-item">
                        <h4 style="font-size: 42px; letter-spacing: 0.5px;"><span>${titolZona}</span></h4>
                    </div>
                    <div data-bg="${rutaImatgesZones}${imatgeZona}" class="bg par-elem" data-scrollax="properties: { translateY: '30%' }">
                    </div>                   
                    </div>`;
                    const vinsPerZonaGest = vinsPerZonaOrdenats[zona][0]
                        .sort((a, b) => a.ordre - b.ordre)
                        .map((item, index) => {
                            let puntuacions = '';
                            if (item.puntuacio_pr !== "0" || item.puntuacio_pe !== "0") {
                                puntuacions = `<div data-penin="${item.puntuacio_pe}" data-parker="${item.puntuacio_pr}" class="botoPunts"><img src="images/medalla.png" alt=""></div>`;
                            };
                            return `<div class="hero-menu-item">
                                    <a href="${rutaImatgesItems}${item.imatge}" class="hero-menu-item-img image-popup"><img src="${rutaImatgesItems}thumbnails/${item.imatge}" alt=""></a>
                                    <div class="hero-menu-item-title fl-wrap">
                                        <h6>${reemplazarApostrofe(item.nom)}</h6>
                                        <div class="hmi-dec"></div>
                                        <span class="hero-menu-item-price">${item.preu}</span>
                                        ${puntuacions}
                                    </div>                       
                                    <div class="hero-menu-item-details ${puntuacions !== '' ? `medalla` : ''}">
                                        <p class="denominacio">${item.denominacio}</p>
                                        <p>${reemplazarApostrofe(item[`descripcio_${idioma}`])}</p>
                                    </div>                      
                                    </div>`;
                        }).join('');
                    categoriaAfegirVins[categoria - 1] = categoriaAfegirVins[categoria - 1].concat(headerZona, vinsPerZonaGest);
                    isFirstElement = false;
                };
            } else {
                const vinsPerZonaGest = res.items
                    .sort((a, b) => a.ordre - b.ordre)
                    .filter(item => item.categoria === categoria)
                    .map((item, index) => {
                        let puntuacions = '';
                        if (item.puntuacio_pr !== "0" || item.puntuacio_pe !== "0") {
                            puntuacions = `<div data-penin="${item.puntuacio_pe}" data-parker="${item.puntuacio_pr}" class="botoPunts"><img src="images/medalla.png" alt=""></div>`;
                        };
                        return `<div class="hero-menu-item">
                            <a href="${rutaImatgesItems}${item.imatge}" class="hero-menu-item-img image-popup"><img src="${rutaImatgesItems}thumbnails/${item.imatge}" alt=""></a>
                            <div class="hero-menu-item-title fl-wrap">
                                <h6>${item.nom}</h6>
                                <div class="hmi-dec"></div>
                                <span class="hero-menu-item-price">${item.preu}</span>
                                ${puntuacions}
                            </div>                       
                            <div class="hero-menu-item-details ${puntuacions !== '' ? `medalla` : ''}">
                                <p class="denominacio">${item.denominacio}</p>
                                <p>${propietatsPerIdioma[`descripcionsItemsCategoria${categoria}`][index]}</p>
                            </div>                      
                            </div>`;
                    }).join('');
                categoriaAfegirVins[categoria - 1] = vinsPerZonaGest;
            };
        };
        categoriesCarta[objeto].forEach((_, index) => $(`#menu-section-${index + 1}`).append(categoriaAfegirVins[index]));
    };
    $("#any").text(new Date().getFullYear());
    initRestabook(divsToggleP, divsToggleA, idioma, PARADES, PRODUCCIO);
    initparallax();
};

//   all ------------------
function initRestabook(divsToggleP, divsToggleA, idioma, PARADES, PRODUCCIO) {
    "use strict";
    //   loader ------------------
    firstLoad();
    function firstLoad() {
        TweenMax.to($(".loader"), 1.5, {
            force3D: false,
            scale: "0",
            ease: Expo.easeInOut,
            onComplete: function () {
                $('.cd-loader-layer').addClass('closing');
                $("#main").animate({
                    opacity: 1
                }, 500);
                setTimeout(function () {
                    $(".loader-wrap").fadeOut(1);
                }, 1300);
            }
        });
    }
    //   Background image ------------------
    var a = $(".bg");
    a.each(function (a) {
        if ($(this).attr("data-bg")) $(this).css("background-image", "url(" + $(this).data("bg") + ")");
    });
    if ($(".header-cart_wrap_container").length > 0) {
        var aps = new PerfectScrollbar('.header-cart_wrap_container', {
            swipeEasing: true,
            minScrollbarLength: 20
        });
    };
    //   lightGallery------------------
    $(".image-popup").lightGallery({
        selector: "this",
        cssEasing: "cubic-bezier(0.25, 0, 0.25, 1)",
        download: false,
        counter: false
    });
    var o = $(".lightgallery"),
        p = o.data("looped");
    o.lightGallery({
        selector: ".lightgallery a.popup-image",
        cssEasing: "cubic-bezier(0.25, 0, 0.25, 1)",
        download: false,
        loop: false,
        counter: false
    });
    function menuDotsdec() {
        var hmtp = $(".hmi-dec");
        hmtp.each(function (hmtp) {
            $(this).css({
                left: $(this).parent(".hero-menu-item-title").find("h6").width() + 40 + "px"
            });
        });
    }
    menuDotsdec();
    //   tabs------------------
    $(".tabs-menu a").on("click", function (a) {
        a.preventDefault();
        $(this).parent().addClass("current");
        $(this).parent().siblings().removeClass("current");
        var b = $(this).attr("href");
        $(this).parents(".tabs-act").find(".tab-content").not(b).css("display", "none");
        $(b).fadeIn(1500);
        menuDotsdec();
    });
    // scroll animation ------------------
    $(window).on("scroll", function (a) {
        if ($(this).scrollTop() > 150) {
            $(".to-top").fadeIn(500);
        } else {
            $(".to-top").fadeOut(500)
        }
    });
    //   scroll to------------------
    $(".custom-scroll-link").on("click", function () {
        var a = 20;
        if (location.pathname.replace(/^\//, "") === this.pathname.replace(/^\//, "") || location.hostname === this.hostname) {
            var b = $(this.hash);
            b = b.length ? b : $("[name=" + this.hash.slice(1) + "]");
            if (b.length) {
                $("html,body").animate({
                    scrollTop: b.offset().top - a
                }, {
                    queue: false,
                    duration: 1200,
                    easing: "easeInOutExpo"
                });
                return false;
            }
        }
    });
    $(".to-top").on("click", function (a) {
        a.preventDefault();
        $("html, body").animate({
            scrollTop: 0
        }, 800);
        return false;
    });
    setLayerDimensions2();
    $(window).on('resize', function () {
        if (!resize2) {
            resize2 = true;
            (!window.requestAnimationFrame) ? setTimeout(setLayerDimensions2, 300) : window.requestAnimationFrame(setLayerDimensions2);
        }
    });
    $(".change_bg a").on("click", function () {
        transitionLayer2.addClass('visible opening');
        setTimeout(function () {
            transitionLayer2.removeClass('opening');
        }, 500);
        setTimeout(function () {
            transitionLayer2.addClass('closing');
            transitionBackground2.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
                transitionLayer2.removeClass('closing opening visible');
                transitionBackground2.off('webkitAnimationEnd oanimationend msAnimationEnd animationend');
            });
        }, 500);

        var bgt = $(this).data("bgtab");
        $(".bg_tabs").delay(600).queue(function (next) {
            $(this).css("background-image", "url(" + bgt + ")");
            next();
        });

    });
    $(".hero-menu-item").matchHeight({
        byRow: true,
    });
    setLayerDimensions3();
    $(window).on('resize', function () {
        if (!resize3) {
            resize3 = true;
            (!window.requestAnimationFrame) ? setTimeout(setLayerDimensions3, 300) : window.requestAnimationFrame(setLayerDimensions3);
        }
    });
    $(".botoParada0, .botoParada1, .botoParada2").on("click", function (e) {
        e.preventDefault();
        popupParades($(this).data('parada'), PARADES, idioma);
    });
    $(".botoProducte0, .botoProducte1, .botoProducte2").on("click", function (e) {
        e.preventDefault();
        popupProduccio($(this).data('producte'), PRODUCCIO, idioma);
    });
    $(".botoPunts").on("click", function (e) {
        e.preventDefault();
        popupPunts($(this).data('penin'), $(this).data('parker'));
    });
    $(".botoAlergens0, .botoAlergens1, .botoAlergens2, .botoAlergens3, .botoAlergens4").on("click", function (e) {
        e.preventDefault();
        popupAlergens($(this).data('alergen'), idioma);
    });
    $("#alergens").click(function () {
        $(this).toggleClass('alergens-activat');
        if ($(this).hasClass('alergens-activat')) {
            // toggle activado
            $("#imatge_alergens").attr("src", "images/alergens_actiu1.svg");
            $('.parada, .produccio').removeClass('mostrar');
            $('.parada, .produccio').addClass('ocultar');
            $('.descripcio').removeClass('marcadors1 marcadors2 marcadors3 marcadors4 marcadors5');
            divsToggleA.forEach(div => {
                $(`#des-${div.categoria}-${div.index}`).addClass(`marcadors${div.items}`);
            });
            $('.alergen').removeClass('ocultar');
            $('.alergen').addClass('mostrar');
        } else {
            // toggle desactivado
            $("#imatge_alergens").attr("src", "images/alergens1.svg");
            $('.alergen').addClass('ocultar');
            $('.alergen').removeClass('mostrar');
            $('.descripcio').removeClass('marcadors1 marcadors2 marcadors3 marcadors4 marcadors5');
            divsToggleP.forEach(div => {
                $(`#des-${div.categoria}-${div.index}`).addClass(`marcadors${div.items}`);
            });
            $('.parada, .produccio').removeClass('ocultar');
            $('.parada, .produccio').addClass('mostrar');
        };
    });
    function csselem() {
        $(".height-emulator").css({
            //modificador
            height: 120
        });
        $(".slideshow-container .slideshow-item").css({
            height: $(".slideshow-container").outerHeight(true)
        });
        $(".ms-item_fs").css({
            height: $(".multi-slideshow_fs").outerHeight(true)
        });
        $(".grid-carousel .swiper-slide").css({
            height: $(".grid-carousel").outerHeight(true)
        });
        $(".fs-slider-item").css({
            height: $(".fs-slider").outerHeight(true)
        });
    };
    csselem();
    // Mob Menu------------------
    $(".nav-button-wrap").on("click", function () {
        $(".main-menu").toggleClass("vismobmenu");
    });
    function mobMenuInit() {
        var ww = $(window).width();
        if (ww < 1048) {
            $(".menusb").remove();
            $(".main-menu").removeClass("nav-holder");
            $(".main-menu nav").clone().addClass("menusb").appendTo(".main-menu");
            $(".menusb").menu();
            $(".menusb.scroll-init a").on("click", function () {
                $(".main-menu").removeClass("vismobmenu");
            });
        } else {
            $(".menusb").remove();
            $(".main-menu").addClass("nav-holder");
        }
    }
    mobMenuInit();
    //   css ------------------
    var $window = $(window);
    $window.on("resize", function () {
        csselem();
        menuDotsdec();
        mobMenuInit();
    });
    $window.scroll(function () {
        if ($(this).scrollTop() > 150) {
            $("header.main-header").addClass("scroll-sticky");

        } else {
            $("header.main-header").removeClass("scroll-sticky");
        };
    });
    if ($(".fixed-bar").outerHeight(true) < $(".post-container").outerHeight(true)) {
        $(".fixed-bar").addClass("fixbar-action");
        $(".fixbar-action").scrollToFixed({
            minWidth: 1064,
            marginTop: function () {
                var a = $(window).height() - $(".fixed-bar").outerHeight(true) - 120;
                if (a >= 0) return 20;
                return a;
            },
            removeOffsets: true,
            limit: function () {
                var a = $(".limit-box").offset().top - $(".fixed-bar").outerHeight() + 30;
                return a;
            }
        });
    } else $(".fixed-bar").removeClass("fixbar-action");
    $(".gallery_filter-button").on("click", function () {
        $(".gth").slideToggle(400);
    });
    $(".scroll-init  ul").singlePageNav({
        filter: ":not(.external)",
        updateHash: false,
        offset: 80,
        threshold: 120,
        speed: 1200,
        currentClass: "act-scrlink"
    });
};

//   Parallax ------------------
function initparallax() {
    // var a = {
    //     Android: function () {
    //         return navigator.userAgent.match(/Android/i);
    //     },
    //     BlackBerry: function () {
    //         return navigator.userAgent.match(/BlackBerry/i);
    //     },
    //     iOS: function () {
    //         return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    //     },
    //     Opera: function () {
    //         return navigator.userAgent.match(/Opera Mini/i);
    //     },
    //     Windows: function () {
    //         return navigator.userAgent.match(/IEMobile/i);
    //     },
    //     any: function () {
    //         return a.Android() || a.BlackBerry() || a.iOS() || a.Opera() || a.Windows();
    //     }
    // };
    // trueMobile = a.any();
    // if (null === trueMobile) {
    //     var b = new Scrollax();
    //     b.reload();
    //     b.init();
    // }
    var b = new Scrollax();
    b.reload();
    b.init();
    //  if (trueMobile) $(".background-vimeo , .background-youtube-wrapper ").remove();
};

document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
});

//   Init All ------------------
$(document).ready(function () {
    cargaCartaPrincipal();
});