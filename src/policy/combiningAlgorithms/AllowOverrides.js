class AllowOverrides {

  evaluate(individualResults) {
    if (individualResults.indexOf(true) !== -1) {
      return true;
    } else {
      if (individualResults.indexOf(false) !== -1) {
        return false;
      } else {
        return 'Not Applicable';
      }
    }
  }

}

export default AllowOverrides;
