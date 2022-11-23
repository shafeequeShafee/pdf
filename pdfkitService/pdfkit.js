const PDFDocument = require("pdfkit-table");
const fs = require("fs")

function renderHeader(data, doc) {
  doc.font('Helvetica-Bold').fontSize(18).fillColor("#043244;").text("Spave Transaction History", { align: 'center' });
  doc.moveDown();
  doc.moveTo(30, 60)
    .lineTo(565, 60)
    .fillAndStroke("#043244;")
    .stroke();

  doc.moveTo(30, 108)
    .lineTo(565, 108)
    .fillAndStroke("#043244;")
    .stroke();

  // -----------------------------------------------------------------------------------------------------


  doc.fontSize(12).fillColor("black")
  doc.font('Helvetica-Bold').fillColor("#043244;").text(`Name :`, 30, 70, { align: 'left' });
  doc.font('Helvetica-Bold').fillColor("#000000").text(` ${data.header.name}`, 73, 70, { align: 'left' });
  doc.fillColor("#043244;").text(`Account Start`, 245, 70, { align: 'center' });
  doc.fillColor("#043244;").text(`Account Close`, 450, 70, { align: 'center' });


  doc.fillColor("#043244;").text(`Spave Account :`, 30, 90, { align: 'left' });
  doc.fillColor("#000000").text(` ${data.header.accountNumber}`, 128, 90, { align: 'left' });
  doc.fillColor("#000000").text(`${toUsDateFormat(data.header.sd)}`, 225, 90, { align: 'center' });
  doc.fillColor("#000000").text(`${toUsDateFormat(data.header.ed)}`, 425, 90, { align: 'center' });

  return doc
}


function renderTransactionTable(data, doc) {
  doc.font('Helvetica-Bold').fontSize(12).fillColor("#000000").text("Transactions", 36, 130, { align: 'center' });
  doc.text("", 30, 160).fillColor('##ffffff')


  var rowTransactions = [];
  data.transactions.forEach((item, i) => {
    let row = [i + 1, toPascalCase(item.merchant), `${transactionDateFormat(item.postDate)}`, `$ ${Number(item.amount).toFixed(2)}`, `$ ${Number(item.spavings.given).toFixed(2)}`, `$ ${Number(item.spavings.saved).toFixed(2)}`]
    rowTransactions.push(row);
  })
  let rowTotal = ["", "Total", "", `$ ${Number(data.totalSpent).toFixed(2)}`, `$ ${Number(data.totalGiven).toFixed(2)}`, `$ ${Number(data.totalSaved).toFixed(2)}`]
  rowTransactions.push(rowTotal)
  const TransactionTableArray = {
    headers: [
      { label: "No", headerColor: "#043244;", headerOpacity: 1 },
      { label: "Merchant", headerColor: "#043244;", headerOpacity: 1 },
      { label: "Date", headerColor: "#043244;", headerOpacity: 1 },
      { label: "Trans Amt", headerColor: "#043244;", headerOpacity: 1 },
      { label: "Giving Amt", headerColor: "#043244;", headerOpacity: 1 },
      { label: "Saved Amt", headerColor: "#043244;", headerOpacity: 1 }

    ],
    rows: rowTransactions,
  };
  doc.table(TransactionTableArray, {
    columnSpacing: 10,
    padding: 5,
    align: "center",
    columnsSize: [45, 145, 75, 90, 90, 90],
    prepareHeader: () => {
      doc.font('Helvetica-Bold').fontSize(12).fillAndStroke("#ffffff")
    },
    prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
      doc.font('Helvetica-Bold').fontSize(12).fillAndStroke("#000000")
      const { x, y, width, height } = rectCell;
      // first line 
      if (indexColumn === 0) {
        doc
          .lineWidth(.5)
          .moveTo(x, y)
          .lineTo(x, y + height)
          .stroke();
      }
      doc
        .lineWidth(.5)
        .moveTo(x + width, y)
        .lineTo(x + width, y + height)
        .stroke();
      doc.font("Helvetica").fontSize(12);
      indexColumn === 0 && doc.addBackground(rectRow, (indexRow % 2 ? '#dddddd' : 'white'), 0.30);
      indexRow === data.transactions.length && doc.font('Helvetica-Bold')
    },
  });
  doc.moveDown();
  return doc
}


function renderGivingsTable(data, doc) {
  doc.font('Helvetica-Bold').fontSize(12).fillColor("#000000").text("Givings", { align: 'center' });
  doc.moveDown();
  var rowGivings = [];
  data.givings.forEach((item, i) => {
    let row = [i + 1, toPascalCase(item.name), spavingDateFormat(item.date.toString()), `$ ${Number(item.total).toFixed(2)}`]
    rowGivings.push(row);
  })
  let rowTotal = ["", "Total", "", `$ ${Number(data.givingTotal).toFixed(2)}`]
  rowGivings.push(rowTotal)
  const givingTablearray = {
    headers: [
      { label: "No", headerColor: "#043244;", headerOpacity: 1 },
      { label: "Charity", headerColor: "#043244;", headerOpacity: 1 },
      { label: "Month/Year", headerColor: "#043244;", headerOpacity: 1 },
      { label: "Amt", headerColor: "#043244;", headerOpacity: 1 }
    ],
    rows: rowGivings
  };
  doc.table(givingTablearray, {
    columnSpacing: 10,
    padding: 5,
    align: "center",
    columnsSize: [45, 250, 90, 150],
    prepareHeader: () => doc.font('Helvetica-Bold').fontSize(12).fillAndStroke("#ffffff"),
    prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
      doc.font('Helvetica-Bold').fontSize(12).fillAndStroke("#000000")
      const { x, y, width, height } = rectCell;
      // first line 
      if (indexColumn === 0) {
        doc
          .lineWidth(.5)
          .moveTo(x, y)
          .lineTo(x, y + height)
          .stroke();
      }
      doc
        .lineWidth(.5)
        .moveTo(x + width, y)
        .lineTo(x + width, y + height)
        .stroke();
      doc.font("Helvetica").fontSize(12);
      indexColumn === 0 && doc.addBackground(rectRow, (indexRow % 2 ? '#dddddd' : 'white'), 0.30);
      indexRow === data.givings.length && doc.font('Helvetica-Bold')
    }
  });
  doc.moveDown();
  return doc

}

function renderSavingsTable(data, doc) {
  doc.font('Helvetica-Bold').fontSize(12).fillColor("#000000").text("Savings", { align: 'center' });
  doc.moveDown();
  var rowSavings = [];
  data.savings.forEach((item, i) => {
    let row = [i + 1, toPascalCase(item.bankName), spavingDateFormat(item.date.toString()), `$ ${Number(item.total).toFixed(2)}`]
    rowSavings.push(row);
  })
  let rowTotal = ["", "Total", "", `$ ${Number(data.savingsTotal).toFixed(2)}`]
  rowSavings.push(rowTotal)
  const savingsTableArray = {
    headers: [
      { label: "No", headerColor: "#043244;", headerOpacity: 1 },
      { label: "Institution", headerColor: "#043244;", headerOpacity: 1 },
      { label: "Month/Year", headerColor: "#043244;", headerOpacity: 1 },
      { label: "Amt", headerColor: "#043244;", headerOpacity: 1 }
    ],
    rows: rowSavings,
  };
  doc.table(savingsTableArray, {
    columnSpacing: 10,
    padding: 5,
    align: "center",
    columnsSize: [45, 250, 90, 150],
    prepareHeader: () => doc.font('Helvetica-Bold').fontSize(12).fillAndStroke("#ffffff"),
    prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
      doc.font('Helvetica-Bold').fontSize(12).fillAndStroke("#000000")
      const { x, y, width, height } = rectCell;
      // first line 
      if (indexColumn === 0) {
        doc
          .lineWidth(.5)
          .moveTo(x, y)
          .lineTo(x, y + height)
          .stroke();
      }
      doc
        .lineWidth(.5)
        .moveTo(x + width, y)
        .lineTo(x + width, y + height)
        .stroke();

      doc.font("Helvetica").fontSize(12);
      indexColumn === 0 && doc.addBackground(rectRow, (indexRow % 2 ? '#dddddd' : 'white'), 0.30);
      indexRow === data.savings.length && doc.font('Helvetica-Bold')

    }
  });
  doc.moveDown();
  return doc
}

async function convertToPdf(data) {
  return new Promise((resolve, reject) => {
    let doc = new PDFDocument({ margin: 30, size: 'A4' });
    const stream = require('./stream');
    let writeStream = new stream.WritableBufferStream();
    doc.pipe(writeStream);
    renderHeader(data, doc)
    renderTransactionTable(data, doc)
    if (doc.y > 0.8 * doc.page.height) {
      doc.addPage()
    }
    renderGivingsTable(data, doc)
    if (doc.y > 0.8 * doc.page.height) {
      doc.addPage()
    }
    renderSavingsTable(data, doc)
    doc.end()
    doc.pipe(fs.createWriteStream("./document.pdf"));
    writeStream.on('finish', () => {
      resolve(writeStream.toBuffer())
    });
  })
}


function toPascalCase(sentence) {

  return sentence.toLowerCase().split(' ')

    .map(word => word[0]

      .toUpperCase()

      .concat(word.slice(1)))

    .join(' ')

}



function toUsDateFormat(_date) {

  const date = new Date(_date);

  let usDate = ('0' + (date.getMonth() + 1)).slice(-2) + '-' + date.getDate() + '-' + date.getFullYear();

  return usDate

}




function transactionDateFormat(dateString) {

  var usDateFormat = dateString.split("-")[1] + "-" + dateString.split("-")[2] + "-" + dateString.split("-")[0]

  return usDateFormat

}



function spavingDateFormat(isoDateString) {

  const date = new Date(isoDateString);

  var spavingDateFormat = date.toLocaleString('default', { month: 'short' }) + " " + date.getFullYear()

  return spavingDateFormat

}

module.exports = {
  convertToPdf
}