module.exports = {
    MMSS: function (miliseconds) {

        let total = Math.floor(miliseconds / 1000),
            horas = Math.floor(total / 60 / 60),
            tmp = Math.floor(total / 60),
            minutos = Math.floor(total / 60 - horas * 60),
            segundos = Math.floor(total - (tmp * 60));

        let time = '';


        if (horas > 9) time += `${horas}:`
        else if (horas > 0 && horas < 10) time += `0${horas}:`

        if (minutos > 9) time += `${minutos}:`
        else if (minutos > 0 && minutos < 10) time += `0${minutos}:`
        else time += `00:`

        if (segundos > 9) time += `${segundos}`
        else time += `0${segundos}`

        return time;
    },
    toMiliseconds: function (object) {

        delete object.weeks
        delete object.months
        delete object.years

        const converters = {
            days: value => value * 864e5,
            hours: value => value * 36e5,
            minutes: value => value * 6e4,
            seconds: value => value * 1e3,
            milliseconds: value => value
        };

        let toReturn = 0;
        Object.entries(object).reduce((milliseconds, [key, value]) => {
            if (typeof value !== 'number') {
                console.error('35')
            }

            if (!converters[key]) {
                throw new Error('Unsupported time key');
            }
            toReturn = toReturn + converters[key](value)
        }, 0);

        return toReturn;

    }
}