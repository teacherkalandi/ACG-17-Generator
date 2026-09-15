export function numberToEnglish(n: number): string {
  const single = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
  ];
  const double = [
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const tens = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];

  if (n === 0) return 'Zero';

  function convertHundred(num: number): string {
    let str = '';
    if (num > 99) {
      str += single[Math.floor(num / 100)] + ' Hundred ';
      num %= 100;
    }
    if (num > 9 && num < 20) {
      str += double[num - 10] + ' ';
    } else {
      if (num > 19) {
        str += tens[Math.floor(num / 10)] + ' ';
        num %= 10;
      }
      if (num > 0) {
        str += single[num] + ' ';
      }
    }
    return str;
  }

  let word = '';
  if (n > 9999999) {
    word += convertHundred(Math.floor(n / 10000000)) + 'Crore ';
    n %= 10000000;
  }
  if (n > 99999) {
    word += convertHundred(Math.floor(n / 100000)) + 'Lakh ';
    n %= 100000;
  }
  if (n > 999) {
    word += convertHundred(Math.floor(n / 1000)) + 'Thousand ';
    n %= 1000;
  }
  if (n > 0) {
    word += convertHundred(n);
  }

  return word.trim();
}
