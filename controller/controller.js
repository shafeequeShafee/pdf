
const {datas}= require("../dataset/data.js")
const { convertToPdf}=require("../pdfkitService/pdfkit")

const createSpavePdf = async (req, res) => {
  try {
    var bufferData;
    bufferData =await convertToPdf(datas)
    console.log(bufferData)
    const isItBuffer = Buffer.isBuffer(bufferData);
    console.log(isItBuffer);
    res.send(bufferData)
  }
  catch (error) {
    console.error(error);
    res.render("400");
  }
};


module.exports = {
  createSpavePdf
}
