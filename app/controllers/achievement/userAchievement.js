
const User = require('../../models/user');
const Person = require('../../models/person');
const Company = require('../../models/company');
const Campaign = require('../../models/campaign');

const ACHIEVEMENTS = [];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Noviembre', 'Diciembre'];

ACHIEVEMENTS['baby_donor'] = {
  url: 'babydonor.png',
  title: 'Baby Donador',
  text: 'Por registrarte y ganar 100 pts.'
};


ACHIEVEMENTS['help_others'] = {
  url: 'helpothers.png',
  title: 'Yo ayudo a los démas',
  text: 'Por crear tu primera campaña o donar dinero'
};

ACHIEVEMENTS['photograph'] = {
  url: 'photograph.png',
  title: 'Fotografo',
  text: 'Por subir fotos'
};

ACHIEVEMENTS['expert_category'] = (category) => {return {
  url: 'expert_category.png',
  title: 'Experto en ' + category,
  text: 'Por donar más de dos veces en una categoría'
}};

ACHIEVEMENTS['global_donor'] = {
  url: 'global_donor.png',
  title: 'Donador Global',
  text: 'Por donar en más de 3 paises diferentes..'
};

ACHIEVEMENTS['critic'] = {
  url: 'critic.png',
  title: 'Critico',
  text: 'Por hacer valoraciones..'
};

ACHIEVEMENTS['thankful_ong'] = {
  url: 'thankful_ong.png',
  title: 'ONG Agradecida',
  text: 'Por agradecer a todas las personas donadoras..'
};

ACHIEVEMENTS['xmonth'] = (month) => {return {
  url: 'thankful_ong.png',
  title: 'Mes de ' + MONTHS[month],
  text: 'Por crear varias campañas en el mismo mes..'
}};

module.exports.addAchievement = (idUser) => {
  User.findById(idUser).populate(['donations.campaign', 'created_campaigns']).exec()
    .then((user) => {
      let titleAchievements = user.achievements.map((achievement) => {
        return achievement.title;
      });

      let nDonations = user.donations.length;
      //let nvolunteer = user.volunteer_campaigns.length;
      let nCreatedCampaigns = user.created_campaigns.length;
      let nPicturesUploaded = user.pictures_upload.length;
      let nReviews = user.reviews.length;


      if ((user.score <= 100) && (titleAchievements.indexOf(ACHIEVEMENTS['baby_donor'].title) < 0)) {
        user.achievements.push(ACHIEVEMENTS['baby_donor']);
      } else if ((user.donations.length === 1 || user.created_campaigns.length === 1) && (titleAchievements.indexOf(ACHIEVEMENTS['help_others'].title) < 0)) {
        user.achievements.push(ACHIEVEMENTS['help_others']);
      } else if (titleAchievements.indexOf(ACHIEVEMENTS['help_others'].title) > 0) {
        let helpOthersLevel = Math.floor(nDonations/2) + nCreatedCampaigns;
        user.achievements[user.achievements.findIndex(o => o.title === ACHIEVEMENTS['help_others'].title)].level = helpOthersLevel;
      }

      if (nCreatedCampaigns >= 4) {
        let createdMonths = user.created_campaigns.map(campaign => {
          return new Date(campaign.created_at).getMonth();
        });
        let monthsCount = createdMonths.reduce((a, b) => 
          Object.assign(a, {[b]: (a[b] || 0) + 1}), {});
        Object.keys(monthsCount).filter((a) => {
          if ((monthsCount[a] > 3) && (titleAchievements.indexOf(ACHIEVEMENTS['xmonth'](a).title) < 0)) {
            user.achievements.push(ACHIEVEMENTS['xmonth'](a));
          }
        });
      }

      if ((nPicturesUploaded >= 3) &&  (titleAchievements.indexOf(ACHIEVEMENTS['photograph'].title) < 0)) {
        user.achievements.push(ACHIEVEMENTS['photograph']);
      } else if (nPicturesUploaded > 3) {
        let photographerLevel = Math.floor(user.pictures_upload.length / 3);
        user.achievements[user.achievements.findIndex(o => o.title === ACHIEVEMENTS['photograph'].title)].level = photographerLevel;
      }

      if (nDonations >= 3) {
        let countries = user.donations.map(donation => {
          return donation.campaign.address.country;
        });

        let filterCountries = countries.filter((x, i, a) => a.indexOf(x) == i);

        if(filterCountries.length > 2) {
          if ((filterCountries.length >= 3) && (titleAchievements.indexOf(ACHIEVEMENTS['global_donor'].title) < 0)) {
            user.achievements.push(ACHIEVEMENTS['global_donor']);
          } else if(filterCountries.length > 3){
            let globalDonorLevel = Math.floor(filterCountries.length / 3);
            user.achievements[user.achievements.findIndex(o => o.title === ACHIEVEMENTS['global_donor'].title)].level = globalDonorLevel;
          }
        }
        let donationsCount = user.donations.reduce((a, b) =>
          Object.assign(a, {[b.campaign.category]: (a[b.campaign.category] || 0) + 1}), {});

        console.log("this is donatoinCount: " + donationsCount);
        Object.keys(donationsCount).filter((a) => {
          if (donationsCount[a] > 2) {
            if (titleAchievements.indexOf(ACHIEVEMENTS['expert_category'](a).title) < 0) {
              user.achievements.push(ACHIEVEMENTS['expert_category'](a));
            } else {
              let expertCategoryLevel = Math.floor(donationsCount[a] / 2);
              user.achievements[user.achievements.findIndex(o => o.title === ACHIEVEMENTS['expert_category'](a).title)].level = expertCategoryLevel;
            }
          }
        });
      }

      if (nReviews > 0) {
        if (titleAchievements.indexOf(ACHIEVEMENTS['critic'].title) < 0) {
          user.achievements.push(ACHIEVEMENTS['critic']);
        } else if (nReviews > 3) {
          let criticLevel = Math.floor(nReviews / 3);
          user.achievements[user.achievements.findIndex(o => o.title === ACHIEVEMENTS['critic'].title)].level = criticLevel;
        }
      }



      return user.save();
    })
    .catch((err) => {
      return err;
    });
}