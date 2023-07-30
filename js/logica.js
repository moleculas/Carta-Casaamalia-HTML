
const popupParades = (elId, PARADES, idioma) => {
    const parada = PARADES.find(par => par.id === elId);
    const aAfegirTitol = `<h2>${parada[`nom_${idioma}`]}</h2><h4>${parada[`subNom_${idioma}`] ? parada[`subNom_${idioma}`] : `<br />`}</h4>`;
    const rutaImatgesParades = (window.location.href.indexOf("casaamalia.com") > -1)
        ? `gestio/api/images/parades/`
        : `../api_casaamalia_v2/images/parades/`;
    const llistat = `<ul class="bxslider">${parada.imatges.imatges.map(imatge => `<li><img src="${rutaImatgesParades}${imatge}" /></li>`).join('')}</ul>`;
    $('#tittle-popup-plats').append(aAfegirTitol);
    $('#descripcio-popup-plats').append(parada[`descripcio_${idioma}`]);
    $('#section-slider_parades').append(llistat);
    $(`.reservation-modal-wrap`).addClass('senseSrollY');
    $(".reservation-modal-wrap").fadeIn(1);
    transitionLayer3.addClass('visible opening');
    $("html, body").addClass("hid-body");
    TweenMax.to($(".reservation-modal-container-plats"), 0.8, {
        force3D: true,
        y: "0",
        opacity: "1",
        ease: Power2.easeOut,
        onComplete: function () {
            $(`.reservation-modal-wrap`).removeClass('senseSrollY');
        }
    });
    $('.bxslider').bxSlider({
        mode: 'fade',
        captions: true,
        slideWidth: 650,
        touchEnabled: true,
        auto: true,
        autoDelay: 0,
        pause: 3000
    });
};

const popupProduccio = (elId, PRODUCCIO, idioma) => {
    const produccioItem = PRODUCCIO.find(prod => prod.id === elId);
    const aAfegirTitol = `<h2>${produccioItem[`nom_${idioma}`]}</h2><h4>${produccioItem[`subNom_${idioma}`] ? produccioItem[`subNom_${idioma}`] : `<br />`}</h4>`;
    const rutaImatgesProduccio = (window.location.href.indexOf("casaamalia.com") > -1)
        ? `gestio/api/images/produccio/`
        : `../api_casaamalia_v2/images/produccio/`;
    const llistat = `<ul class="bxslider">${produccioItem.imatges.imatges.map(imatge => `<li><img src="${rutaImatgesProduccio}${imatge}" /></li>`).join('')}</ul>`;
    $('#tittle-popup-plats').append(aAfegirTitol);
    $('#descripcio-popup-plats').append(produccioItem[`descripcio_${idioma}`]);
    $('#section-slider_parades').append(llistat);
    $(`.reservation-modal-wrap`).addClass('senseSrollY');
    $(".reservation-modal-wrap").fadeIn(1);
    transitionLayer3.addClass('visible opening');
    $("html, body").addClass("hid-body");
    TweenMax.to($(".reservation-modal-container-plats"), 0.8, {
        force3D: true,
        y: "0",
        opacity: "1",
        ease: Power2.easeOut,
        onComplete: function () {
            $(`.reservation-modal-wrap`).removeClass('senseSrollY');
        }
    });
    $('.bxslider').bxSlider({
        mode: 'fade',
        captions: true,
        slideWidth: 650,
        touchEnabled: true,
        auto: true,
        autoDelay: 0,
        pause: 3000
    });
};

const popupPunts = (penin, parker) => {
    const imagesPe = {
        "90": "90_pe.png",
        "91": "91_pe.png",
        "92": "92_pe.png",
        "93": "93_pe.png",
        "94": "94_pe.png",
        "95": "95_pe.png",
        "96": "96_pe.png",
        "97": "97_pe.png",
    };
    const imagesPr = {
        "90": "90_pr.png",
        "91": "91_pr.png",
        "92": "92_pr.png",
        "93": "93_pr.png",
        "94": "94_pr.png",
        "94_2": "94_2_pr.png",
        "95": "95_pr.png",
        "96": "96_pr.png",
        "97": "97_pr.png",
    };
    const aAfegirImatgePe = imagesPe[penin] ? `<img class="imatges_puntuacio" style="padding-right: 15px" src="images/puntuacions/${imagesPe[penin]}" />` : '';
    const aAfegirImatgePr = imagesPr[parker] ? `<img class="imatges_puntuacio" style="padding-left: 15px" src="images/puntuacions/${imagesPr[parker]}" />` : '';
    const aAfegirTitol = '<h2>Puntuación</h2><br />';
    const aAfegirImatge = aAfegirImatgePe + aAfegirImatgePr;
    $('#tittle-popup-vins').append(aAfegirTitol);
    $('#section-imatges_puntuacio').append(aAfegirImatge);
    $(`.reservation-modal-wrap`).addClass('senseSrollY');
    $(".reservation-modal-wrap").fadeIn(1);
    transitionLayer3.addClass('visible opening');
    $("html, body").addClass("hid-body");
    TweenMax.to($(".reservation-modal-container-vins"), 0.8, {
        force3D: true,
        y: "0",
        opacity: "1",
        ease: Power2.easeOut,
        onComplete: function () {
            $(`.reservation-modal-wrap`).removeClass('senseSrollY');
        }
    });
};

const popupAlergens = (id, idioma) => {
    const alergen = ALERGENS.find((item) => item.id === id);
    const header = `<div class="header-alergens">
    <img src="images/alergens/${alergen.imatge}" alt="" style="width: 100px">
    <div style="margin-bottom: -10px">
    <h2 style="text-align: left;">${alergen[`nom_${idioma}`]}</h2>
    <h4 style="text-align: left;">${alergen[`subNom_${idioma}`]}</h4>
    </div>
    </div>`;
    $('#tittle-popup-plats').append(header);
    $('#descripcio-popup-plats').append(alergen[`descripcio_${idioma}`]);
    $(`.reservation-modal-wrap`).addClass('senseSrollY');
    $(".reservation-modal-wrap").fadeIn(1);
    transitionLayer3.addClass('visible opening');
    $("html, body").addClass("hid-body");
    TweenMax.to($(".reservation-modal-container-plats"), 0.8, {
        force3D: true,
        y: "0",
        opacity: "1",
        ease: Power2.easeOut,
        onComplete: function () {
            $(`.reservation-modal-wrap`).removeClass('senseSrollY');
        }
    });
};

$(".crm").on("click", function () {
    const itemMap = {
        "plats": "plats",
        "vins": "vins"
    };
    hideResForm(itemMap[$(this).data('value')]);
    setTimeout(function () {
        $("#reserv-message").slideUp(1500);
        $('.chosen-select').niceSelect('update');
    }, 1500);
});

const hideResForm = (item) => {
    $("html, body").removeClass("hid-body");
    $(`.reservation-modal-wrap`).addClass('senseSrollY');
    TweenMax.to($(`.reservation-modal-container-${item}`), 0.6, {
        force3D: true,
        y: "50px",
        opacity: "0",
        ease: Power2.easeOut,
        onComplete: function () {
            transitionLayer3.addClass('closing');
            transitionBackground3.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
                transitionLayer3.removeClass('closing opening visible');
                transitionBackground3.off('webkitAnimationEnd oanimationend msAnimationEnd animationend');
                $(".reservation-modal-wrap").delay(100).fadeOut(400);
                if ($('#vins_es').length || $('#vins_ca').length || $('#vins_en').length || $('#vins_fr').length) {
                    buidaDivsVins();
                } else {
                    buidaDivsCarta();
                };              
            });
        }
    });
};

const buidaDivsCarta = () => {
    $("#tittle-popup-plats").empty();
    $("#descripcio-popup-plats").empty();
    $("#descripcio-popup-plats-alergens").empty();
    $("#section-slider_parades").empty();
};

const buidaDivsVins = () => {
    $("#tittle-popup-vins").empty();
    $("#section-imatges_puntuacio").empty();
};

let transitionLayer3 = $('.cd-reserv-overlay-layer'),
    transitionBackground3 = transitionLayer3.children(),
    frameProportion3 = 1.78,
    frames3 = transitionLayer3.data('frame'),
    resize3 = false;

const setLayerDimensions3 = () => {
    var windowWidth = $(window).width(),
        windowHeight = $(window).height(),
        layerHeight, layerWidth;
    if (windowWidth / windowHeight > frameProportion3) {
        layerWidth = windowWidth;
        layerHeight = layerWidth / frameProportion3;
    } else {
        layerHeight = windowHeight * 1.2;
        layerWidth = layerHeight * frameProportion3;
    };
    transitionBackground3.css({
        'width': layerWidth * frames + 'px',
        'height': layerHeight + 'px',
    });
    resize2 = false;
};

let transitionLayer2 = $('.cd-tabs-layer'),
    transitionBackground2 = transitionLayer2.children(),
    frameProportion2 = 1.78,
    frames2 = transitionLayer2.data('frame'),
    resize2 = false;

const setLayerDimensions2 = () => {
    var windowWidth = $(window).width(),
        windowHeight = $(window).height(),
        layerHeight, layerWidth;
    if (windowWidth / windowHeight > frameProportion2) {
        layerWidth = windowWidth;
        layerHeight = layerWidth / frameProportion2;
    } else {
        layerHeight = windowHeight * 1.2;
        layerWidth = layerHeight * frameProportion2;
    };
    transitionBackground2.css({
        'width': layerWidth * frames + 'px',
        'height': layerHeight + 'px',
    });
    resize2 = false;
};