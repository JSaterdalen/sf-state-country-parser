#!/usr/bin/env node

import fs from 'fs';
import papa from 'papaparse';
import xml2js from 'xml2js';

async function parseXML() {
    const filePath = './force-app/main/default/settings/Address.settings-meta.xml';
    // read file Address.settings-meta.xml and parse it
    const file = fs.readFileSync(filePath);
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(file);

    // get the countries and states
    const countriesAndStates = result.AddressSettings.countriesAndStates[0].countries;

    // create an array of states
    const states = [];
    countriesAndStates.forEach((country) => {
        if (country.states) {
            country.states.forEach((state) => {
                states.push(
                    new State(
                        state.active[0],
                        state.integrationValue[0],
                        state.isoCode[0],
                        state.label[0],
                        state.standard[0],
                        state.visible[0],
                        country.label[0],
                        country.isoCode[0]
                    )
                );
            });
        }
    });

    const countries = [];
    countriesAndStates.forEach((country) => {
        countries.push(
            new Country(
                country.active[0],
                country.integrationValue[0],
                country.isoCode[0],
                country.label[0],
                country.standard[0],
                country.visible[0]
            )
        );
    });

    // create csv files
    fs.mkdirSync('./sf-state');
    const csv = papa.unparse(states);
    fs.writeFileSync('./sf-state/states.csv', csv);
    const csv2 = papa.unparse(countries);
    fs.writeFileSync('./sf-state/countries.csv', csv2);
}

parseXML();

class State {
    constructor(active, integrationValue, isoCode, label, standard, visible, country, countryCode) {
        this.active = active;
        this.integrationValue = integrationValue;
        this.isoCode = isoCode;
        this.label = label;
        this.standard = standard;
        this.visible = visible;
        this.country = country;
        this.countryCode = countryCode;
    }
}

class Country {
    constructor(active, integrationValue, isoCode, label, standard, visible) {
        this.active = active;
        this.integrationValue = integrationValue;
        this.isoCode = isoCode;
        this.label = label;
        this.standard = standard;
        this.visible = visible;
    }
}
