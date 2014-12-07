var sortableCard = angular.module('sortableCard', []);
sortableCard.factory('sortableCard', function() {
    var card = {};
    var cardsList = [];
    var cardDescriptionsList = $("#description-holder");
    var cardsListSelector = '.cards-stack';
    var defaultOptions = {
//        containment: '#cards-full',
        forcePlaceholderSize: false,
        placeholder: 'cards-stack cards-placeholder'
    };

    /**
     *
     * @param {Object} sortableCardEvents Should be like {start: function (event, ui) {}, stop: function (event, ui) {}}
     * @return {Object}
     */
    card.getDeckCards = function (sortableCardEvents) {
        defaultOptions.connectWith = '#cards-row';
        defaultOptions.start = function (event, ui) {
            if ('function' === typeof sortableCardEvents.start) {
                sortableCardEvents.start(event, ui);
            }
        };

        return angular.copy(defaultOptions);
    };

    /**
     * @param {Object} sortableCardEvents Should be like {start: function (event, ui) {}, stop: function (event, ui) {}}
     * @return {Object}
     */
    card.getRowCards = function (sortableCardEvents) {
        defaultOptions.start = function (event, ui) {
            if ('function' === typeof sortableCardEvents.start) {
                sortableCardEvents.start(event, ui);
            }
        };
        defaultOptions.update = function (event, ui) {
            if ('function' === typeof sortableCardEvents.update) {
                sortableCardEvents.update(event, ui);
            }
        };

        return angular.copy(defaultOptions);
    };

    /**
     * @param {Integer} index
     * @returns {{top: string, left: string}}
     */
    card.getCardPositionStyle = function (index) {
        var base = 10;
        var step = 2;
        var pos = base + step * index;

        return {
            'top': pos + 'px',
            'left': pos + 'px'
        }
    };

    /**
     * @param {int} index
     */
    card.blinkCardByIndex = function (index) {
        var card = null;
        if (0 === cardsList.length) {
            return;
        }

        card = cardsList.eq(index);
        if (card.length) {
            card.effect("pulsate", {easing: 'easeInOutCubic'}, 1000);
        }
    };

    /**
     * @param {int} index
     */
    card.getCardTextByIndex = function (index) {
        var card = null;
        if (0 === cardsList.length) {
            return '';
        }

        return cardsList.eq(index).text();
    };

    card.grabCards = function () {
        cardsList = $(cardsListSelector);
    };

    card.initClickEvent = function () {
        $(function () {

            $('#wrap').on('click', cardsListSelector, function (event) {
                event.preventDefault();
                var selectedClassName = 'selected';
                var target = event.target ? event.target : event.srcElement;
                var id = 0;

                if (target.attributes.getNamedItem('name')) {
                    id = target.attributes.getNamedItem('name').value;
                } else {
                    id = $(this).find('a').attr('name');
                }

                // Selected class toggling
                cardsList.removeClass(selectedClassName);
                $(this).addClass(selectedClassName);

                cardDescriptionsList.find('div').hide();
                $("#" + id).show();
            });
        });
    };

    return card;
}).filter('wbr', function () {
        return function (input) {
            return input.replace('-', '-<WBR>');
        }
    });
