var command = function (key, query) {
    'use strict';
    this.Google = {
        link : 'https://www.google.com/search?q='
    };
    this.Wikipedia = {
        link :  'https://fr.wikipedia.org/wiki/'
    };
    this.mail = {
        response_voice: '',
        link : 'https://gmail.com/'
    };
    this.Facebook = {
        link : 'https://facebook.com/'
    };

    function action(link, query, reponse) {
        window.open(link + query, "_blank");
        reponsePos();
        lisenMode = 0;
    }

    switch (key) {
        case 'Google':
            action(this.Google.link, query, this.Google.response_voice);
            break;
        case 'Wikipédia':
            action(this.Wikipedia.link, query, this.Wikipedia.response_voice);
            break;
        case 'mail':
            action(this.mail.link, query, this.mail.response_voice);
            break;
        case 'Facebook':
            action(this.Facebook.link, query, this.Facebook.response_voice);
            break;
        case 'Sens de la vie':
            action(this.Facebook.link, query, this.Facebook.response_voice);
            break;
        default:
            reponseNeg();
            lisenMode = 0;
            return;
    }

};
