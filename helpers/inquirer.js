const inquirer = require('inquirer');
require('colors');

// Main menu options
const menuQns =  [
    {
        type: 'list',
        name: 'option',
        message: 'What you want to do?',
        choices: [ {
            name: `${'1.'.green} Search city`,
            value: 1
        },{
            name: `${'2.'.green} History`,
            value: 2
        },{
            name: `${'0.'.green} Exit`,
            value: 0
        }
        ],
    }
]


// Main menu
const inquirerMenu = async () => {
    console.clear();

    console.log( '=========================='.green );
    console.log( '    Select an option' );
    console.log( '==========================\n'.green );

    const { option } = await  inquirer.prompt( menuQns );

    return option

}

const pause = async () => {
    const qn = [ {
        type: 'input',
        name: 'pause', // Not used, only to satisfy question format
        message: `Press ${ 'ENTER'.green } to continue.\n`
    } ];

    console.log( '\n' );
    return inquirer.prompt( qn );
}

const readInput = async ( message ) => {

    const question = [ {
        type: 'input',
        name: 'readingInput',
        message,
        validate( value ) {
            if (value.length === 0 ) {
                return 'Please give an entry'
            }
            return true
        }
    } ];

    const { readingInput } = await inquirer.prompt( question );

    return readingInput;

}

const listCities = async ( places = [] ) => {

    const choices = places.map(( place, i ) => {
        const idx = `${ i + 1 }.`.green;

        return {
            value: place.id,
            name: `${ idx } ${ place.name }`
        }
    });

    choices.unshift({
        value: 0,
        name: '0. '.green + 'Cancel'
    });

    const questions = [
        {
            type: 'list',
            name: 'id',
            message: 'Select a place: ',
            choices,
            loop: false
        }
    ];

    const { id } = await inquirer.prompt(questions);
    return id;
}

module.exports = {
    inquirerMenu,
    pause,
    readInput,
    listCities
}