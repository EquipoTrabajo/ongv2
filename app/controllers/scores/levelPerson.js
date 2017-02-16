const Person = require('../../models/person');

const LEVELS_PERSON = [];
LEVELS_PERSON[0] = 'Donador Baby';
LEVELS_PERSON[1] = 'Donador Junior';
LEVELS_PERSON[2] = 'Donador Escudero';
LEVELS_PERSON[3] = 'Donador Caballero';
LEVELS_PERSON[4] = 'Donador Rey';

module.exports.updateLevelPerson = (idUser) => {
  let personScore = null;
  Person.findById(idUser).exec()
    .then((person) => {
      if (person.score < 6000) {
        person.level = LEVELS_PERSON[0];

      } else if (person.score < 12000) {
        person.level = LEVELS_PERSON[1];

      } else if (person.score < 20000) {
        person.level = LEVELS_PERSON[2];

      } else if (person.score < 30000) {
        person.level = LEVELS_PERSON[3];

      } else if (person.score > 30000) {
        person.level = LEVELS_PERSON[4];
      }

      return person.save();
    })
    .catch((err) => {
      return err;
    });
}