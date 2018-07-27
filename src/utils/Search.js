class Search {

  constructor(discovery, identityManager) {

    if (!discovery) throw new Error('The discovery component is a needed parameter');
    if (!identityManager) throw new Error('The identityManager component is a needed parameter');

    let _this = this;

    _this.discovery = discovery;
    _this.identityManager = identityManager;

  }

  myIdentity() {
    let _this = this;

    return new Promise(function(resolve, reject) {

      _this.identityManager.discoverUserRegistered().then((result) => {
        resolve(result);
      }).catch((reason) => {
        reject(reason);
      });

    });

  }

  hyperties(users, schemes, resources, globalFlag = false) {
    //TODO: reuse users or the other way around

  }

  /**
   * List of usersURL to search
   * @param  {array<URL.userURL>}  users List of UserUR, like this format user://<ipddomain>/<user-identifier>
   * @return {Promise}
   */
  users(usersURLs, providedDomains, schemes, resources, globalFlag = false) {

    if (!usersURLs) throw new Error('You need to provide a list of users');
    if (!providedDomains) throw new Error('You need to provide a list of domains');
    if (!resources) throw new Error('You need to provide a list of resources');
    if (!schemes) throw new Error('You need to provide a list of schemes');

    let _this = this;

    return new Promise(function(resolve, reject) {

      console.info('[Search] Users: ', usersURLs, usersURLs.length);
      console.info('[Search] Domains: ', providedDomains, providedDomains.length);
      if (usersURLs.length === 0) {
        console.info('Don\'t have users to discovery');
        resolve(usersURLs);
      } else {
        let getUsers = [];

        usersURLs.forEach((userURL, index) => {
          let currentDomain = providedDomains[index];
          console.info('[Search] Search user ' + userURL + ' for provided domain:', currentDomain);
          if (!globalFlag) {
            getUsers.push(_this.discovery.discoverHyperties(userURL, schemes, resources, currentDomain));
          } else {
            getUsers.push(_this.discovery.discoverHypertiesPerUserProfileData(userURL, schemes, resources));
          }

        });

        console.info('Requests promises: ', getUsers);

        Promise.all(getUsers.map((promise) => {
          return promise.then((hyperty) => { return hyperty; }, (error) => { return error; });
        })).then((hyperties) => {

          console.info('[Search] Hyperties from new Discovery', hyperties);
          let result = hyperties.map(function(hyperty) {

            if (hyperty.hasOwnProperty('hypertyID'))
              return hyperty;
            let recent = Object.keys(hyperty).reduceRight(function(a, b) {
              let hypertyDate = new Date(hyperty[b].lastModified);
              let hypertyDateP = new Date(hyperty[a].lastModified);
              if (hypertyDateP.getTime() < hypertyDate.getTime()) {
                return b;
              }
              return a;
            });

            return hyperty[recent];
          });

          let clean = result.filter((hyperty) => {
            return hyperty.hasOwnProperty('hypertyID');
          });

          console.log('Requests result: ', clean);

          hyperties.forEach(function(entry) {
            if (entry !== 'No Hyperty was found') {
              return resolve(clean);
            }
          });

          reject('No Hyperty was found');

        }).catch((reason) => {
          console.error(reason);
          resolve(usersURLs);
        });
      }
    });
  }
}

export default Search;
