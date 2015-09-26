var langUtils = {};

langUtils.number2words = function(number, gender) {
  var val;
  if (gender === 'neuter') {
    switch(number) {
      case 2:
        val = 'Tvö';
        break;
      case 3:
        val = 'Þrjú';
        break;
      case 4:
        val = 'Fjögur';
        break;
      case 5:
        val = 'Fimm';
        break;
      case 6:
        val = 'Sex';
        break;
      case 7:
        val = 'Sjö';
        break;
      case 8:
        val = 'Átta';
        break;
      case 9:
        val = 'Níu';
        break;
      default:
        val = String(number);
        break;
    }
  } else {
    switch(number) {
      case 2:
        val = 'Tveir';
        break;
      case 3:
        val = 'Þrír';
        break;
      case 4:
        val = 'Fjórir';
        break;
      case 5:
        val = 'Fimm';
        break;
      case 6:
        val = 'Sex';
        break;
      case 7:
        val = 'Sjö';
        break;
      case 8:
        val = 'Átta';
        break;
      case 9:
        val = 'Níu';
        break;
      default:
        val = String(number);
        break;
    }
  }
  return val;
};

module.exports = langUtils;
