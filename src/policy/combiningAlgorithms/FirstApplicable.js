class FirstApplicable {

  evaluate(individualResults) {
    for (let i in individualResults) {
      if (individualResults[i] !== 'Not Applicable') {
        return individualResults[i];
      }
    }
    return 'Not Applicable';
  }

}

export default FirstApplicable;
