
//Esittää tämän hetkisen päivämäärän
var pvm = new Date();

var kuukausi = pvm.getMonth()+1;
var paiva = pvm.getDate();

var tulostus = (paiva<10 ? '0' : '') + paiva + '.' + (kuukausi<10 ? '0' : '') + kuukausi + '.' + pvm.getFullYear();

$('#pvm').append(tulostus);

//Hakee teatteriden sijainnit
function haeTeatterit() {
    $.ajax({
        'url': 'https://www.finnkino.fi/xml/TheatreAreas/',
        'dataType': 'xml',
        'success': onHaeTeatterit
    });
}

//Näyttää id:n mukaan listan dropdownissa
function onHaeTeatterit(xml) {
    document.getElementById("mypudotuspalkki").classList.toggle("show");

    var teatterit = {};

    $(xml).find('TheatreArea').each(function () {
        var id = $(this).find('ID').text();
        var nimi = $(this).find('Name').text();

        teatterit[id] = nimi;

        var teatteri = {};
        teatteri.nimi = nimi;
        teatteri.id = id;
        
        $('#mypudotuspalkki').append('<option id="'+id+'">'+nimi+'</option>');       

    });
}

$('#mypudotuspalkki').change(function() {
    var id2 = $(this).children(":selected").attr("id");
    getHakuElokuvat(id2);
});

//Ajax call, haetaan aikataulu ja alueet
function getHakuElokuvat(theatreId) {
    $.ajax({
          'url': 'https://www.finnkino.fi/xml/Schedule/?area='+theatreId+'&dt='+tulostus,
          'dataType': 'xml',
          'success': onHakuData
    });
}



//Tallennettu tiedot muuttujiin, joita käytämme tiedon esittämiseen sivullamme
function onHakuData(xml) {
    $('#elokuvat1').empty();
    $(xml).find('Show').each(function() {
        var otsikko = $(this).find('Title').text();
        var otsikkoenglanniksi = $(this).find('OriginalTitle').text();
        var luokka = $(this).find('Genres').text();
        var kuva = $(this).find('EventSmallImagePortrait').text();
        var alkuAika = $(this).find('dttmShowStart').text();
        var loppuAika = $(this).find('dttmShowEnd').text();
        
        var elokuva = {};
        elokuva.otsikko = otsikko;
        elokuva.otsikkoenglanniksi = otsikkoenglanniksi;
        elokuva.luokka = luokka;
        elokuva.kuva = kuva;
        elokuva.alkuAika = alkuAika;
        elokuva.loppuAika = loppuAika;
        var alkuAikaNew = alkuAika.slice(11, 16);
        var loppuAikaNew = loppuAika.slice(11, 16);
        elokuva.alkuAikaNew = alkuAikaNew;
        elokuva.loppuAikaNew = loppuAikaNew
        
        $('#myluokka').change(function() {
            var genre2 = $(this).children(":selected").attr("id");
            getHakuGenres(genre2);
        });
        
        //Functio tietojen näyttämiselle sivulla
		//tekstiä klikatteassa menee finkinon näytösajat sivulle
        function getHakuGenres(genre3){
            if (luokka.includes(genre3)) {
            $('#elokuvat1').append('<img src="'+kuva+'"><br><a href="https://www.finnkino.fi/elokuvat/naytosajat" target="_blank"<h3>'+otsikko+' - <i>'+otsikkoenglanniksi+'</i> </h3></a><p>Luokka : '+luokka+'<br> Aika: '+alkuAikaNew+' - '+loppuAikaNew+'</p><hr>');
            } 
        }
        
    });
}
//kutsutaan functioita
haeTeatterit();
getHakuElokuvat();