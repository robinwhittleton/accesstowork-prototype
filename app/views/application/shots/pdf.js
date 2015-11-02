var page = {
  width:595,  // A4 width (in pts at 72dpi)
  height:842, // A4 height 
  margin:20   // margin!
};

// require the stuff.
var fs = require('fs');
var PDFDocument = require('pdfkit');

// create a document object
var doc = new PDFDocument({
  size:[page.width,page.height] 
});

// read all the files.
var files = fs.readdirSync('.');
for (var i = 0; i < files.length; i++) 
{
  var file = files[i];

  // only use the PNG files.
  var suffix = file.substr(-4);
  if (suffix == '.png')
  {
    if (typeof first != "undefined") doc.addPage();
    var first = true;
    doc.image(file,page.margin,page.margin,{width:page.width-2*page.margin});
  }
};

// create the file.
doc.pipe(fs.createWriteStream('output.pdf'));
doc.end();