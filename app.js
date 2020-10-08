const readline = require('readline');
const moment = require('moment');
const fs = require('fs');

let secInd, mSecInd, ySecInd, qSecInd, l;
let month, year, quarter;
let prevYear, yAmSum;
let prevMonth, mAmSum;
let prevQuarter, qAmSum;
let amount, sector;
let sAmSum = new Array();
let sectorArr = new Array();

let monSecArr = new Array();
let monSecAmSum = new Array();

let yearSecArr = new Array();
let yearSecAmSum = new Array();

let quarSecArr = new Array();
let quarSecAmSum = new Array();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//Budget File Processing
rl.question('', path => {
  let file = fs.readFileSync(path, 'ascii');
  let lines = file.split('\n');
  let line;
  let dataBud;
  let budgArr = new Array();
  for (let l = 1; l < lines.length; l++) {
    line = lines[l];
    budgArr.push(line);
    if (!line) {
      continue; // Ignore any empty line
    }
  }

  //Budget put in the form of array of strings
  //rowArr[0] -> 1st Budget Constraint
  //rowArr[1] -> 2nd Budget Constraint
  //...so on
  //   console.log(budgArr);

  //Investment File Processing
  rl.question('', path => {
    let file = fs.readFileSync(path, 'ascii');
    let lines = file.split('\n');

    for (l = 1; l < lines.length - 1; l++) {
      //Processing/Checking Budget Constraints of each investment line
      let line = lines[l];
      if (!line) {
        continue; // Ignore any empty line
      }
      let data = line.split(','); // Split the row into component fields
      sector = data[3];
      amount = parseInt(data[2]);
      let id = data[0];

      let budAmt, budTime, budTimeLen, budSectLen, budSect;
      let invest = 1;
      //Unzipping Budget Constraints from budget array, checking constraints one by one for each investment row
      for (let i = 0; i < budgArr.length; i++) {
        dataBud = budgArr[i].split(','); // Split the row into component fields
        //dataBud[1]=Budget Amount[i]
        //dataBud[2]=Budget Time Period[i](Month/Year/Quarter)
        //dataBud[3]=Budget Sector[i](arbitrary)
        budAmt = parseInt(dataBud[1]);

        budTime = dataBud[2];
        budTimeLen = dataBud[2].length;

        budSect = dataBud[3];
        budSectLen = dataBud[3].length;

        if (budTimeLen != 0) {
          switch (budTime) {
            case 'Month':
              //month wise processing
              month = moment(data[1], 'DD/MM/YYYY').month() + 1;

              if (l == 1 || prevMonth != month) {
                //sector Constraint doesnt exist
                if (budSectLen == 0) {
                  if (amount > budAmt) {
                    invest = 0;
                  }
                  //sector constraint exist
                } else {
                  //whether budget sector is equal to given sector
                  if (budSect == sector) {
                    if (amount > budAmt) {
                      invest = 0;
                    }
                  }
                }
              } else {
                if (prevMonth == month) {
                  //same month calculation
                  if (budSectLen == 0) {
                    if (mAmSum + amount > budAmt) {
                      invest = 0;
                    }
                  } else {
                    if (sector == budSect) {
                      mSecInd = monSecArr.indexOf(sector);
                      if (
                        mSecInd != -1 &&
                        monSecAmSum[mSecInd] + amount > budAmt
                      ) {
                        invest = 0;
                      }
                    }
                  }
                }
              }
              //Uncomment if you want to see output
              //   console.log('mAmSum: ' + mAmSum);
              //   console.log('monSecArr - ' + monSecArr);
              //   console.log('monSecAmSum - ' + monSecAmSum + '\n');
              break;

            case 'Year':
              //year wise calculation
              year = moment(data[1], 'DD/MM/YYYY').year();
              if (l == 1 || prevYear != year) {
                //sector Constraint doesnt exist
                if (budSectLen == 0) {
                  if (amount > budAmt) {
                    invest = 0;
                  }
                  //sector constraint exist
                } else {
                  //whether budget sector is equal to given sector
                  if (budSect == sector) {
                    if (amount > budAmt) {
                      invest = 0;
                    }
                  }
                }
              } else {
                if (prevYear == year) {
                  //same month calculation
                  if (budSectLen == 0) {
                    if (yAmSum + amount > budAmt) {
                      invest = 0;
                    }
                  } else {
                    if (sector == budSect) {
                      ySecInd = yearSecArr.indexOf(sector);
                      if (
                        ySecInd != -1 &&
                        yearSecAmSum[ySecInd] + amount > budAmt
                      ) {
                        invest = 0;
                      }
                    }
                  }
                }
              }
              //   console.log('yAmSum - ' + yAmSum);
              //   console.log('yearSecArr - ' + yearSecArr);
              //   console.log('yearSecAmSum - ' + yearSecAmSum + '\n');
              break;

            case 'Quarter':
              //quarter wise processing
              quarter = moment(data[1], 'DD/MM/YYYY').quarter();
              if (l == 1 || prevQuarter != quarter) {
                //sector Constraint doesnt exist
                if (budSectLen == 0) {
                  if (amount > budAmt) {
                    invest = 0;
                  }
                  //sector constraint exist
                } else {
                  //whether budget sector is equal to given sector
                  if (budSect == sector) {
                    if (amount > budAmt) {
                      invest = 0;
                    }
                    //if not equal sectors
                  }
                }
              } else {
                if (prevQuarter == quarter) {
                  //same month calculation
                  if (budSectLen == 0) {
                    if (qAmSum + amount > budAmt) {
                      invest = 0;
                    }
                  } else {
                    if (sector == budSect) {
                      qSecInd = quarSecArr.indexOf(sector);
                      if (
                        qSecInd != -1 &&
                        quarSecAmSum[qSecInd] + amount > budAmt
                      ) {
                        invest = 0;
                      }
                    }
                  }
                }
              }
              //   console.log('qAmSum - ' + qAmSum);
              //   console.log('quarSecArr - ' + quarSecArr);
              //   console.log('quarSecAmSum - ' + quarSecAmSum + '\n');
              break;

            default: // Do nothing
          }
        } else {
          //sectorwise Processing
          secInd = sectorArr.indexOf(sector);
          if (sector == budSect) {
            if (secInd != -1) {
              if (sAmSum[secInd] + amount > budAmt) {
                invest = 0;
              }
            } else {
              if (amount > budAmt) {
                invest = 0;
              }
            }
          }

          //   console.log('Sector -> ' + sector);
          //   console.log('sectorArr ->' + sectorArr);
          //   console.log('sAmSum ->' + sAmSum + '\n');
        }

        //invest == 0 then print id to console and stop checking other constraints
        if (!invest) {
          console.log(parseInt(id));
          break;
        }

        //FOR DISPLAYING BUDGET.CSV DATA
        // for (let j = 1; j < dataBud.length; j++) {
        //   console.log('data ' + j + ' -> ' + dataBud[j]);
        //   console.log('data ' + j + '.length -> ' + dataBud[j].length + '\n');
        // }
      }
      //passed all budget constraints, invest and save accordingly in month, year, quarter, sector calcuation
      if (invest) {
        //Month Calculation
        //Year Calculation
        //Quarter Calculation
        //Sector Calculation
        mSecInd = monSecArr.indexOf(sector);
        ySecInd = yearSecArr.indexOf(sector);
        qSecInd = quarSecArr.indexOf(sector);
        secInd = sectorArr.indexOf(sector);
        if (l == 1) {
          mAmSum = amount;
          monSecArr.push(sector);
          monSecAmSum.push(amount);

          yAmSum = amount;
          yearSecArr.push(sector);
          yearSecAmSum.push(amount);

          qAmSum = amount;
          quarSecArr.push(sector);
          quarSecAmSum.push(amount);

          sectorArr.push(sector);
          sAmSum.push(amount);
        } else {
          if (month == prevMonth) {
            mAmSum += amount;
            if (mSecInd == -1) {
              monSecArr.push(sector);
              monSecAmSum.push(amount);
            } else {
              monSecAmSum[mSecInd] += amount;
            }
          } else {
            mAmSum = amount;
            monSecArr = [];
            monSecAmSum = [];
            monSecArr.push(sector);
            monSecAmSum.push(amount);
          }
          if (year == prevYear) {
            yAmSum += amount;
            if (ySecInd == -1) {
              yearSecArr.push(sector);
              yearSecAmSum.push(amount);
            } else {
              yearSecAmSum[ySecInd] += amount;
            }
          } else {
            yAmSum = amount;
            yearSecArr = [];
            yearSecAmSum = [];
            yearSecArr.push(sector);
            yearSecAmSum.push(amount);
          }
          if (quarter == prevQuarter) {
            qAmSum += amount;
            if (qSecInd == -1) {
              quarSecArr.push(sector);
              quarSecAmSum.push(amount);
            } else {
              quarSecAmSum[qSecInd] += amount;
            }
          } else {
            qAmSum = amount;
            quarSecArr = [];
            quarSecAmSum = [];
            quarSecArr.push(sector);
            quarSecAmSum.push(amount);
          }
          if (secInd == -1) {
            sectorArr.push(sector);
            sAmSum.push(amount);
          } else {
            sAmSum[secInd] += amount;
          }
        }
        prevMonth = month;
        prevYear = year;
        prevQuarter = quarter;
      }
    }
    rl.close();
  });
});
