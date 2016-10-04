class BlockOverrides {

  evaluate(individualResults) {
    if (individualResults.indexOf(false) !== -1) {
      return false;
    } else {
      if (individualResults.indexOf(true) !== -1) {
        return true;
      } else {
        return 'Not Applicable';
      }
    }
  }

}

export default BlockOverrides;